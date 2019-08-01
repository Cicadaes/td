package td.enterprise.wanalytics.etl.task.sync;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONArray;
import net.sf.json.JSONNull;
import net.sf.json.JSONObject;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import td.enterprise.entity.BsExecLog;
import td.enterprise.entity.BsShop;
import td.enterprise.service.SyncBsDataService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.HttpsRequestUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;
import td.enterprise.wanalytics.etl.util.SysConfigUtil;

@Slf4j
public class SyncBsShopDataTask {

	static SqlSession sqlSession = null;
	
	private final static String GET_METHOD = "GET";
	
	private final static String REQUEST_URL_SHOP = SysConfigUtil.getProp().getProperty("request.url.shop"); // 店铺
	
	private final static String COLUMN_BRAND_KEY = "品牌";
	
	private final static String COLUMN_STAUS_KEY = "店铺状态";
	
	private final static String COLUMN_SHOP_CODE_KEY = "店铺编号";
	
	private final static String COLUMN_SHOP_SIZE_KEY = "店铺大小";
	
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
//            String runDate = "2018-01-08";

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
		shopLog.setCode("shop");
		shopLog.setTerm(runDate);
        List<BsExecLog> execShopLog = SyncBsDataService.getExecLog(sqlSession, shopLog);
        // 当天已经执行过
        if (execShopLog != null && execShopLog.size() > 0) {
        	// 判断最新一条执行记录是否成功
        	BsExecLog log = execShopLog.get(execShopLog.size() - 1);
        	if ("1".equals(String.valueOf(log.getExecResult()))) {
        		isRerun = "1";
        		SyncBsDataService.deleteShopByRunDate(sqlSession, runDate);
        	} else {
        		isRerun = "2";
        	}
        } else {
        	isRerun = "2";
        }
        // 执行同步绫致店铺接口数据
        long start = System.currentTimeMillis();
        batchSyncDataByShop(runDate, isRerun);
        log.info("执行同步绫致店铺接口数据共花费:{} 毫秒", (System.currentTimeMillis() - start));
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
		
		execLog.setUrl(REQUEST_URL_SHOP);
		
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
					String shopSize = ""; // 店铺大小
					// 解析自定义列   品牌、店铺状态、店铺编号、店铺大小
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
						// 店铺大小
						if (jsonCn.getString("name") != null && jsonCn.getString("name").equals(COLUMN_SHOP_SIZE_KEY)) {
							// 1-大  2-中  3-小
							shopSize = jsonCn.getString("value");
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
					bsShop.setRunDate(runDate);
					bsShop.setShopSize(shopSize);
					
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
				log.warn("周期 date:{} 的店铺数据请求失败", runDate);
				execLog.setExecResult(3);
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
				SyncBsDataService.saveExecLog(sqlSession, execLog);
			} catch (Exception e) {
				log.error("保存店铺执行日志失败", e);
			}
		}
		return bsShopList;
	}
	
}
