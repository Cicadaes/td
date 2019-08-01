package td.enterprise.wanalytics.etl.task.sync;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.httpclient.util.DateUtil;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import td.enterprise.entity.BsAuthHistory;
import td.enterprise.entity.BsExecLog;
import td.enterprise.entity.BsShop;
import td.enterprise.service.SyncBsDataService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.HttpsRequestUtil;
import td.enterprise.wanalytics.etl.util.ListUtils;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

import com.mysql.jdbc.StringUtils;

@Slf4j
public class SyncBsAuthHistoryDataTask {

	static SqlSession sqlSession = null;
	
//	private final static String GET_METHOD = "GET";
	
	private final static String POST_METHOD = "POST";
	
	private final static String REQUEST_URL_AUTH_HISTORY = SysConfigUtil.getProp().getProperty("request.url.auth.history"); // 历史认证

	private final static int WAIT_TIME = Integer.valueOf(SysConfigUtil.getProp().getProperty("wait_time")); // 循环内等待时长，区分每次http请求，防止请求密度过大
	
	private static BlockingQueue<JSONArray> dataQueue = new LinkedBlockingQueue<JSONArray>(); // 数据工作队列
	
	// 请求线程池
	private static ThreadPoolExecutor executor = new ThreadPoolExecutor(4, 20, 0l, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>());
	
	// 数据任务线程池
	private static ThreadPoolExecutor dataExecutor = new ThreadPoolExecutor(4, 20, 0l, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>());
	
	private static Date currentDate = new Date();
	
	// 原子Integer递增对象
	public static AtomicInteger counter = new AtomicInteger(0);
	
	private static Boolean exitFlag = false;
	
	public static void main(String[] args) {

		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		sqlSession = sqlSessionFactory.openSession();
		try {
			Options options = new Options();
			options.addOption("runDate", "runDate", true, "执行日期");
			CommandLineParser parser = new PosixParser();
			CommandLine lines = parser.parse(options, args);
			String runDate = lines.getOptionValue("runDate");

//          //test data
//            String runDate = "2017-11-29";
            
            // 如果需要跑前一天的   把createTime修改为前一天
            /*Date d = new Date();
            Calendar calendar = Calendar.getInstance(); //得到日历
            calendar.setTime(d);//把当前时间赋给日历
            calendar.add(Calendar.DAY_OF_MONTH, -1);  //设置为前一天
            d = calendar.getTime();   //得到前一天的时间
            currentDate = d;*/

			execute(runDate);
		} catch (Exception e) {
			log.error("任务异常 ",e);
			System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
		} finally {
            sqlSession.commit();
			sqlSession.close();
		}
		System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
	}

	private static void execute(String runDate) throws Exception {

		String isRerun = "1";

		// 查询绫致店铺当日执行日志
		BsExecLog shopLog = new BsExecLog();
		shopLog.setCode("auth_history");
		shopLog.setTerm(runDate);
        List<BsExecLog> execShopLog = SyncBsDataService.getExecLog(sqlSession, shopLog);
        // 当天已经执行过
        if (execShopLog != null && execShopLog.size() > 0) {
        	// 判断最新一条执行记录是否成功
        	BsExecLog log = execShopLog.get(execShopLog.size() - 1);
        	if ("1".equals(String.valueOf(log.getExecResult()))) {
        		isRerun = "1";
        		SyncBsDataService.deleteAuthHistoryByRunDate(sqlSession, runDate);
        	} else {
        		isRerun = "2";
        	}
        } else {
        	isRerun = "2";
        }
        
        // 查询最新的绫致店铺接口数据
        List<BsShop> bsShopList = SyncBsDataService.queryListByRecentShop(sqlSession, runDate);
        
        // 执行同步绫致历史认证接口数据
        long start = System.currentTimeMillis();
        if (bsShopList != null && bsShopList.size() > 0) {
        	batchSyncDataByAuthHistory(runDate, isRerun, bsShopList);
        } else {
        	log.error("没有"+runDate+"的历史认证数据");
        }
        log.info("执行同步绫致历史认证接口数据共花费:{} 毫秒", (System.currentTimeMillis() - start));
	}
	
