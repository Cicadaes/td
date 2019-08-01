
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONArray;
import net.sf.json.JSONNull;
import net.sf.json.JSONObject;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import td.enterprise.entity.BsAuthHistory;
import td.enterprise.entity.BsDevAp;
import td.enterprise.entity.BsDevice;
import td.enterprise.entity.BsDeviceRlt;
import td.enterprise.entity.BsExecLog;
import td.enterprise.entity.BsShop;
import td.enterprise.service.SyncBsDataService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.HttpsRequestUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import com.mysql.jdbc.StringUtils;

@Slf4j
public class TestSyncBsDataTask {

	static SqlSession sqlSession = null;
	
	private final static String GET_METHOD = "GET";
	
	private final static String POST_METHOD = "POST";
	
	private final static String REQUEST_URL_SHOP = "https://lvzhouapi.h3c.com/user/shop"; // 店铺
	
	private final static String REQUEST_URL_SHOP_DEVICE_RLT = "https://lvzhouapi.h3c.com/shop/device"; // 店铺和设备关系
	
	private final static String REQUEST_URL_DEVICE = "https://lvzhouapi.h3c.com/device/operation"; // 设备
	
	private final static String REQUEST_URL_AP = "https://lvzhouapi.h3c.com/device/apinfo?devsn="; // AP
	
	private final static String REQUEST_URL_SSID = "https://lvzhouapi.h3c.com/device/ssidinfo?devsn="; // SSID
	
	private final static String REQUEST_URL_REALTIME_MAC = "https://lvzhouapi.h3c.com/device/ssid/clientmac"; // 实时连接终端MAC
	
	private final static String REQUEST_URL_AUTH_HISTORY = "https://lvzhouapi.h3c.com/api/o2oportal/getAuthUserInfo"; // 历史认证

	private final static String COLUMN_BRAND_KEY = "品牌";
	
	private final static String COLUMN_STAUS_KEY = "店铺状态";
	
	private final static String COLUMN_SHOP_CODE_KEY = "店铺编号";
	
	private final static int WAIT_TIME = 2; // 循环内等待时长，区分每次http请求，防止请求密度过大
	
