package td.enterprise.wanalytics.etl.task.sync;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import td.enterprise.entity.BsDeviceRlt;
import td.enterprise.entity.BsExecLog;
import td.enterprise.entity.BsShop;
import td.enterprise.service.SyncBsDataService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.HttpsRequestUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

@Slf4j
public class SyncBsDeviceRltDataTask {

	static SqlSession sqlSession = null;
	
	private final static String POST_METHOD = "POST";
	
	private final static String REQUEST_URL_DEVICE_RLT = SysConfigUtil.getProp().getProperty("request.url.device.rlt"); // 店铺和设备关系
	
	private final static int WAIT_TIME = Integer.valueOf(SysConfigUtil.getProp().getProperty("wait_time")); // 循环内等待时长，区分每次http请求，防止请求密度过大
	
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
//            String runDate = "2017-12-06";

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
		shopLog.setCode("device_rlt");
		shopLog.setTerm(runDate);
        List<BsExecLog> deviceRlgLog = SyncBsDataService.getExecLog(sqlSession, shopLog);
        // 当天已经执行过
        if (deviceRlgLog != null && deviceRlgLog.size() > 0) {
        	// 判断最新一条执行记录是否成功
        	BsExecLog log = deviceRlgLog.get(deviceRlgLog.size() - 1);
        	if ("1".equals(String.valueOf(log.getExecResult()))) {
        		isRerun = "1";
        		SyncBsDataService.deleteDeviceRltByRunDate(sqlSession, runDate);
        	} else {
        		isRerun = "2";
        	}
        } else {
        	isRerun = "2";
        }
        // 查询最新的店铺数据
        List<BsShop> bsShopList = SyncBsDataService.queryListByRecentShop(sqlSession, runDate);
        
