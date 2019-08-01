package td.enterprise.wanalytics.etl.task.counter;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.task.lz.MetricDayConstants;
import td.enterprise.wanalytics.etl.task.lz.MetricUtils;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.ListUtils;
import td.enterprise.wanalytics.etl.util.QueryUtils;
import td.olap.query.WiFiAnalyticsESQuerService;
import td.olap.query.runscript.bean.EsQueryBean;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

/**
 * 生成项目ID，到访时长，停留时长
 *
 * @author junmin.li
 */
public class CreateProjectConfigTask {

    public static Logger                 logger                     = Logger.getLogger(CreateProjectConfigTask.class);

    //全局默认停留时间
    private static Integer               PROJECT_STAY_USER_MINUTES  = null;
    //全局默认到访时间
    private static Integer               PROJECT_VISIT_USER_MINUTES = null;
    //项目到访时间
    private static Map<Integer, Integer> visitProjectMap            = new HashMap<Integer, Integer>();
    //项目停留时间
    private static Map<Integer, Integer> stayProjectMap             = new HashMap<Integer, Integer>();

    //有效项目URL
    private static String                queryUrl;

    private static String                clusterName;
    private static String                hosts;

    public static void main(String[] args) {
        try {
            long begin = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("outputFile", "outputFile", true, "输出文件");
            options.addOption("runDate", "runDate", true, "运行日期");
            CommandLineParser parser = new DefaultParser();
            CommandLine line = parser.parse(options, args);
            String outputFile = line.getOptionValue("outputFile");
            String runDate = line.getOptionValue("runDate");
            //      String outputFile = "F://1.txt";
            //      String runDate = "2017-11-25";
            queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
            clusterName = HttpUtil.getParamFromConfigServer("es.cluster.name");
            hosts = HttpUtil.getParamFromConfigServer("es.hosts");
            logger.info("es cluster name =" + clusterName + " es hosts =" + hosts);
            execute(outputFile, runDate);
            long end = System.currentTimeMillis();
            logger.info("生成项目停留数据完毕.用时：" + (end - begin) / 1000 + " 秒 ");
        } catch (Exception e) {
            logger.error("", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    public static Boolean execute(String outputFile, String runDate) throws Exception {
        loadStayConfig();
        loadVisitConfig();
        BufferedWriter bw = null;
        //key 停留时长，set 项目id
        try {
            bw = new BufferedWriter(new FileWriter(outputFile));
            //查询有效项目
            String sql = "select id,tenant_id from TD_PROJECT where status=1 and project_type=1 ";
            String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
            List<Map<String, Object>> list = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
            List<String> pList = new ArrayList<String>();
            for (Map<String, Object> map : list) {
                pList.add(map.get("id") + "");
            }
            Map<String, Integer> resultMap = queryOffsetListBatch(pList, runDate, runDate, queryUrl);

            String dateLong = String.valueOf(DateUtil.format(runDate, DateUtil.PATTERN_DATE).getTime());
            logger.info("runDate=" + runDate + " dateLong=" + dateLong);

            int count = 0;

            Map<String, Integer> rm2NStay = MetricUtils.queryMetricDateMap(runDate, MetricDayConstants.script2NStay);
            Map<String, Integer> rm2OStay = MetricUtils.queryMetricDateMap(runDate, MetricDayConstants.script2OStay);

            for (Iterator<Map<String, Object>> iterator = list.iterator(); iterator.hasNext();) {
                Map<String, Object> map = (Map<String, Object>) iterator.next();
                String projectId = String.valueOf(map.get("id"));
                Integer projectIdInt = Integer.parseInt(projectId);
                Integer activeUser = resultMap.get(projectId);

                if (null == activeUser || activeUser == 0) {
                    logger.warn("项目ID=" + projectId + "在runDate=" + runDate + " 无客流");
                    continue;
                }
                Integer visitMinutes = getProjectVisitValue(projectIdInt);
                if (null == visitMinutes) {
                    visitMinutes = 0;
                }
                Integer stayMinutes = getProjectStayValue(projectIdInt);
                if (null == stayMinutes) {
                    stayMinutes = 0;
                }
                executeQueryEs(bw, runDate, dateLong, rm2NStay, rm2OStay, projectId, visitMinutes, stayMinutes, map.get("tenant_id") + "");
                if (count++ % 2000 == 0) {
                    logger.info("projectId:" + projectId);
                    bw.flush();
                }
                // bw.append(map.get("tenant_id") + "").append(Constant.SEPARATER);
                // bw.append(projectId + "").append(Constant.SEPARATER).append(visit + "").append(Constant.SEPARATER).append(stay + "").append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
            }
            bw.flush();
        } catch (Exception e) {
            logger.error("写到文件失败：", e);
        } finally {
            FileUtil.close(bw);
        }
        return true;
    }

    private static void loadStayConfig() throws Exception {
        String stayMinutes = HttpUtil.getParamFromConfigServer("project.stay.user.minutes");
        if (StringUtils.isNotBlank(stayMinutes)) {
            PROJECT_STAY_USER_MINUTES = Integer.parseInt(stayMinutes);
        }
        logger.info("=======PROJECT_STAY_USER_MINUTES:" + PROJECT_STAY_USER_MINUTES);

        //全部项目停留参数
        String sql = "select project_id,`value` as value from TD_PROJECT_PARAM where `key` = 'PROJECT.STAY.USER.MINUTES' ";
        List<Map<String, Object>> list = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
        if (null != list) {
            for (Map<String, Object> map : list) {
                String value = (String) map.get("value");
                Integer projectId = (Integer) map.get("project_id");
                if (StringUtils.isNotEmpty(value) && !"null".equalsIgnoreCase(value)) {
                    stayProjectMap.put(projectId, Integer.parseInt(value));
                }
            }
        }
    }

    private static void loadVisitConfig() throws Exception {
        String visitMinutes = HttpUtil.getParamFromConfigServer("active.user.visit.minutes");
        if (StringUtils.isNotBlank(visitMinutes)) {
            PROJECT_VISIT_USER_MINUTES = Integer.parseInt(visitMinutes);
        }
        logger.info("=======PROJECT_VISIT_USER_MINUTES:" + PROJECT_VISIT_USER_MINUTES);

        //全部项目到访参数
        //全部项目停留参数
        String sql = "select project_id,`value` as value from TD_PROJECT_PARAM where `key` = 'ACTIVE.USER.VISIT.MINUTES' ";
        List<Map<String, Object>> list = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
        if (null != list) {
            for (Map<String, Object> map : list) {
                String value = (String) map.get("value");
                Integer projectId = (Integer) map.get("project_id");
                if (StringUtils.isNotEmpty(value) && !"null".equalsIgnoreCase(value)) {
                    visitProjectMap.put(projectId, Integer.parseInt(value));
                }
            }
        }
    }

    private static Integer getProjectStayValue(Integer projectId) {
        Integer value;
        value = stayProjectMap.get(projectId);
        if (null == value) {
            value = PROJECT_STAY_USER_MINUTES;
        }
        return value;
    }

    private static Integer getProjectVisitValue(Integer projectId) {
        Integer value;
        value = visitProjectMap.get(projectId);
        if (null == value) {
            value = PROJECT_VISIT_USER_MINUTES;
        }
        return value;
    }

    private static Map<String, Integer> queryOffsetListBatch(List<String> list, String startDate, String endDate, String queryUrl) {
        int pageSize = 1000;
        Map<String, Integer> result = new HashMap<String, Integer>();
        List<List<String>> splitList = ListUtils.splitList(list, pageSize);
        for (List<String> plist : splitList) {
            String[] projectIds = (String[]) plist.toArray(new String[1]);
            String projectIdIn = StringUtils.join(projectIds, ',');
            String script = "r030102=select * from bitmap.active_user_day_cube where project_id in (" + projectIdIn + ")   and date between '"
                    + startDate + "' and '" + endDate + "' group by project_id;" + "r030102.subkey(0);";
            QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
            Map<String, Integer> map = QueryEngineResultUtil.getKeysValues(qer);
            result.putAll(map);
        }
        return result;
    }

    /**
    * <p>Description: 执行查询ES写文件</p>
    * @param outputFile
    * @param runDate
    * @param projectId
    * @param visitMinutes
    * @param stayMinutes
    * @param tenantId
    * @return
    * @throws Exception
    * @author liyinglei 
     */
    public static Boolean executeQueryEs(BufferedWriter bw, String runDate, String dateLong, //
            Map<String, Integer> rm2NStay, Map<String, Integer> rm2OStay,//
            String projectId, int visitMinutes, int stayMinutes, String tenantId) throws Exception {

        WiFiAnalyticsESQuerService esQueryService = WiFiAnalyticsESQuerService.getInstance(clusterName, hosts);
        //key 停留时长，set 项目id
        try {
            //查询有效项目
            //int stayNew = QueryESDataTask.queryStayNewUsers(runDate, projectId, queryUrl);
            //int stayOld = QueryESDataTask.queryStayOldUsers(runDate, projectId, queryUrl);

            int stayNew = rm2NStay.get(projectId) == null ? 0 : rm2NStay.get(projectId);
            int stayOld = rm2OStay.get(projectId) == null ? 0 : rm2OStay.get(projectId);

            //分别查询出来到访次数，到访时长，停留次数，停留时长
            EsQueryBean query = new EsQueryBean();
            query.setDbName("wifianalytics");
            query.setTypeName("log_es");
            query.setIndex("tenant_offset");
            query.setProjectId(projectId);
            query.setMinDuration(visitMinutes + "");
            query.setStartDate(dateLong);
            query.setEndDate(dateLong);
            query.setHasMin(true);
            //到访次数
            long visitTimes = esQueryService.queryCounter(query);
            //到访新客次数
            query.setNewFlag("1"); //新客
            long visitNewTime = esQueryService.queryCounter(query);
            //到访老客次数
            query.setNewFlag("0"); //老客
            long visitOldTime = esQueryService.queryCounter(query);
            query.setMinDuration(stayMinutes + "");
            //停留次数
            long stayTimes = esQueryService.queryCounter(query);

            EsQueryBean queryDuration = new EsQueryBean();
            queryDuration.setDbName("wifianalytics");
            queryDuration.setTypeName("log_es");
            queryDuration.setIndex("session_duration");
            queryDuration.setProjectId(projectId);
            queryDuration.setStartDate(dateLong);
            queryDuration.setEndDate(dateLong);
            queryDuration.setMinDuration(visitMinutes + "");
            queryDuration.setHasMin(true);
            //到访时长
            Double visitDuration = esQueryService.querySum(queryDuration);

            //到访新客时长
            queryDuration.setNewFlag("1"); //新客
            Double visitNewDuration = esQueryService.querySum(queryDuration);

            //到访新客时长
            queryDuration.setNewFlag("0"); //老客
            Double visitOldDuration = esQueryService.querySum(queryDuration);

            queryDuration.setMinDuration(stayMinutes + "");
            queryDuration.setNewFlag("1"); //新客
            //停留时长
            Double stayNewDuration = esQueryService.querySum(queryDuration);

            queryDuration.setNewFlag("0"); //停留老客
            Double stayOldDuration = esQueryService.querySum(queryDuration);

            bw.append(tenantId + "").append(Constant.SEPARATER); //写入到文件
            bw.append(projectId).append(Constant.SEPARATER); //写入到文件
            bw.append(runDate + "").append(Constant.SEPARATER);
            bw.append(stayNew + "").append(Constant.SEPARATER);
            bw.append(stayOld + "").append(Constant.SEPARATER);
            bw.append((stayOld + stayNew) + "").append(Constant.SEPARATER);
            bw.append(visitTimes + "").append(Constant.SEPARATER);
            bw.append(stayTimes + "").append(Constant.SEPARATER);
            bw.append(visitDuration.intValue() + "").append(Constant.SEPARATER);
            bw.append(stayNewDuration.intValue() + "").append(Constant.SEPARATER);
            bw.append(stayOldDuration.intValue() + "").append(Constant.SEPARATER);
            bw.append(visitNewDuration.intValue() + "").append(Constant.SEPARATER);
            bw.append(visitOldDuration.intValue() + "").append(Constant.SEPARATER);
            bw.append(visitNewTime + "").append(Constant.SEPARATER);
            bw.append(visitOldTime + "").append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
        } catch (Exception e) {
            logger.error("写到文件失败：", e);
        }
        return true;
    }

}
