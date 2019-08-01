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

import td.enterprise.entity.BsDevAp;
import td.enterprise.entity.BsDeviceRlt;
import td.enterprise.entity.BsExecLog;
import td.enterprise.service.SyncBsDataService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.HttpsRequestUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

import com.mysql.jdbc.StringUtils;

@Slf4j
public class SyncBsDevApDataTask {

	static SqlSession sqlSession = null;
	
	private final static String GET_METHOD = "GET";
	
	private final static String REQUEST_URL_AP = SysConfigUtil.getProp().getProperty("request.url.dev.ap"); // AP
	
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
		BsExecLog devApLog = new BsExecLog();
		devApLog.setCode("device_ap");
		devApLog.setTerm(runDate);
        List<BsExecLog> execShopLog = SyncBsDataService.getExecLog(sqlSession, devApLog);
        // 当天已经执行过
        if (execShopLog != null && execShopLog.size() > 0) {
        	// 判断最新一条执行记录是否成功
        	BsExecLog log = execShopLog.get(execShopLog.size() - 1);
        	if ("1".equals(String.valueOf(log.getExecResult()))) {
        		isRerun = "1";
        		SyncBsDataService.deleteDevApByRunDate(sqlSession, runDate);
        	} else {
        		isRerun = "2";
        	}
        } else {
        	isRerun = "2";
        }
        
        // 执行同步绫致AP设备接口数据
        long start = System.currentTimeMillis();
        List<BsDeviceRlt> bsDeviceRltList = SyncBsDataService.queryListByRecentDeviceRlt(sqlSession, runDate);
        if (bsDeviceRltList != null && bsDeviceRltList.size() > 0) {
        	batchSyncDataByApDev(runDate, isRerun, bsDeviceRltList);
        } else {
        	// 记录日志
        	log.error("没有"+runDate+"的设备关系数据");
        }
        log.info("执行同步绫致AP设备接口数据共花费:{} 毫秒", (System.currentTimeMillis() - start));
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
		
		execLog.setUrl(REQUEST_URL_AP);
		
		List<BsDevAp> bsDevApList = new ArrayList<BsDevAp>();
		
		try {
			
			for (int i = 0; i < bsDeviceRltList.size(); i++) {
				
				// 排除小贝
				if (!bsDeviceRltList.get(i).getDevType().equals("AC")) {
					continue;
				}
				
				String devSn = bsDeviceRltList.get(i).getDevSn();
//				String shopId = bsDeviceRltList.get(i).getShopId();
				
				String url = REQUEST_URL_AP + devSn;
				
				Thread.sleep(WAIT_TIME);
					
				JSONObject results = HttpsRequestUtil.httpRequest(url, GET_METHOD, null);
				
				Date currentDate = new Date();
				
//				log.debug(results.toString());
				
				// 请求成功
				if (results != null && results.getString("code").equals("0")) {
					
					JSONArray data = results.getJSONArray("data");
					
					for (Object object : data) {
						
						BsDevAp bsDevAp = new BsDevAp();
						
						JSONObject obj = (JSONObject) object;
						if (!obj.has("apMAC")) {
							log.warn("AC：" + devSn + "SN：" + obj.getString("apSN") + "没有apMAC");
							continue;
						}
						String apIp = obj.has("apIp") ? obj.getString("apIp") : null; // 设备名称
						String apSn = obj.getString("apSN"); // 设备名称
						String apName = obj.getString("apName"); // 设备序列号
						String apModel = obj.has("apModel") ? obj.getString("apModel") : null; // /设备当前硬件版本信息 
						String apSoftVersion = obj.has("apSoftVersion") ? obj.getString("apSoftVersion") : null; // 设备当前软件版本信息 
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
						bsDevAp.setRunDate(runDate);
						
						bsDevApList.add(bsDevAp);
					}
				} else {
					log.warn("周期 date:{} 的AP设备请求失败", runDate);
					execLog.setExecResult(3);
				}
			}
			
			// 执行批量保存AP设备
			int saveFlag = SyncBsDataService.batchInsertDevAp(sqlSession, bsDevApList);
			if (saveFlag > 0) {
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
				SyncBsDataService.saveExecLog(sqlSession, execLog);
			} catch (Exception e) {
				log.error("保存AP设备执行日志失败", e);
			}
		}
		return bsDevApList;
	}
	
}