	/**
	* <p>Description: 同步绫致店铺历史认证信息接口数据</p>
	* @param runDate
	* @param isRerun
	* @param bsShopList
	* @return
	* @author liyinglei 
	* @date 2017年10月18日下午7:25:58
	 */
	public static List<BsAuthHistory> batchSyncDataByAuthHistory(String runDate, String isRerun, List<BsShop> bsShopList) {
		
		BsExecLog execLog = new BsExecLog(); // 日志
		
		execLog.setUrl(REQUEST_URL_AUTH_HISTORY);
		
		List<BsAuthHistory> bsAuthHistoryList = new ArrayList<BsAuthHistory>();
		
//		String ssid = "-Free-WiFi";
		
		String beginTimeStr = runDate + " 00:00:00";
		
		String endTimeStr = runDate + " 23:59:59";
		
//		String beginTimeStr = "2017-10-25 00:00:00";
//		
//		String endTimeStr = "2017-10-25 23:59:59";
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		try {
			
			// url请求输入参数
			
			JSONObject jsonObj = new JSONObject();
			
			Date dateBegin = format.parse(beginTimeStr);
			
			Date dateEnd = format.parse(endTimeStr);
			
			long beginTime = dateBegin.getTime();
			
			long endTime = dateEnd.getTime();
			
			String pageSize = "5000";
			
			String pageIndex = "1";
			
			dataExecutor.execute(new DataTask(dataQueue,bsAuthHistoryList,runDate));
			
			List<List<BsShop>> splitList = ListUtils.splitList(bsShopList, 50);
			
			for (int i = 0; i < splitList.size(); i++) {
				
//				counter.incrementAndGet();
				
				List<BsShop> shopList = splitList.get(i);
				
				String[] shopIds = new String[shopList.size()];
				
				for (int j = 0; j < shopIds.length; j++) {
					shopIds[j] = ((BsShop)shopList.get(j)).getShopId();
				}
				
				jsonObj.put("shop_id", shopIds);
				jsonObj.put("begin_time", beginTime);
				jsonObj.put("end_time", endTime);
				jsonObj.put("page_size", pageSize);
				jsonObj.put("page_index", pageIndex);
				
				String param = jsonObj.toString();
				
				Thread.sleep(WAIT_TIME);
				
				executor.execute(new HttpTask(REQUEST_URL_AUTH_HISTORY,param));
				
			}
			
			Thread.sleep(1000 * 60);
			
			exitFlag = true; // 退出
			
			executor.shutdown();
			dataExecutor.shutdown();
			
			try {
			
				executor.awaitTermination(Long.MAX_VALUE, TimeUnit.MINUTES);
				dataExecutor.awaitTermination(Long.MAX_VALUE, TimeUnit.MINUTES);
			
			} catch (Exception e){
				e.printStackTrace();
			}
			
			if (dataExecutor.isTerminated()) {
				if (bsAuthHistoryList != null && bsAuthHistoryList.size() > 0) {
					// 执行批量保存AP设备
					int saveFlag = SyncBsDataService.batchInsertAuthHistory(sqlSession, bsAuthHistoryList);
					if (saveFlag > 0) {
						// 成功
						execLog.setExecResult(1);
					} else {
						// 失败
						execLog.setExecResult(2);
					}
				} else {
					log.warn("周期{} 绫致店铺历史认证数据接口没有数据", runDate);
				}
				execLog.setName("绫致店铺历史认证数据");
				execLog.setCode("auth_history");
				execLog.setIsRerun(Integer.valueOf(isRerun));
				execLog.setTerm(runDate);
				execLog.setUrl(REQUEST_URL_AUTH_HISTORY);
				execLog.setCreateTime(new Date());
			}
			
		} catch (Exception e) {
			execLog.setExecResult(2);
			log.error("绫致店铺历史认证数据接口同步异常", e);
		} finally {
			// 记录绫致店铺历史认证数据同步数据执行日志
			try {
				if (execLog.getExecResult() == null) {
					execLog.setExecResult(2);
				}
				SyncBsDataService.saveExecLog(sqlSession, execLog);
			} catch (Exception e) {
				log.error("保存历史认证执行日志失败", e);
			}
		}
		return bsAuthHistoryList;
	}
	
	/**
	 * <p>Description：HTTP请求任务-执行HTTP API请求 把回传数据push到queue</p>
	 * <p><b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.</b></p>
	 * @author liyinglei
	 * @version 1.0
	 * @date 2017年11月9日上午11:33:15 
	 * @since jdk1.7
	 */
	static class HttpTask implements Runnable {
		