	public static void main(String[] args) {

		SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
		sqlSession = sqlSessionFactory.openSession();
		try {
//			Options options = new Options();
//			options.addOption("runDate", "runDate", true, "执行日期");
//			CommandLineParser parser = new PosixParser();
//			CommandLine lines = parser.parse(options, args);
//			String runDate = lines.getOptionValue("runDate");

//          //test data
            String runDate = "2017-10-18";

//			execute(runDate);
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
		shopLog.setCode("shop");
		shopLog.setTerm(runDate);
        List<BsExecLog> execShopLog = getExecLog(sqlSession, shopLog);
        // 当天已经执行过
        if (execShopLog != null && execShopLog.size() > 0) {
        	// 判断最新一条执行记录是否成功
        	BsExecLog log = execShopLog.get(execShopLog.size() - 1);
        	if (log.getExecResult().equals("1")) {
        		isRerun = "1";
        	} else {
        		isRerun = "2";
        	}
        } else {
        	isRerun = "2";
        }
        // 执行同步绫致店铺接口数据
        List<BsShop> bsShopList = batchSyncDataByShop(runDate, isRerun);
        
        List<BsDeviceRlt> bsDeviceRltList = null;
        
        // 执行同步绫致店铺与设备关系接口数据
        if (bsShopList != null && bsShopList.size() > 0) {
        	bsDeviceRltList = batchSyncDataByRlt(runDate, isRerun, bsShopList);
        } else {
        	// 从DB获取最近一天店铺数据
        }
        // 执行同步绫致设备接口数据
        if (bsDeviceRltList != null && bsDeviceRltList.size() > 0) {
        	batchSyncDataByDevice(runDate, isRerun, bsDeviceRltList);
        } else {
        	// 从DB获取最近一天店铺与设备关系数据
        }
        
        // 执行同步绫致AP设备接口数据
        if (bsDeviceRltList != null && bsDeviceRltList.size() > 0) {
        	batchSyncDataByApDev(runDate, isRerun, bsDeviceRltList);
        } else {
        	// 从DB获取最近一天店铺与设备关系数据
        }
        
        // 执行同步绫致历史认证接口数据
        batchSyncDataByAuthHistory(runDate, isRerun, bsShopList);
        
	}
	
	/**
	* <p>Description: 同步绫致店铺接口数据</p>
	* @param runDate
	* @param isRerun
	* @return
	* @author liyinglei 
	* @date 2017年10月16日下午7:25:58
	 */
	public static List<BsShop> batchSyncDataByShop(String runDate, String isRerun) {
		
		BsExecLog execLog = new BsExecLog(); // 日志
		
		List<BsShop> bsShopList = new ArrayList<BsShop>();
		
		try {
			JSONObject results = HttpsRequestUtil.httpRequest(REQUEST_URL_SHOP, GET_METHOD, null);
			
			Date currentDate = new Date();
			
//			log.debug(results.toString());
			
			if (results != null && results.getString("code").equals("0")) {
				
				JSONArray data = results.getJSONArray("data");
				
				for (Object object : data) {
					BsShop bsShop = new BsShop();
					JSONObject obj = (JSONObject) object;
	//				String userName = obj.getString("userName"); // 绿洲平台用户
					String shopName = obj.getString("shopName"); // 店铺名称
					String shopId = obj.getString("shopId"); // 店铺ID
					String province = obj.getString("province"); // 省
					String city = obj.getString("city"); // 市
					String area = obj.getString("area"); // 区
					String address = obj.getString("address"); // 地址
					String phone = obj.getString("phone"); // 电话
					String scenarioName = obj.getString("scenarioName"); // 场景名称
					String shopStatus = ""; // 店铺状态
					String brand = ""; // 品牌
					String shopCode = ""; // 店铺编号
					// 解析自定义列   品牌、店铺状态、店铺编号
					// ***************暂时略过没有自定义列的数据******************
					if (obj.get("columns") instanceof JSONNull) {
						log.warn(shopId + "-" + shopName + "：店铺没有自定义列");
						continue;
					}
					JSONArray columns = obj.getJSONArray("columns");
					for (Object objectCn : columns) {
						JSONObject jsonCn = (JSONObject) objectCn;
						// 品牌
						if (jsonCn.getString("name") != null && jsonCn.getString("name").equals(COLUMN_BRAND_KEY)) {
							brand = jsonCn.getString("value");
						}
						// 店铺状态
						if (jsonCn.getString("name") != null && jsonCn.getString("name").equals(COLUMN_STAUS_KEY)) {
							// 1-开店中  2-已闭店  3-装修中
							shopStatus = jsonCn.getString("value");
						}
						// 店铺编号
						if (jsonCn.getString("name") != null && jsonCn.getString("name").equals(COLUMN_SHOP_CODE_KEY)) {
							shopCode = jsonCn.getString("value");
						}
					}
					// 封装对象
					bsShop.setShopId(shopId);
					bsShop.setShopCode(shopCode);
					bsShop.setShopName(shopName);
					bsShop.setShopStatus(shopStatus);
					bsShop.setAddress(address);
					bsShop.setArea(area);
					bsShop.setBrand(brand);
					bsShop.setCity(city);
					bsShop.setPhone(phone);
					bsShop.setProvince(province);
					bsShop.setScenarioName(scenarioName);
					bsShop.setCreateTime(currentDate);
					bsShop.setUpdateTime(currentDate);
					
					bsShopList.add(bsShop);
				}
				// 执行批量保存店铺
				int saveFlag = SyncBsDataService.batchInsertShop(sqlSession, bsShopList);
				if (saveFlag > 0) {
					// 成功
					execLog.setExecResult(1);
				} else {
					// 失败
					execLog.setExecResult(2);
				}
			} else {
				log.warn("周期 date:{} 无数据", runDate);
			}
			
			execLog.setName("绫致店铺");
			execLog.setCode("shop");
			execLog.setIsRerun(Integer.valueOf(isRerun));
			execLog.setTerm(runDate);
			execLog.setUrl(REQUEST_URL_SHOP);
			execLog.setCreateTime(new Date());
		} catch (Exception e) {
			execLog.setExecResult(2);
			log.error("执行绫致店铺接口同步异常", e);
		} finally {
			// 记录绫致店铺接口同步数据执行日志
			try {
				saveExecLog(execLog);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return bsShopList;
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
		
		List<BsDeviceRlt> bsDeviceRltList = new ArrayList<BsDeviceRlt>();
		
		try {
			
			String[] shopIds = new String[100];
			
			int shopIndex = 0; // 数组游标
			
			for (int i = 0; i < bsShopList.size(); i++) {
				
				if (i % 10 == 0) {
					Thread.sleep(WAIT_TIME);
				}
				
				shopIds[shopIndex] = bsShopList.get(i).getShopId();
				shopIndex++;
				if (i > 0 && (i + 1) % 100 == 0) {
					
					JSONObject jsonObj = new JSONObject();
					
					jsonObj.put("shopIds", shopIds);
					
					String param = jsonObj.toString();
					
					JSONObject results = HttpsRequestUtil.httpRequest(REQUEST_URL_SHOP_DEVICE_RLT, POST_METHOD, param);
					
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
							
							bsDeviceRltList.add(bsDeviceRlt);
						}
					} else {
						log.warn("周期 date:{} 无数据", runDate);
					}
				}
			}
			
			// 请求剩余shopIds
			if (shopIndex > 0) {
				
				JSONObject jsonObj = new JSONObject();
				
				jsonObj.put("shopIds", shopIds);
				
				String param = jsonObj.toString();
				
				JSONObject results = HttpsRequestUtil.httpRequest(REQUEST_URL_SHOP_DEVICE_RLT, POST_METHOD, param);
				
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
						
						bsDeviceRltList.add(bsDeviceRlt);
					}
				} else {
					log.warn("周期 date:{} 无数据", runDate);
				}
			}
			
			// 执行批量保存店铺与设备关系
			int saveFlag = SyncBsDataService.batchInsertDeviceRlt(sqlSession, bsDeviceRltList);
			if (saveFlag == 1) {
				// 成功
				execLog.setExecResult(1);
			} else {
				// 失败
				execLog.setExecResult(2);
			}
			
			execLog.setName("绫致店铺与设备关系");
			execLog.setCode("shop_device_rlt");
			execLog.setIsRerun(Integer.valueOf(isRerun));
			execLog.setTerm(runDate);
			execLog.setUrl(REQUEST_URL_SHOP_DEVICE_RLT);
			execLog.setCreateTime(new Date());
			
		} catch (Exception e) {
			execLog.setExecResult(2);
			log.error("执行绫致店铺与设备关系接口同步异常", e);
		} finally {
			// 记录绫致店铺与设备关系接口同步数据执行日志
			try {
				saveExecLog(execLog);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return bsDeviceRltList;
	}
	
	/**
	* <p>Description: 同步绫致店铺设备接口数据</p>
	* @param runDate
	* @param isRerun
	* @param bsDeviceRltList
	* @return
	* @author liyinglei 
	* @date 2017年10月17日下午7:25:58
	 */
	public static List<BsDevice> batchSyncDataByDevice(String runDate, String isRerun, List<BsDeviceRlt> bsDeviceRltList) {
		
		BsExecLog execLog = new BsExecLog(); // 日志
		
		List<BsDevice> bsDeviceList = new ArrayList<BsDevice>();
		
		int arraySize = 80;
		
		try {
			
			JSONObject jsonObj = new JSONObject();
			
			jsonObj.put("method", "getBasicDevInfo");
			
			String[] devSns = new String[arraySize];
			
			int devSnIndex = 0; // 数组游标
			
			for (int i = 0; i < bsDeviceRltList.size(); i++) {
				
				if (i % 10 == 0) {
					Thread.sleep(WAIT_TIME);
				}
				
				devSns[devSnIndex] = bsDeviceRltList.get(i).getDevSn();
//				String shopId = bsDeviceRltList.get(i).getShopId();
				devSnIndex++;
				if (i > 0 && (i + 1) % arraySize == 0) {
					
					jsonObj.put("devSN", devSns);
					
					String param = jsonObj.toString();
					
					JSONObject results = HttpsRequestUtil.httpRequest(REQUEST_URL_DEVICE, POST_METHOD, param);
					
					Date currentDate = new Date();
					
//					log.debug(results.toString());
					
					devSnIndex = 0; // 初始化游标
					
					devSns = new String[arraySize]; // 初始化数组
					
					// 请求成功
					if (results != null && results.getString("code").equals("0")) {
						
						JSONArray data = results.getJSONArray("data");
						
						for (Object object : data) {
							
							BsDevice bsDevice = new BsDevice();
							
							JSONObject obj = (JSONObject) object;
							String devSn = obj.getString("devSN"); // 设备名称
							String devName = obj.getString("devName"); // 设备序列号
							String devHardVersion = obj.getString("devHardVersion"); // /设备当前硬件版本信息 
							String devSoftVersion = obj.getString("devSoftVersion"); // 设备当前软件版本信息 
							String devMode = obj.getString("devMode"); // 设备型号
							String devType = obj.getString("devType"); // 设备类型 AC:AC 设备  XIAOBEIROUTER 小贝路由 
							String devOnlineTime = obj.getString("devOnlineTime"); // 设备运行时长 
							JSONObject devLocation = (JSONObject) obj.get("devLocation"); // {country:String,province:String,city:String},  //设备位置
							String devLocationCountry = devLocation.getString("country");
							String devLocationProvince = devLocation.getString("province");
							String devLocationCity = devLocation.getString("city");
							String devAddress = obj.getString("devAddress"); // 设备出口 IP 
							String devMac = obj.getString("devMAC"); // 设备 MAC  大 AC  为空 
							String memoryTotalSize = obj.getString("memoryTotalSize"); // 设备内存
							String diskTotalSize = obj.getString("diskTotalSize"); // 设备 flash大小
							String devStatus = obj.getString("devStatus"); // 设备状态 online/ offline 
							
							// 封装对象
							bsDevice.setDevSn(devSn);
							bsDevice.setDevName(devName);
							bsDevice.setDevHardVersion(devHardVersion);
							bsDevice.setDevSoftVersion(devSoftVersion);
							bsDevice.setDevMode(devMode);
							bsDevice.setDevType(devType);
							bsDevice.setDevOnlineTime(!StringUtils.isNullOrEmpty(devOnlineTime) ? Integer.valueOf(devOnlineTime) : null);
							bsDevice.setDevLocationCountry(devLocationCountry);
							bsDevice.setDevLocationProvince(devLocationProvince);
							bsDevice.setDevLocationCity(devLocationCity);
							bsDevice.setDevAddress(devAddress);
							bsDevice.setDevMac(devMac);
							bsDevice.setMemoryTotalSize(!StringUtils.isNullOrEmpty(memoryTotalSize) && !"N/A".equals(memoryTotalSize) ? Integer.valueOf(memoryTotalSize) : null);
							bsDevice.setDiskTotalSize(!StringUtils.isNullOrEmpty(diskTotalSize) && !"N/A".equals(diskTotalSize) ? Integer.valueOf(diskTotalSize) : null);
							bsDevice.setDevStatus(devStatus);
							bsDevice.setCreateTime(currentDate);
							bsDevice.setUpdateTime(currentDate);
							
							bsDeviceList.add(bsDevice);
						}
					} else {
						log.warn("周期 date:{} 无数据", runDate);
					}
				}
			}
			
			// 请求剩余devSns
			if (devSnIndex > 0) {
				
				jsonObj.put("devSN", devSns);
				
				String param = jsonObj.toString();
				
				JSONObject results = HttpsRequestUtil.httpRequest(REQUEST_URL_DEVICE, POST_METHOD, param);
				
				Date currentDate = new Date();
				
				// 请求成功
				if (results != null && results.getString("code").equals("0")) {
					
					JSONArray data = results.getJSONArray("data");
					
					for (Object object : data) {
						
						BsDevice bsDevice = new BsDevice();
						
						JSONObject obj = (JSONObject) object;
						String devSn = obj.getString("devSN"); // 设备名称
						String devName = obj.getString("devName"); // 设备序列号
						String devHardVersion = obj.getString("devHardVersion"); // /设备当前硬件版本信息 
						String devSoftVersion = obj.getString("devSoftVersion"); // 设备当前软件版本信息 
						String devMode = obj.getString("devMode"); // 设备型号
						String devType = obj.getString("devType"); // 设备类型 AC:AC 设备  XIAOBEIROUTER 小贝路由 
						String devOnlineTime = obj.getString("devOnlineTime"); // 设备运行时长 
						JSONObject devLocation = (JSONObject) obj.get("devLocation"); // {country:String,province:String,city:String},  //设备位置
						String devLocationCountry = devLocation.getString("country");
						String devLocationProvince = devLocation.getString("province");
						String devLocationCity = devLocation.getString("city");
						String devAddress = obj.getString("devAddress"); // 设备出口 IP 
						String devMac = obj.getString("devMAC"); // 设备 MAC  大 AC  为空 
						String memoryTotalSize = obj.getString("memoryTotalSize"); // 设备内存
						String diskTotalSize = obj.getString("diskTotalSize"); // 设备 flash大小
						String devStatus = obj.getString("devStatus"); // 设备状态 online/ offline 
						
						// 封装对象
						bsDevice.setDevSn(devSn);
						bsDevice.setDevName(devName);
						bsDevice.setDevHardVersion(devHardVersion);
						bsDevice.setDevSoftVersion(devSoftVersion);
						bsDevice.setDevMode(devMode);
						bsDevice.setDevType(devType);
						bsDevice.setDevOnlineTime(devOnlineTime != null ? Integer.valueOf(devOnlineTime) : null);
						bsDevice.setDevLocationCountry(devLocationCountry);
						bsDevice.setDevLocationProvince(devLocationProvince);
						bsDevice.setDevLocationCity(devLocationCity);
						bsDevice.setDevAddress(devAddress);
						bsDevice.setDevMac(devMac);
						bsDevice.setMemoryTotalSize(memoryTotalSize != null ? Integer.valueOf(memoryTotalSize) : null);
						bsDevice.setDiskTotalSize(diskTotalSize != null ? Integer.valueOf(diskTotalSize) : null);
						bsDevice.setDevStatus(devStatus);
						bsDevice.setCreateTime(currentDate);
						bsDevice.setUpdateTime(currentDate);
						
						bsDeviceList.add(bsDevice);
					}
				} else {
					log.warn("周期 date:{} 无数据", runDate);
				}
			}
			
			// 执行批量保存店铺设备
			int saveFlag = SyncBsDataService.batchInsertDevice(sqlSession, bsDeviceList);
			if (saveFlag == 1) {
				// 成功
				execLog.setExecResult(1);
			} else {
				// 失败
				execLog.setExecResult(2);
			}
			
			execLog.setName("绫致店铺设备");
			execLog.setCode("device");
			execLog.setIsRerun(Integer.valueOf(isRerun));
			execLog.setTerm(runDate);
			execLog.setUrl(REQUEST_URL_DEVICE);
			execLog.setCreateTime(new Date());
			
		} catch (Exception e) {
			execLog.setExecResult(2);
			log.error("执行绫致店铺设备接口同步异常", e);
		} finally {
			// 记录绫致店铺设备接口同步数据执行日志
			try {
				saveExecLog(execLog);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return bsDeviceList;
	}
	
	/**
	* <p>Description: 同步绫致店铺AP设备接口数据</p>
	* @param runDate
	* @param isRerun
	* @param bsDeviceRltList
	* @return
	* @author liyinglei 
	* @date 2017年10月17日下午7:25:58
	 */
	public static List<BsDevAp> batchSyncDataByApDev(String runDate, String isRerun, List<BsDeviceRlt> bsDeviceRltList) {
		
		BsExecLog execLog = new BsExecLog(); // 日志
		
		List<BsDevAp> bsDevApList = new ArrayList<BsDevAp>();
		
		try {
			
			for (int i = 0; i < bsDeviceRltList.size(); i++) {
				
				if (i % 10 == 0) {
					Thread.sleep(WAIT_TIME);
				}
				
				// 排除小贝
				if (!bsDeviceRltList.get(i).getDevType().equals("AC")) {
					continue;
				}
				
				String devSn = bsDeviceRltList.get(i).getDevSn();
//				String shopId = bsDeviceRltList.get(i).getShopId();
				
				String url = REQUEST_URL_AP + devSn;
					
				JSONObject results = HttpsRequestUtil.httpRequest(url, GET_METHOD, null);
				
				Date currentDate = new Date();
				
//				log.debug(results.toString());
				
				// 请求成功
				if (results != null && results.getString("code").equals("0")) {
					
					JSONArray data = results.getJSONArray("data");
					
					for (Object object : data) {
						
						BsDevAp bsDevAp = new BsDevAp();
						
						JSONObject obj = (JSONObject) object;
						String apIp = obj.getString("apIp"); // 设备名称
						String apSn = obj.getString("apSN"); // 设备名称
						String apName = obj.getString("apName"); // 设备序列号
						String apModel = obj.getString("apModel"); // /设备当前硬件版本信息 
						String apSoftVersion = obj.getString("apSoftVersion"); // 设备当前软件版本信息 
						String apStatus = obj.getString("apStatus"); // 设备型号
						String apOnlineTime = obj.getString("apOnlineTime"); // 设备类型 AC:AC 设备  XIAOBEIROUTER 小贝路由 
						String apMac = obj.getString("apMAC"); // 设备运行时长 
						
						// 封装对象
						bsDevAp.setApIp(apIp);
						bsDevAp.setApSn(apSn);
						bsDevAp.setApName(apName);
						bsDevAp.setApModel(apModel);
						bsDevAp.setApVersion(apSoftVersion);
						bsDevAp.setApStatus(Integer.valueOf(apStatus));
						bsDevAp.setApOnlineTime(!StringUtils.isNullOrEmpty(apOnlineTime) ? Integer.valueOf(apOnlineTime) : null);
						bsDevAp.setApMac(apMac);
						bsDevAp.setAcSn(devSn);
						bsDevAp.setCreateTime(currentDate);
						bsDevAp.setUpdateTime(currentDate);
						
						bsDevApList.add(bsDevAp);
					}
				} else {
					log.warn("周期 date:{} 无数据", runDate);
				}
			}
			
			// 执行批量保存AP设备
			int saveFlag = SyncBsDataService.batchInsertDevAp(sqlSession, bsDevApList);
			if (saveFlag == 1) {
				// 成功
				execLog.setExecResult(1);
			} else {
				// 失败
				execLog.setExecResult(2);
			}
			
			execLog.setName("绫致店铺AP设备");
			execLog.setCode("device_ap");
			execLog.setIsRerun(Integer.valueOf(isRerun));
			execLog.setTerm(runDate);
			execLog.setUrl(REQUEST_URL_AP);
			execLog.setCreateTime(new Date());
			
		} catch (Exception e) {
			execLog.setExecResult(2);
			log.error("执行绫致AP设备接口同步异常", e);
		} finally {
			// 记录绫致AP设备接口同步数据执行日志
			try {
				saveExecLog(execLog);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return bsDevApList;
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
		
		List<BsAuthHistory> bsAuthHistoryList = new ArrayList<BsAuthHistory>();
		
//		String ssid = "-Free-WiFi";
		
		String beginTimeStr = runDate + " 00:00:00";
		
		String endTimeStr = runDate + " 23:59:59";
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		try {
			
			// url请求输入参数
			
			Date dateBegin = format.parse(beginTimeStr);
			
			Date dateEnd = format.parse(endTimeStr);
			
			long beginTime = dateBegin.getTime();
			
			long endTime = dateEnd.getTime();
			
			String pageSize = "5000";
			
			String pageIndex = "1";
			
			for (int i = 0; i < bsShopList.size(); i++) {
				
				String shopId = bsShopList.get(i).getShopId();
				
				if (i % 10 == 0) {
					Thread.sleep(WAIT_TIME);
				}
				
				// 拼接url
				String url = REQUEST_URL_AUTH_HISTORY + "?shop_id=" + shopId + "&begin_time=" + beginTime +
						"&end_time=" + endTime + "&pageSize=" + pageSize + "&pageIndex=" + pageIndex;
					
				JSONObject results = HttpsRequestUtil.httpRequest(url, GET_METHOD, null);
				
				Date currentDate = new Date();
				
//				log.debug(results.toString());
				
				// 请求成功
				if (results != null && results.getString("code").equals("0")) {
					
					if (!((JSONObject)results.get("data")).has("auth_list")) {
						continue;
					}
					
					JSONArray data = ((JSONObject)results.get("data")).getJSONArray("auth_list");
					
					for (Object object : data) {
						
						BsAuthHistory bsAuthHistory = new BsAuthHistory();
						
						JSONObject obj = (JSONObject) object;
						String apGroupId = obj.getString("ap_group_id"); // AP 分组 ID
						String apMac = obj.getString("ap_mac"); // AP MAC 地址 
						String upstream = obj.getString("upstream"); // 上行流量 
						String downstream = obj.getString("downstream"); // 下行流量 
						String userGroup = obj.getString("user_group"); // 用户组 
//						String shopId = obj.getString("shop_id"); // 场所 ID，绿洲场所的 ID 
						String userType = obj.getString("user_type"); // 认证类型，枚举值：1.一键认证 2.短信认 证 6.微信公众号认证 7.微信连 WIFI 认证 8.APP 认证 9.腾讯安全 WIFI 认证 10.固定 账号认证
						String accessStartTime = obj.getString("access_start_time"); // 接入开始时间
						String accessDuration = obj.getString("access_duration"); // 接入时长 
						String accessAcIp = obj.getString("access_ac_ip"); // 接入 AC 的 IP，已转化为整数 
						String userMac = obj.getString("user_mac"); // 用户的 MAC 地址 
						String userIp = obj.getString("user_ip"); // 用户的 ip，已转化为整数 
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
						bsAuthHistory.setUserType(StringUtils.isNullOrEmpty(userType) ? null : Integer.valueOf(userType));
						bsAuthHistory.setAccessStartTime(accessStartTime);
						bsAuthHistory.setAccessDuration(accessDuration);
						bsAuthHistory.setAccessAcIp(accessAcIp);
						bsAuthHistory.setUserMac(userMac);
						bsAuthHistory.setUserIp(userIp);
						bsAuthHistory.setVendor(vendor);
						bsAuthHistory.setTerminalModel(terminalModel);
						bsAuthHistory.setAccessDurationSum(accessDurationSum);
						bsAuthHistory.setLoginFreqSum(StringUtils.isNullOrEmpty(loginFreqSum) ? null : Integer.valueOf(loginFreqSum));
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
						bsAuthHistory.setSex(StringUtils.isNullOrEmpty(sex) ? null : Integer.valueOf(sex));
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
						
						bsAuthHistory.setShopId(shopId);
						
						bsAuthHistoryList.add(bsAuthHistory);
					}
				} else {
					log.warn("周期 date:{}", runDate, "请求失败");
				}
			}
			
			// 执行批量保存AP设备
			int saveFlag = SyncBsDataService.batchInsertAuthHistory(sqlSession, bsAuthHistoryList);
			if (saveFlag == 1) {
				// 成功
				execLog.setExecResult(1);
			} else {
				// 失败
				execLog.setExecResult(2);
			}
			
			execLog.setName("绫致店铺历史认证数据");
			execLog.setCode("auth_history");
			execLog.setIsRerun(Integer.valueOf(isRerun));
			execLog.setTerm(runDate);
			execLog.setUrl(REQUEST_URL_AUTH_HISTORY);
			execLog.setCreateTime(new Date());
			
		} catch (Exception e) {
			execLog.setExecResult(2);
			log.error("绫致店铺历史认证数据接口同步异常", e);
		} finally {
			// 记录绫致店铺历史认证数据同步数据执行日志
			try {
				saveExecLog(execLog);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return bsAuthHistoryList;
	}
	
	/**
	* <p>Description: 获取执行日志</p>
	* @param sqlSession
	* @param execLog
	* @return
	* @author liyinglei 
	* @date 2017年10月15日下午11:17:35
	 */
	public static List<BsExecLog> getExecLog(SqlSession sqlSession, BsExecLog execLog) {
		List<BsExecLog> queryByList = SyncBsDataService.queryLogByList(sqlSession, execLog);
		if (queryByList==null || queryByList.size()==0) {
			log.info("没有查到"+execLog.getCode()+ "-" + execLog.getTerm() + "的执行日志");
		}
		return queryByList;
    }

	/**
	* <p>Description: 记录执行日志</p>
	* @throws Exception
	* @author liyinglei 
	* @date 2017年10月15日下午11:13:35
	 */
	private static int saveExecLog(BsExecLog execLog) throws Exception {
		return SyncBsDataService.insert(sqlSession, execLog);
	}

}