        // 执行同步绫致店铺与设备关系接口数据
        long start = System.currentTimeMillis();
        if (bsShopList != null && bsShopList.size() > 0) {
        	batchSyncDataByRlt(runDate, isRerun, bsShopList);
        } else {
        	log.error("没有"+runDate+"的设备关系数据");
        	// 记录日志
        }
        log.info("执行同步绫致店铺与设备关系接口数据共花费:{} 毫秒", (System.currentTimeMillis() - start));
	}
	
	/**
	* <p>Description: 同步绫致店铺与设备关系接口数据</p>
	* @param runDate
	* @param isRerun
	* @return
	* @author liyinglei 
	* @date 2017年10月17日下午7:25:58
	 */
	public static List<BsDeviceRlt> batchSyncDataByRlt(String runDate, String isRerun, List<BsShop> bsShopList) {
		
		BsExecLog execLog = new BsExecLog(); // 日志
		
		execLog.setUrl(REQUEST_URL_DEVICE_RLT);
		
		List<BsDeviceRlt> bsDeviceRltList = new ArrayList<BsDeviceRlt>();
		
		try {
			
			String[] shopIds = new String[100];
			
			int shopIndex = 0; // 数组游标
			
			for (int i = 0; i < bsShopList.size(); i++) {
				
				shopIds[shopIndex] = bsShopList.get(i).getShopId();
				shopIndex++;
				if (i > 0 && (i + 1) % 100 == 0) {
					
					JSONObject jsonObj = new JSONObject();
					
					jsonObj.put("shopIds", shopIds);
					
					String param = jsonObj.toString();
					
					Thread.sleep(WAIT_TIME);
					
					JSONObject results = HttpsRequestUtil.httpRequest(REQUEST_URL_DEVICE_RLT, POST_METHOD, param);
					
					System.out.println("访问绿洲接口"+DateUtil.format(new Date(), "yyyy-MM-dd HH:mm:ss"));
					
					shopIndex = 0; // 初始化游标
					
					shopIds = new String[100]; // 初始化数组
					
					Date currentDate = new Date();
					
//					log.debug(results.toString());
					
					if (results != null && results.getString("code").equals("0")) {
						
						JSONArray data = results.getJSONArray("data");
						
						for (Object object : data) {
							
							BsDeviceRlt bsDeviceRlt = new BsDeviceRlt();
							
							JSONObject obj = (JSONObject) object;
							String devSn = obj.getString("devSN"); // 设备序列号
							String devModel = obj.getString("devModel"); // 设备型号
							String shopId = obj.getString("shopId"); // 店铺ID
							String devType = obj.getString("devType"); // 设备类型 AC:AC 设备  XIAOBEIROUTER 小贝路由 
							String aliasname = obj.getString("aliasName"); // 设备别名 
							
							// 封装对象
							bsDeviceRlt.setDevSn(devSn);
							bsDeviceRlt.setDevModel(devModel);
							bsDeviceRlt.setShopId(shopId);
							bsDeviceRlt.setDevType(devType);
							bsDeviceRlt.setAliasname(aliasname);
							bsDeviceRlt.setCreateTime(currentDate);
							bsDeviceRlt.setUpdateTime(currentDate);
							bsDeviceRlt.setRunDate(runDate);
							
							bsDeviceRltList.add(bsDeviceRlt);
						}
					} else {
						log.error("周期 date:{} 的设备关系数据请求失败", runDate);
						execLog.setExecResult(3);
					}
				}
			}
			
			StringBuffer sb = new StringBuffer();
	        for(int i=0; i< shopIds.length; i++) {
	            if(shopIds[i] == null) {
	                continue;
	            }
	            sb.append(shopIds[i]);
	            if(i != shopIds.length - 1) {
	                sb.append(";");
	            }
	        }
	        //用String的split方法分割，得到数组
	        shopIds = sb.toString().split(";");
			
			Thread.sleep(WAIT_TIME);
			
			// 请求剩余shopIds
			if (shopIndex > 0) {
				
				JSONObject jsonObj = new JSONObject();
				
				jsonObj.put("shopIds", shopIds);
				
				String param = jsonObj.toString();
				
				JSONObject results = HttpsRequestUtil.httpRequest(REQUEST_URL_DEVICE_RLT, POST_METHOD, param);
				
				Date currentDate = new Date();
				
				if (results != null && results.getString("code").equals("0")) {
					
					JSONArray data = results.getJSONArray("data");
					
					for (Object object : data) {
						
						BsDeviceRlt bsDeviceRlt = new BsDeviceRlt();
						
						JSONObject obj = (JSONObject) object;
						String devSn = obj.getString("devSN"); // 设备序列号
						String devModel = obj.getString("devModel"); // 设备型号
						String shopId = obj.getString("shopId"); // 店铺ID
						String devType = obj.getString("devType"); // 设备类型 AC:AC 设备  XIAOBEIROUTER 小贝路由 
						String aliasname = obj.getString("aliasName"); // 设备别名 
						
						// 封装对象
						bsDeviceRlt.setDevSn(devSn);
						bsDeviceRlt.setDevModel(devModel);
						bsDeviceRlt.setShopId(shopId);
						bsDeviceRlt.setDevType(devType);
						bsDeviceRlt.setAliasname(aliasname);
						bsDeviceRlt.setCreateTime(currentDate);
						bsDeviceRlt.setUpdateTime(currentDate);
						bsDeviceRlt.setRunDate(runDate);
						
						bsDeviceRltList.add(bsDeviceRlt);
					}
				} else {
					log.error("周期 date:{} 的设备关系数据请求失败", runDate);
					execLog.setExecResult(3);
				}
			}
			
			if (execLog.getExecResult() == null) {
				// 执行批量保存店铺与设备关系
				int saveFlag = SyncBsDataService.batchInsertDeviceRlt(sqlSession, bsDeviceRltList);
				if (saveFlag > 0) {
					// 成功
					execLog.setExecResult(1);
				} else {
					// 失败
					execLog.setExecResult(2);
				}
			}
			
			execLog.setName("绫致店铺与设备关系");
			execLog.setCode("device_rlt");
			execLog.setIsRerun(Integer.valueOf(isRerun));
			execLog.setTerm(runDate);
			execLog.setUrl(REQUEST_URL_DEVICE_RLT);
			execLog.setCreateTime(new Date());
			
		} catch (Exception e) {
			execLog.setExecResult(2);
			log.error("执行绫致店铺与设备关系接口同步异常", e);
		} finally {
			// 记录绫致店铺与设备关系接口同步数据执行日志
			try {
				SyncBsDataService.saveExecLog(sqlSession, execLog);
			} catch (Exception e) {
				log.error("保存设备关系执行日志失败", e);
			}
		}
		return bsDeviceRltList;
	}
	
}