		private final String url;
		
		private final String param;
		
		public HttpTask(String url,String param) {
			this.url = url;
			this.param = param;
		}
		
		@Override
		public void run() {
			
			try {
				
				counter.getAndIncrement();
				
//				System.out.println("【"+counter +"】请求查询"+url);
			
				JSONObject results = HttpsRequestUtil.httpRequest(url, POST_METHOD, param);
				
				// 请求成功
				if (results != null && results.has("code") &&results.getString("code").equals("0")) {
					
					if (((JSONObject)results.get("data")).has("auth_list")) {
						JSONArray data = ((JSONObject)results.get("data")).getJSONArray("auth_list");
						dataQueue.add(data);
					}
				} else if (!results.has("code")){
					log.warn("历史认证数据请求失败：{}", results.toString());
				}
				
			} catch (Exception e) {
				log.warn("历史认证数据请求失败"+url,e);
			}
		}
	}
	
	/**
	 * <p>Description：数据任务-执行解析回传数据组装</p>
	 * <p><b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.</b></p>
	 * @author liyinglei
	 * @version 1.0
	 * @date 2017年11月9日上午11:32:26 
	 * @since jdk1.7
	 */
	static class DataTask implements Runnable {
		
		private BlockingQueue<JSONArray> dataQueue;
		
		private List<BsAuthHistory> bsAuthHistoryList;
		
		private String runDate;
		
		public DataTask(BlockingQueue<JSONArray> dataQueue, List<BsAuthHistory> bsAuthHistoryList, String runDate) {
			this.dataQueue = dataQueue;
			this.bsAuthHistoryList = bsAuthHistoryList;
			this.runDate = runDate;
		}
		
