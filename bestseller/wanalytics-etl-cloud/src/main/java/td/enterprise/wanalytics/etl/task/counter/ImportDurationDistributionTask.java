package td.enterprise.wanalytics.etl.task.counter;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.log4j.Logger;

import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.task.lz.MetricUtils;
import td.enterprise.wanalytics.etl.util.CubeUtils;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;
import td.olap.query.WiFiAnalyticsESQuerService;
import td.olap.query.runscript.bean.EsQueryBean;

/**
 * 计算进店时长分布
 *
 * @author junmin.li
 */
@Slf4j
public class ImportDurationDistributionTask {

    public static Logger        logger                                    = Logger.getLogger(ImportDurationDistributionTask.class);

    private final static int    HOUR                                      = 3600;
    private final static int    MIUNTE                                    = 60;

    private final static String PROJECT_STAYTIMEDISTRIBUTION_UNIT         = "PROJECT.STAYTIMEDISTRIBUTION.UNIT";
    private final static String DEFAULT_PROJECT_STAYTIMEDISTRIBUTION_UNIT = "project.staytimedistribution.unit";

    public static void main(String[] args) {
        try {

            long begin = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("runDate", "runDate", true, "运行日期");
            CommandLineParser parser = new DefaultParser();
            CommandLine line = parser.parse(options, args);
            String runDate = line.getOptionValue("runDate");
            //String runDate = "2017-11-24";
            execute(runDate);
            long end = System.currentTimeMillis();
            logger.info("计算进店时长分布完毕.用时：" + (end - begin) / 1000 + " 秒 ");
        } catch (Exception e) {
            logger.error("", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    public static void execute(String runDate) throws Exception {
        //查询有效项目
        String sql = "select id,tenant_id from TD_PROJECT where status=1 and project_type=1 ";
        List<Map<String, Object>> list = QueryUtils.query(sql, QueryUtils.WIFIANALYTICS_DB);
        long dateLong = DateUtil.format(runDate, DateUtil.PATTERN_DATE).getTime();
        String clusterName = HttpUtil.getParamFromConfigServer("es.cluster.name");
        String hosts = HttpUtil.getParamFromConfigServer("es.hosts");
        //String clusterName = "dmpes";
        //String hosts = "10.150.33.120:9300,10.150.33.119:9300,10.150.33.118:9300";
        logger.info("es cluster name =" + clusterName + " hosts=" + hosts);

        List<String> pList = new ArrayList<String>();
        for (Map<String, Object> map : list) {
            pList.add(map.get("id") + "");
        }

        WiFiAnalyticsESQuerService esQueryService = WiFiAnalyticsESQuerService.getInstance(clusterName, hosts);

        Map<String, Integer> resultMap = CubeUtils.queryProjectUsersBatch(pList, runDate, runDate);
        Connection conn2Analytics = DbWifianalyticsConn.getConnection();
        String updateSql = "update TD_METRIC_DAY " + "set interval_2=?,interval_5=?,interval_10=?,interval_15=?"
                + ",update_time=? where project_id=? and date=? ";
        String updateSql2Active = "update TD_METRIC_DAY_ACTIVE " + "set interval_2=?,interval_5=?,interval_10=?,interval_15=?,"
                + "duration_new_5=?,duration_new_15=?,duration_new_30=?,duration_new_60=?,"
                + "duration_old_5=?,duration_old_15=?,duration_old_30=?,duration_old_60=?,"
                + "high_active_5=?, high_active_15=?, high_active_30=?, high_active_60=?,"
                + "middle_active_5=?, middle_active_15=?, middle_active_30=?, middle_active_60=?,"
                + "low_active_5=?, low_active_15=?, low_active_30=?, low_active_60=?,"
                + "sleep_active_5=?, sleep_active_15=?, sleep_active_30=?, sleep_active_60=?" + ",update_time=? where project_id=? and date=? ";
        PreparedStatement updateps = conn2Analytics.prepareStatement(updateSql);
        PreparedStatement updateps2Active = conn2Analytics.prepareStatement(updateSql2Active);
        Timestamp updateTime = new Timestamp(System.currentTimeMillis());
        int i = 0;

        String dateStr = String.valueOf(dateLong);
        for (Map<String, Object> map : list) {
            //Integer projectId = Integer.parseInt(map.get("id") + "");

            String projectId = String.valueOf(map.get("id"));
            String tenantId = map.get("tenant_id") + "";
            Integer activeUser = resultMap.get(map.get("id") + "");
            if (null == activeUser || activeUser == 0) {
                logger.warn("项目ID=" + projectId + "在startDate=" + runDate + " endDate=" + runDate + " 没有客流!忽略执行");
                continue;
            }

            //ES 到访次数
            generateMinuteCounter(runDate, esQueryService, projectId, tenantId, dateStr, updateps, updateps2Active, updateTime);
            i++;
            if (i % MetricUtils.BATCH_SIZE == 0) {
                int[] affectUpdateRows = updateps.executeBatch();
                int[] affectUpdateRows2Active = updateps2Active.executeBatch();
                log.info("updateRowsMetricDay:{},updateRowsMetricDayActive:{}", affectUpdateRows.length, affectUpdateRows2Active.length);
            }
        }
        //提交剩余任务
        int[] affectUpdateRows = updateps.executeBatch();
        int[] affectUpdateRows2Active = updateps2Active.executeBatch();
        log.info("startDate:{},updateRowsMetricDay:{},updateRowsMetricDayActive:{}", runDate, affectUpdateRows.length, affectUpdateRows2Active.length);

        if (null != conn2Analytics) {
            try {
                conn2Analytics.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    private static void generateMinuteCounter(String runDate, WiFiAnalyticsESQuerService esQueryService, String projectId,// 
            String tenantId, String dateLong, PreparedStatement updateps, PreparedStatement updateps2Active, Timestamp updateTime)
            throws SQLException {
        EsQueryBean query = new EsQueryBean();
        query.setDbName("wifianalytics");
        query.setTypeName("log_es");
        query.setIndex("tenant_offset");
        query.setProjectId(projectId);
        query.setStartDate(dateLong);
        query.setEndDate(dateLong);
        /***分钟区间次数****************************/
        //<=0 <=1
        query.setMaxDuration(1 + "");
        query.setHasMax(true);
        query.setMinDuration(0 + "");
        query.setHasMin(true);
        long less1 = esQueryService.queryCounter(query);

        // 1<  <=5
        query.setMaxDuration(5 + "");
        query.setHasMax(true);
        query.setMinDuration(1 + "");
        query.setHasMin(false);
        long less5 = esQueryService.queryCounter(query);

        // 5< <=15
        query.setMaxDuration(15 + "");
        query.setHasMax(true);
        query.setMinDuration(5 + "");
        query.setHasMin(false);
        long less15 = esQueryService.queryCounter(query);

        // >15
        query.setMaxDuration(null);
        query.setMinDuration(15 + "");
        query.setHasMin(false);
        long lessMin15 = esQueryService.queryCounter(query);

        /***新客老客入店时长****************************/
        //0<= <5
        query.setMaxDuration(1 + "");
        query.setHasMax(true);
        query.setMinDuration(0 + "");
        query.setHasMin(true);
        query.setNewFlag("1");
        long durNew5 = esQueryService.queryCounter(query);
        query.setNewFlag("0");
        long durOld5 = esQueryService.queryCounter(query);
        //5<=  <15
        query.setMaxDuration(5 + "");
        query.setHasMax(true);
        query.setMinDuration(1 + "");
        query.setHasMin(false);
        query.setNewFlag("1");
        long durNew15 = esQueryService.queryCounter(query);
        query.setNewFlag("0");
        long durOld15 = esQueryService.queryCounter(query);
        //15 <=  <=30
        query.setMaxDuration(15 + "");
        query.setHasMax(true);
        query.setMinDuration(5 + "");
        query.setHasMin(false);
        query.setNewFlag("1");
        long durNew30 = esQueryService.queryCounter(query);
        query.setNewFlag("0");
        long durOld30 = esQueryService.queryCounter(query);
        //30<
        query.setMaxDuration(null);
        query.setMinDuration(15 + "");
        query.setHasMin(false);
        query.setNewFlag("1");
        long durNew60 = esQueryService.queryCounter(query);
        query.setNewFlag("0");
        long durOld60 = esQueryService.queryCounter(query);

        // 重置标识
        query.setNewFlag(null);
        /*** 高活跃人群次数 ****************************/
        //<=0 <=1
        query.setMaxDuration(1 + "");
        query.setHasMax(true);
        query.setMinDuration(0 + "");
        query.setHasMin(true);
        query.setActiveSign("ah");
        long highActive_less1 = esQueryService.queryCounter(query);

        // 1<  <=5
        query.setMaxDuration(5 + "");
        query.setHasMax(true);
        query.setMinDuration(1 + "");
        query.setHasMin(false);
        query.setActiveSign("ah");
        long highActive_less5 = esQueryService.queryCounter(query);

        // 5< <=15
        query.setMaxDuration(15 + "");
        query.setHasMax(true);
        query.setMinDuration(5 + "");
        query.setHasMin(false);
        query.setActiveSign("ah");
        long highActive_less15 = esQueryService.queryCounter(query);

        // >15
        query.setMaxDuration(null);
        query.setMinDuration(15 + "");
        query.setHasMin(false);
        query.setActiveSign("ah");
        long highActive_greater15 = esQueryService.queryCounter(query);

        /*** 中活跃人群次数 ****************************/
        //<=0 <=1
        query.setMaxDuration(1 + "");
        query.setHasMax(true);
        query.setMinDuration(0 + "");
        query.setHasMin(true);
        query.setActiveSign("am");
        long midActive_less1 = esQueryService.queryCounter(query);

        // 1<  <=5
        query.setMaxDuration(5 + "");
        query.setHasMax(true);
        query.setMinDuration(1 + "");
        query.setHasMin(false);
        query.setActiveSign("am");
        long midActive_less5 = esQueryService.queryCounter(query);

        // 5< <=15
        query.setMaxDuration(15 + "");
        query.setHasMax(true);
        query.setMinDuration(5 + "");
        query.setHasMin(false);
        query.setActiveSign("am");
        long midActive_less15 = esQueryService.queryCounter(query);

        // >15
        query.setMaxDuration(null);
        query.setMinDuration(15 + "");
        query.setHasMin(false);
        query.setActiveSign("am");
        long midActive_greater15 = esQueryService.queryCounter(query);

        /*** 低活跃人群次数 ****************************/
        //<=0 <=1
        query.setMaxDuration(1 + "");
        query.setHasMax(true);
        query.setMinDuration(0 + "");
        query.setHasMin(true);
        query.setActiveSign("al");
        long lowActive_less1 = esQueryService.queryCounter(query);

        // 1<  <=5
        query.setMaxDuration(5 + "");
        query.setHasMax(true);
        query.setMinDuration(1 + "");
        query.setHasMin(false);
        query.setActiveSign("al");
        long lowActive_less5 = esQueryService.queryCounter(query);

        // 5< <=15
        query.setMaxDuration(15 + "");
        query.setHasMax(true);
        query.setMinDuration(5 + "");
        query.setHasMin(false);
        query.setActiveSign("al");
        long lowActive_less15 = esQueryService.queryCounter(query);

        // >15
        query.setMaxDuration(null);
        query.setMinDuration(15 + "");
        query.setHasMin(false);
        query.setActiveSign("al");
        long lowActive_greater15 = esQueryService.queryCounter(query);

        /*** 沉睡人群次数 ****************************/
        //<=0 <=1
        query.setMaxDuration(1 + "");
        query.setHasMax(true);
        query.setMinDuration(0 + "");
        query.setHasMin(true);
        query.setActiveSign("as");
        long slpActive_less1 = esQueryService.queryCounter(query);

        // 1<  <=5
        query.setMaxDuration(5 + "");
        query.setHasMax(true);
        query.setMinDuration(1 + "");
        query.setHasMin(false);
        query.setActiveSign("as");
        long slpActive_less5 = esQueryService.queryCounter(query);

        // 5< <=15
        query.setMaxDuration(15 + "");
        query.setHasMax(true);
        query.setMinDuration(5 + "");
        query.setHasMin(false);
        query.setActiveSign("as");
        long slpActive_less15 = esQueryService.queryCounter(query);

        // >15
        query.setMaxDuration(null);
        query.setMinDuration(15 + "");
        query.setHasMin(false);
        query.setActiveSign("as");
        long slpActive_greater15 = esQueryService.queryCounter(query);

        //MetricFact表
        updateps.setLong(1, less1);
        updateps.setLong(2, less5);
        updateps.setLong(3, less15);
        updateps.setLong(4, lessMin15);
        updateps.setTimestamp(5, updateTime);
        //where
        updateps.setString(6, projectId);
        updateps.setString(7, runDate);
        updateps.addBatch();

        //MetricFactActive表
        updateps2Active.setLong(1, less1);
        updateps2Active.setLong(2, less5);
        updateps2Active.setLong(3, less15);
        updateps2Active.setLong(4, lessMin15);

        updateps2Active.setLong(5, durNew5);
        updateps2Active.setLong(6, durNew15);
        updateps2Active.setLong(7, durNew30);
        updateps2Active.setLong(8, durNew60);

        updateps2Active.setLong(9, durOld5);
        updateps2Active.setLong(10, durOld15);
        updateps2Active.setLong(11, durOld30);
        updateps2Active.setLong(12, durOld60);

        updateps2Active.setLong(13, highActive_less1);
        updateps2Active.setLong(14, highActive_less5);
        updateps2Active.setLong(15, highActive_less15);
        updateps2Active.setLong(16, highActive_greater15);

        updateps2Active.setLong(17, midActive_less1);
        updateps2Active.setLong(18, midActive_less5);
        updateps2Active.setLong(19, midActive_less15);
        updateps2Active.setLong(20, midActive_greater15);

        updateps2Active.setLong(21, lowActive_less1);
        updateps2Active.setLong(22, lowActive_less5);
        updateps2Active.setLong(23, lowActive_less15);
        updateps2Active.setLong(24, lowActive_greater15);

        updateps2Active.setLong(25, slpActive_less1);
        updateps2Active.setLong(26, slpActive_less5);
        updateps2Active.setLong(27, slpActive_less15);
        updateps2Active.setLong(28, slpActive_greater15);

        updateps2Active.setTimestamp(29, updateTime);
        //where
        updateps2Active.setString(30, projectId);
        updateps2Active.setString(31, runDate);
        updateps2Active.addBatch();

        /*updata(tenantId,projectId,runDate,less1,less5,less15,lessMin15, //
                durNew5,durNew15,durNew30,durNew60,durOld5,durOld15,durOld30,durOld60);*/

    }

}
