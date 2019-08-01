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

import td.enterprise.entity.BsDevice;
import td.enterprise.entity.BsDeviceRlt;
import td.enterprise.entity.BsExecLog;
import td.enterprise.service.SyncBsDataService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.HttpsRequestUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

import com.mysql.jdbc.StringUtils;

@Slf4j
public class SyncBsDeviceDataTask {

	static SqlSession sqlSession = null;
	
	private final static String POST_METHOD = "POST";
	
	private final static String REQUEST_URL_DEVICE = SysConfigUtil.getProp().getProperty("request.url.device"); // 设备

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
		shopLog.setCode("device");
		shopLog.setTerm(runDate);
        List<BsExecLog> execShopLog = SyncBsDataService.getExecLog(sqlSession, shopLog);
        // 当天已经执行过
        if (execShopLog != null && execShopLog.size() > 0) {
        	// 判断最新一条执行记录是否成功
        	BsExecLog log = execShopLog.get(execShopLog.size() - 1);
        	if ("1".equals(String.valueOf(log.getExecResult()))) {
        		isRerun = "1";
        		SyncBsDataService.deleteDeviceByRunDate(sqlSession, runDate);
        	} else {
        		isRerun = "2";
        	}
        } else {
        	isRerun = "2";
        }
        List<BsDeviceRlt> bsDeviceRltList = SyncBsDataService.queryListByRecentDeviceRlt(sqlSession, runDate);
        
        // 执行同步绫致设备接口数据
        long start = System.currentTimeMillis();
        if (bsDeviceRltList != null && bsDeviceRltList.size() > 0) {
        	batchSyncDataByDevice(runDate, isRerun, bsDeviceRltList);
        } else {
        	// 记录日志
        	log.error("没有"+runDate+"的设备数据");
        }
        log.info("执行同步绫致设备接口数据共花费:{} 毫秒", (System.currentTimeMillis() - start));
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
		
		execLog.setUrl(REQUEST_URL_DEVICE);
		
		List<BsDevice> bsDeviceList = new ArrayList<BsDevice>();
		
		int arraySize = 100;
		
		try {
			
			JSONObject jsonObj = new JSONObject();
			
			jsonObj.put("method", "getBasicDevInfo");
			
			String[] devSns = new String[arraySize];
			
			int devSnIndex = 0; // 数组游标
			
			for (int i = 0; i < bsDeviceRltList.size(); i++) {
				
				devSns[devSnIndex] = bsDeviceRltList.get(i).getDevSn();
//				String shopId = bsDeviceRltList.get(i).getShopId();
				devSnIndex++;
				if (i > 0 && (i + 1) % arraySize == 0) {
					
					jsonObj.put("devSN", devSns);
					
					String param = jsonObj.toString();
					
					Thread.sleep(WAIT_TIME);
					
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
							bsDevice.setDevOnlineTime(!StringUtils.isNullOrEmpty(devOnlineTime) && !"N/A".equals(devOnlineTime) ? Integer.valueOf(devOnlineTime) : null);
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
							bsDevice.setRunDate(runDate);
							
							bsDeviceList.add(bsDevice);
						}
					} else {
						log.warn("周期 date:{} 无数据", runDate);
					}
				}
			}
			
			StringBuffer sb = new StringBuffer();
	        for(int i=0; i< devSns.length; i++) {
	            if(devSns[i] == null) {
	                continue;
	            }
	            sb.append(devSns[i]);
	            if(i != devSns.length - 1) {
	                sb.append(";");
	            }
	        }
	        //用String的split方法分割，得到数组
	        devSns = sb.toString().split(";");
	        
//	        System.out.println("剩余devSNs数量为："+devSns.length);
	        
	        Thread.sleep(WAIT_TIME);
			
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
						bsDevice.setDevOnlineTime(!StringUtils.isNullOrEmpty(devOnlineTime) && !"N/A".equals(devOnlineTime) ? Integer.valueOf(devOnlineTime) : null);
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
						bsDevice.setRunDate(runDate);
						
						bsDeviceList.add(bsDevice);
					}
				} else {
					log.warn("周期 date:{} 的设备数据请求失败", runDate);
					execLog.setExecResult(3);
				}
			}
			log.info("执行批量保存店铺设备");
			// 执行批量保存店铺设备
			int saveFlag = SyncBsDataService.batchInsertDevice(sqlSession, bsDeviceList);
			if (saveFlag > 0) {
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
				SyncBsDataService.saveExecLog(sqlSession, execLog);
			} catch (Exception e) {
				log.error("保存设备执行日志失败", e);
			}
		}
		return bsDeviceList;
	}
	
}
