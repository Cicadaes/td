package td.enterprise.common.util;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import td.enterprise.dao.TenantAppSignificanceDao;
import td.enterprise.dao.TenantJobHousingCountDao;
import td.enterprise.dao.TenantUseAppRoutineDao;
import td.enterprise.dao.WifiPixTagCountDao;

import java.math.BigDecimal;

/**
 * 当前日期区间查询数据为null，自动获取当前表中最近一次计算数据，返回有数据的起止日期等
 *
 * @author zhengguang.ji
 */
public class RunDateUtil {
    Logger logger = Logger.getLogger(RunDateUtil.class);
    @Autowired
    private WifiPixTagCountDao wifiPixTagCountDao;
    @Autowired
    private TenantAppSignificanceDao tenantAppSignificanceDao;
    @Autowired
    private TenantUseAppRoutineDao appRoutineDao;
    @Autowired
    private TenantJobHousingCountDao tenantJobHousingCountDao;

    private static RunDateUtil runDateUtil;
    private static final String partten = "yyyy-MM-dd";

    public static RunDateUtil getInstance() {
        if (runDateUtil == null) {
            runDateUtil = new RunDateUtil();
        }
        return runDateUtil;
    }

    /**
     * 计算日期间隔，将日期间隔设定在30 的整数倍
     *
     * @param days
     * @return
     */
    public int getCycleStatistics(int days) {
        int num = 30;
        float _days = (float) days;
        float result = _days / 30f;
        num = new BigDecimal(String.valueOf(result)).setScale(0, BigDecimal.ROUND_HALF_UP).intValue();
        return num * 30;
    }

    /**
     *
     * 去数据库中检索有数据的有效日期区间
     * startDate
     * endDate
     * tenantId
     * projectId
     * crowdId
     *
     * @param params
     * @param type
     * @return
     */
//	public Map<String,Object> filter(Map<String,Object> params,String type){
//		try {
//			if(params.containsKey("startDate") && params.containsKey("endDate")){
//				Map<String,String> map = new HashMap<>();
//				String startDate = String.valueOf(params.get("startDate"));
//				String endDate = String.valueOf(params.get("endDate"));
//				logger.info(" ####### filter之前    startDate="+startDate+",endDate="+endDate+" #######");
//				//runDate 是endDate的前一天
//				Date runDate = DateUtil.addDay2Date(0, DateUtil.format(endDate,partten));
//				String tenantId = (String)params.get("tenantId");
//				int projectId = Integer.valueOf(String.valueOf(params.get("projectId")));
//				int crowdId = (int)params.get("crowdId");
//				map = getValiableRunDate(type,runDate, DateUtil.format(startDate,partten), DateUtil.format(endDate,partten), tenantId, projectId, crowdId);
//				if(map.size()>0){
//					params.put("startDate", map.get("startDate"));
//					params.put("endDate", map.get("endDate"));
//					if(map.containsKey("cycleStatistics"))
//						params.put("cycleStatistics", map.get("cycleStatistics"));
//					logger.info(" ####### filter之后    startDate="+map.get("startDate")+",endDate="+map.get("endDate")+" #######");
//				}
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//			logger.error("getValiableRunDate方法异常, ");
//		}
//		return params;
//	}
//
//	public  Map<String,String> getValiableRunDate(String type,Date runDate,Date startDate ,Date endDate,String tenantId,int projectId,int crowdId){
//		Map<String,String> map = new HashMap<>();
//		map.put("startDate", DateUtil.format(startDate,partten));
//		map.put("endDate", DateUtil.format(endDate,partten));
//		try {
//			int dateLength = DateUtil.getDiffDays(startDate, endDate) + 1;
//			if(dateLength!=30 &&
//					dateLength!=60 &&
//					dateLength!=90 &&
//					dateLength!=180 ){
////				map.put("startDate", sdf.format(startDate));
////				map.put("endDate", sdf.format(endDate));
////				return map;
//				dateLength = 30;
//				map.put("cycleStatistics", String.valueOf(dateLength));
//			}
//			if(ReportConstants.DateUtilType.WifiPixTagCount.equals(type)){
//				WifiPixTagCountPage wifiPixTagCountPage = new WifiPixTagCountPage();
//				wifiPixTagCountPage.setRunDate(DateUtil.format(runDate,partten));
//				wifiPixTagCountPage.setCycleStatistics(dateLength);
//				wifiPixTagCountPage.setTenantId(tenantId);
//				wifiPixTagCountPage.setProjectId(projectId);
//				wifiPixTagCountPage.setCorwdId(crowdId);
//
//				//查找同等计算周期下，计算日期在当前参数run_date之前记录
//				WifiPixTagCount count = wifiPixTagCountDao.queryLatestRow(wifiPixTagCountPage);
//				if(count!=null){
//					map.put("startDate", count.getStartDate());
//					map.put("endDate",  count.getEndDate());
//				}else{
//					map.put("startDate", DateUtil.format(startDate,partten));
//					map.put("endDate", DateUtil.format(endDate,partten));
//				}
//			}else if(ReportConstants.DateUtilType.AppTag.equals(type)){
//				//APP列表
//				TenantAppSignificancePage page = new TenantAppSignificancePage();
//				page.setCycleStatistics(dateLength);  //计算周期
//				page.setRunDate(DateUtil.format(runDate,partten));	//计算日期
//				page.setTenantId(tenantId);
//				page.setProjectId(projectId);
//				page.setCrowdId(crowdId);
//				TenantAppSignificance appSignificance = tenantAppSignificanceDao.queryLatestRow(page);
//				if(appSignificance!=null){
//					map.put("startDate", appSignificance.getStartDate());
//					map.put("endDate",  appSignificance.getEndDate());
//				}else{
//					map.put("startDate", DateUtil.format(startDate,partten));
//					map.put("endDate", DateUtil.format(endDate,partten));
//				}
//			}else if(ReportConstants.DateUtilType.TenantUseAppRoutine.equals(type)){
//				//App使用情况
//				TenantUseAppRoutinePage page = new TenantUseAppRoutinePage();
//				page.setCycleStatistics(dateLength);  //计算周期
//				page.setRunDate(DateUtil.format(runDate,partten));	//计算日期
//				page.setTenantId(tenantId);
//				page.setProjectId(projectId);
//				page.setCrowdId(crowdId);
//				TenantUseAppRoutine useAppRoutine = appRoutineDao.queryLatestRow(page);
//				if(useAppRoutine!=null){
//					map.put("startDate", useAppRoutine.getStartDate());
//					map.put("endDate",  useAppRoutine.getEndDate());
//				}else{
//					map.put("startDate", DateUtil.format(startDate,partten));
//					map.put("endDate", DateUtil.format(endDate,partten));
//				}
//			}
////			else if(ReportConstants.DateUtilType.TenantJobHousingCount.equals(type)){
////				TenantJobHousingCountPage tenantJobHousingCountPage = new TenantJobHousingCountPage();
////  				tenantJobHousingCountPage.setRunDate(sdf.format(runDate));
////  				tenantJobHousingCountPage.setCycleStatistics(dateLength);
////
////  				//查找同等计算周期下，计算日期在当前参数run_date之前记录
////  				TenantJobHousingCount count = tenantJobHousingCountDao.queryLatestRow(tenantJobHousingCountPage);
////  				if(count!=null){
////  					map.put("startDate", count.getStartDate());
////  					map.put("endDate",  count.getEndDate());
////  					map.put("cycleStatistics", String.valueOf(dateLength));
////  				}
////			}
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new Exception(e);
//		} finally {
//			return map;
//		}
//	}
}
