package td.enterprise.wanalytics.etl.task.counter;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.entity.ProjectTypeEnum;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.task.custom.CustomGroup;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.ListUtils;
import td.enterprise.wanalytics.etl.util.QueryUtils;
import td.olap.query.QueryServiceVisitDepth;
import td.olap.query.WiFiAnalyticsQuerService;

import java.text.DecimalFormat;
import java.util.*;

/**
 * 计算月度指标，计算指定日期的月度指标
 */
public class ComputeMonthMetricCounter {

    public static Logger logger = Logger.getLogger(ComputeMonthMetricCounter.class);

    private static String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") ;

    public static void main(String[] args) {
        try{

            long begin = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("runDate", "runDate", true, "运行日期");
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String runDate = line.getOptionValue("runDate");
            execute(runDate);
            long end = System.currentTimeMillis();
            logger.info("计算月度指标开始.用时：" + (end - begin) / 1000 + " 秒 ");
        }catch (Exception e){
            logger.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    public static void execute(String runDate) throws Exception {
        //查询有效项目
        String sql = "select id,tenant_id,project_type from TD_PROJECT where status=1 ";
        List<Map<String, Object>> list = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
        DecimalFormat df  = new DecimalFormat("##0.00");

        //加载需要计算单独客流的店组ID 这个不用计算子店铺计算
        Set<String> groupProjectSet = getAllGroupProject ();

        String month = runDate.substring(0,7);
        String startDate  = DateUtil.getMonthStartDay(month);
        String endDate = DateUtil.getMonthEndDay(month);

        for (Map<String, Object> map : list) {

            int projectId = Integer.parseInt(map.get("id") + "");
            String tenantId = map.get("tenant_id") + "";
            int projectType = map.get("project_type") == null ? ProjectTypeEnum.PROJECT_STORE.getCode() : Integer.parseInt(map.get("project_type") + "");
            String projectIds = projectId + "";
            //如果店组没有计算单独客流, 使用店组下每个店铺加起来的值来计算
            if(projectType == ProjectTypeEnum.PROJECT_GROUP.getCode() && ! groupProjectSet.contains(projectId + "")){
                List<String> tempList = new ArrayList<String> ();
                List<String> childProjectList = CustomGroup.queryChildrenByParam(projectId + "",tempList);
                projectIds = ListUtils.getConcatIds(childProjectList);
            }

            double days = queryDaysCounter(tenantId,projectIds,startDate,endDate);
            double times= queryTimesCounter(tenantId,projectIds,startDate,endDate);
            String daysStr = df.format(days);
            String timesStr  = df.format(times);
            insertData(tenantId,projectId,month, WiFiAnalyticsQuerService.MONTH_DAYS,daysStr);
            insertData(tenantId,projectId,month, WiFiAnalyticsQuerService.MONTH_TIMES,timesStr);
        }

    }

    /**
     * 获取所有需要单独计算客流的店组列表
     * @return
     */
    public static Set<String> getAllGroupProject(){
        Set<String> set = new HashSet<String>();
        String sql = "select  distinct group_id from TD_PROJECT_GROUP_COMPUTE where compute_type = 2 ";
        List<Map<String,Object>> list = QueryUtils.query(sql,QueryUtils.WIFIANALYTICS_DB);
        if(null != list){
            for(Map<String,Object> map : list){
                set.add(map.get("group_id") + "");
            }
        }
        return set;
    }

    /**
     * 查询月均到访日数
     * @param tenantId
     * @param projectIds
     * @param startDate
     * @param endDate
     * @return
     */
    private static Double queryDaysCounter(String tenantId,String projectIds, String startDate,String endDate){
        //上个月到访人数总和，不排重
        long totalUsers = QueryServiceVisitDepth.getInstance(queryUrl).querySum(projectIds, startDate, endDate, "offline_active_user_day_counter");
        //上个月到访人数，进行排重后
        Long singleUsers = QueryServiceVisitDepth.getInstance(queryUrl).querySumFromCube(projectIds, startDate, endDate, "active_user_day_cube");

        if (singleUsers != null && singleUsers > 0) {
            return totalUsers * 10.0 / singleUsers / 10.0;
        }

        return 0.0D;
    }


    /**
     * 查询月均到访次数
     * @param tenantId
     * @param projectIds
     * @param startDate
     * @param endDate
     * @return
     */
    private static Double queryTimesCounter(String tenantId,String projectIds, String startDate,String endDate){
        //上个月到访人数总和，不排重
        long totalUsers = QueryServiceVisitDepth.getInstance(queryUrl).querySum(projectIds, startDate, endDate, "offline_active_user_times_day_counter");
        //上个月到访人数，进行排重后
        Long singleUsers = QueryServiceVisitDepth.getInstance(queryUrl).querySumFromCube(projectIds, startDate, endDate, "active_user_day_cube");

        if (singleUsers != null && singleUsers > 0) {
            return totalUsers * 10.0 / singleUsers / 10.0;
        }

        return 0.0D;
    }

    /**
     * 月均光顾日数，月均光顾次数
     *
     * @param tenantId
     * @param projectId
     */
    private  static void insertData(String tenantId, int projectId, String month, String type,String metricValue) {
        String deleteSql = "delete from offline_month_metric_counter where tenant_id='" + tenantId + "' and project_id=" + projectId + " and month='" + month + "' and type= '" + type + "'";
        String insertSql = "insert into offline_month_metric_counter (tenant_id,project_id,month,type,metric_value) values(" + tenantId + "," + projectId + ",'" + month + "' ,'" + type + "','" + metricValue + "')";
        QueryUtils.execute(deleteSql, QueryUtils.COUNTER_DB);
        QueryUtils.execute(insertSql, QueryUtils.COUNTER_DB);
    }

}
