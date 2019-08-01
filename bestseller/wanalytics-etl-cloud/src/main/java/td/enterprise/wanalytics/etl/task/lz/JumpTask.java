package td.enterprise.wanalytics.etl.task.lz;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Map;
import java.util.Map.Entry;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;

import td.enterprise.entity.Project;
import td.enterprise.entity.Threshold;
import td.enterprise.wanalytics.etl.jdbc.DbBitmapConn;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.enterprise.wanalytics.etl.util.RedisClient;
import td.olap.query.WiFiAnalyticsESQuerService;
import td.olap.query.runscript.bean.EsQueryBean;

/**
 * 
 * @description 跳出客流 
 * @author sxk
 * @date 2017年12月7日
 */
@Slf4j
public class JumpTask {
    public static Logger                     logger             = Logger.getLogger(JumpTask.class);

    public static final String               clusterName        = HttpUtil.getParamFromConfigServer("es.cluster.name");
    public static final String               hosts              = HttpUtil.getParamFromConfigServer("es.hosts");
    public static final String               redisHosts         = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_SENTINELS_KEY);
    public static final String               masterName         = HttpUtil.getParamFromConfigServer(RedisClient.REDIS_MASTER);

    public static final String               defaultActiveVisit = HttpUtil.getParamFromConfigServer("active.user.visit.minutes");
    public static final String               defaultJumpVisit   = HttpUtil.getParamFromConfigServer("jump.user.visit.minutes");

    public static WiFiAnalyticsESQuerService esQueryService     = null;

    static {
        try {
            esQueryService = WiFiAnalyticsESQuerService.getInstance(clusterName, hosts);
        } catch (Exception e) {
            log.error("JumpTask init Error:", e);
        }
    }
    private static String                    date;
    private static long                      dateLong;
    private static int                       RUN_SUCCESS        = 0;
    private static int                       RUN_ERROR          = 1;

    public static void main(String[] args) throws Exception {
        Options options = new Options();
        options.addOption("r", "date", true, "计算跳出客流的时间");

        CommandLineParser parser = new DefaultParser();
        CommandLine line;
        try {
            line = parser.parse(options, args);
            date = line.getOptionValue("date");
            dateLong = DateUtil.format(date, DateUtil.PATTERN_DATE).getTime();
        } catch (ParseException e1) {
            log.warn("params error,date:{}", date);
            e1.printStackTrace();
        }

        Map<String, Project> allProjects = MetricUtils.queryAllProjects();

        if (null == allProjects || allProjects.size() == 0) {
            System.exit(RUN_ERROR);
        }

        Map<String, Threshold> allProjectsThreshold = MetricUtils.queryAllProjectsThreshold();

        long start = System.currentTimeMillis();
        logger.info("计算跳出客流开始....");
        execute(allProjects, allProjectsThreshold);
        long end = System.currentTimeMillis();
        logger.info("计算跳出客流结束....用时：" + (end - start) / 1000 + " 秒");
        System.exit(RUN_SUCCESS);
    }

    public static void execute(Map<String, Project> allProjects, Map<String, Threshold> allProjectsThreshold) throws SQLException {
        String projectId = null;
        String tenantId = null;
        String deleteSql = "DELETE from jump_user_day_cube where tenant_id=? and project_id=? and date=?";
        String sql = "insert into jump_user_day_cube (tenant_id, project_id, date, bitmap, update_time) values(?,?,?,?,?)";
        PreparedStatement delStatement = null;
        PreparedStatement pstmt = null;
        Connection conn = DbBitmapConn.getConnection();
        delStatement = conn.prepareStatement(deleteSql);
        pstmt = conn.prepareStatement(sql);

        for (Entry<String, Project> entry : allProjects.entrySet()) {
            projectId = entry.getKey();
            tenantId = entry.getValue().getTenantId();
            String maxDuration = null;
            String minDuration = null;
            if (null == allProjectsThreshold) {
                minDuration = defaultActiveVisit;
                maxDuration = defaultJumpVisit;
            } else {
                Threshold threshold = allProjectsThreshold.get(projectId);
                if (threshold == null) {
                    minDuration = defaultActiveVisit;
                    maxDuration = defaultJumpVisit;
                } else {
                    minDuration = threshold.getCrowdCome() == null ? defaultActiveVisit : String.valueOf(threshold.getCrowdCome());
                    maxDuration = threshold.getCrowdBounce() == null ? defaultJumpVisit : String.valueOf(threshold.getCrowdBounce());
                }
            }

            if (StringUtils.isEmpty(minDuration) || StringUtils.isEmpty(maxDuration)) {
                log.warn(" projectId:{} ,minDuration:{}, maxDuration:{}", projectId, minDuration, maxDuration);
                continue;
            }

            byte[] bytes = getJumpBitmap(projectId, maxDuration, minDuration);
            if (null != bytes) {
                try {
                    batchSaveToDB(tenantId, projectId, bytes, delStatement, pstmt);
                } catch (SQLException e) {
                    log.error(String.format("projectId:{},date:{}", projectId, date), e);
                }
            }
        }

        if (delStatement != null) {
            delStatement.close();
        }
        if (pstmt != null) {
            delStatement.close();
        }
        if (conn != null) {
            conn.close();
        }

    }

    public static void batchSaveToDB(String tenantId, String projectId, byte[] bytes, PreparedStatement delStatement, PreparedStatement pstmt)
            throws SQLException {

        delStatement.setString(1, tenantId);
        delStatement.setString(2, projectId);
        delStatement.setString(3, date);
        int delRows = delStatement.executeUpdate();
        logger.info("删除sql: " + delRows);

        pstmt.setString(1, tenantId);
        pstmt.setString(2, projectId);
        pstmt.setString(3, date);
        pstmt.setBytes(4, bytes);
        pstmt.setTimestamp(5, new Timestamp(System.currentTimeMillis()));
        pstmt.executeUpdate();

    }

    /**
     * 查询跳出客流
     * @param projectId
     * @return
     */

    public static byte[] getJumpBitmap(String projectId, String maxDuration, String minDuration) {
        EsQueryBean query = new EsQueryBean();
        query.setDbName("wifianalytics");
        query.setTypeName("log_es");
        query.setIndex("tenant_offset");
        query.setProjectId(projectId);

        query.setStartDate(dateLong + "");
        query.setEndDate(dateLong + "");
        //1=< <5
        query.setMaxDuration(maxDuration);
        query.setHasMax(false);
        query.setMinDuration(minDuration);
        query.setHasMin(true);

        byte[] bytes = esQueryService.queryBitmap(query, redisHosts, masterName);
        if (bytes == null) {
            logger.info("查询到bitmap为空！");
        }
        return bytes;
    }

}