		@Override
		public void run() {
			while(!exitFlag) {
				try {
					if (!dataQueue.isEmpty()) {
						
//						System.out.println("获取数据队列的数据" + dataQueue.size());
						
						JSONArray data = dataQueue.take();
						
//						for (Map.Entry<String,JSONArray> entry : map.entrySet()) {
//							String shopId = entry.getKey();
//							JSONArray data = entry.getValue();
							
							for (Object object : data) {
								
								BsAuthHistory bsAuthHistory = new BsAuthHistory();
								
								JSONObject obj = (JSONObject) object;
								String apGroupId = obj.getString("ap_group_id"); // AP 分组 ID
								String apMac = obj.getString("ap_mac"); // AP MAC 地址 
								String upstream = obj.getString("upstream"); // 上行流量 
								String downstream = obj.getString("downstream"); // 下行流量 
								String userGroup = obj.getString("user_group"); // 用户组 
								String shopId = obj.getString("shop_id"); // 场所 ID，绿洲场所的 ID 
								String userType = obj.getString("user_type"); // 认证类型，枚举值：1.一键认证 2.短信认 证 6.微信公众号认证 7.微信连 WIFI 认证 8.APP 认证 9.腾讯安全 WIFI 认证 10.固定 账号认证
								String accessStartTime = obj.getString("access_start_time"); // 接入开始时间
								String accessDuration = obj.getString("access_duration"); // 接入时长 
								String accessAcIp = obj.getString("access_ac_ip"); // 接入 AC 的 IP，已转化为整数 
								String userMac = obj.getString("user_mac"); // 用户的 MAC 地址 
								String userIp = obj.has("user_ip") ? obj.getString("user_ip") : null; // 用户的 ip，已转化为整数 
								String vendor = obj.getString("vendor"); // 手机厂商 
								String terminalModel = obj.getString("terminal_model"); // 手机型号 
								String accessDurationSum = obj.has("access_duration_sum") ? obj.getString("access_duration_sum") : null; // 累计接入时长 
								String loginFreqSum = obj.has("login_freq_sum") ? obj.getString("login_freq_sum") : null; // 累计登录次数 
								String upstreamSum = obj.has("upstream_sum") ? obj.getString("upstream_sum") : null; // 累计上行流量 
								String downstreamSum = obj.has("downstream_sum") ? obj.getString("downstream_sum") : null; // 累计下行流量
								String offlineType = obj.has("offline_type") ? obj.getString("offline_type") : null; // 下线类型，先预留 
								String mobileNo = obj.has("mobile_no") ? obj.getString("mobile_no") : null; // 手机号
								String userName = obj.has("user_name") ? obj.getString("user_name") : null; // 用户名 
								String appAuthId = obj.getString("app_auth_id"); // app 认证 ID
								String appAccount = obj.getString("app_account"); // app 认证用户名 
								String preliminary = obj.getString("preliminary"); // 权限 
								
								String openId = obj.has("open_id") ? obj.getString("open_id") : null; // 微信用户的 OPENID 
								String nickname = obj.has("nickname") ? obj.getString("nickname") : null; // 微信用户的昵称 
								
								if (!StringUtils.isNullOrEmpty(nickname)) {
									// 对微信昵称base64加密 - 解决昵称中表情多余4个字节问题（utf-8编码最多三个字节）
									nickname = URLEncoder.encode(nickname, "utf-8");
								}
								
								String sex = obj.has("sex") ? obj.getString("sex") : null; // 微信用户的性别，枚举值：0.未知 1.男 2.女 
								String province = obj.has("province") ? obj.getString("province") : null; // 微信用户所在省 
								String city = obj.has("city") ? obj.getString("city") : null; // 微信用户所在城市
								String country = obj.has("country") ? obj.getString("country") : null; // 微信用户所在国家
								String headimgurl = obj.has("headimgurl") ? obj.getString("headimgurl") : null; // 微信用户头像
								String unionid = obj.has("unionid") ? obj.getString("unionid") : null; // 微信用户的唯一标识
								String tid = obj.has("tid") ? obj.getString("tid") : null; // 微信用户加密后的手机号
								String appId = obj.has("app_id") ? obj.getString("app_id") : null; // 公众号的 AppId 
								String mobileDecode = obj.has("mobile_decode") ? obj.getString("mobile_decode") : null; // 解密手机号
								
								// 封装对象
								bsAuthHistory.setApGroupId(apGroupId);
								bsAuthHistory.setApMac(apMac);
								bsAuthHistory.setUpstream(upstream);
								bsAuthHistory.setDownstream(downstream);
								bsAuthHistory.setUserGroup(userGroup);
								bsAuthHistory.setUserType(StringUtils.isNullOrEmpty(userType) || "N/A".equals(userType) ? null : Integer.valueOf(userType));
								bsAuthHistory.setAccessStartTime(accessStartTime);
								bsAuthHistory.setAccessDuration(accessDuration);
								bsAuthHistory.setAccessAcIp(accessAcIp);
								bsAuthHistory.setUserMac(userMac);
								bsAuthHistory.setUserIp(userIp);
								bsAuthHistory.setVendor(vendor);
								bsAuthHistory.setTerminalModel(terminalModel);
								bsAuthHistory.setAccessDurationSum(accessDurationSum);
								bsAuthHistory.setLoginFreqSum(StringUtils.isNullOrEmpty(loginFreqSum) || "N/A".equals(loginFreqSum) ? null : Integer.valueOf(loginFreqSum));
								bsAuthHistory.setUpstreamSum(upstreamSum);
								bsAuthHistory.setDownstreamSum(downstreamSum);
								bsAuthHistory.setOfflineType(offlineType);
								bsAuthHistory.setMobileNo(mobileNo);
								bsAuthHistory.setUserName(userName);
								bsAuthHistory.setAppAuthId(appAuthId);
								bsAuthHistory.setAppAccount(appAccount);
								bsAuthHistory.setPreliminary(preliminary);
								bsAuthHistory.setOpenId(openId);
								bsAuthHistory.setNickname(nickname);
								bsAuthHistory.setSex(StringUtils.isNullOrEmpty(sex) || "N/A".equals(sex) ? null : Integer.valueOf(sex));
								bsAuthHistory.setProvince(province);
								bsAuthHistory.setCity(city);
								bsAuthHistory.setCountry(country);
								bsAuthHistory.setHeadimgurl(headimgurl);
								bsAuthHistory.setUnionid(unionid);
								bsAuthHistory.setTid(tid);
								bsAuthHistory.setAppId(appId);
								bsAuthHistory.setMobileDecode(mobileDecode);
								bsAuthHistory.setCreateTime(currentDate);
								bsAuthHistory.setUpdateTime(currentDate);
								bsAuthHistory.setRunDate(runDate);
								
								bsAuthHistory.setShopId(shopId);
								
								bsAuthHistoryList.add(bsAuthHistory);
							}
//						}
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

}
