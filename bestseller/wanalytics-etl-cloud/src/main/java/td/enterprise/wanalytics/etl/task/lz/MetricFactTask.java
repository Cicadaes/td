package td.enterprise.wanalytics.etl.task.lz;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;

import td.enterprise.entity.Project;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

/**
 * 实时累计客流
 * @description 
 * @author sxk
 * @email sxk5245@126.com
 * @date 2017年9月29日
 */
@Slf4j
public class MetricFactTask {

    //查询小时客流量
    private static String     script2FactHour = "r030102 = select * from bitmap.active_user_hour_cube where date=%s" // 
                                                      + " and hour=%d group by project_id; r030102.subkey(0);";
    //查询小时累计客流量
    private static String     script2EndHour  = "r030102 = select * from bitmap.active_user_hour_cube where date=%s" // 
                                                      + " and hour<=%d group by project_id; r030102.subkey(0);";

    private static Connection conn2Analytics;
    static {
        conn2Analytics = DbWifianalyticsConn.getConnection();
    }
    private static int        RUN_SUCCESS     = 0;
    private static int        RUN_ERROR       = 1;

    private static String     date;
    private static String     currentDate;
    private static int        hour;
    private static int        currentHour;
    private static boolean    reRun           = false;
    private static int        limit           = 1;

    public static void main(String[] args) {
        long start = System.currentTimeMillis();

        Options options = new Options();
        options.addOption("r", "date", true, "需要统计的日期"); // 默认前一天
        options.addOption("h", "hour", true, "小时");
        options.addOption("l", "limit", true, "小时limit");
        options.addOption("u", "reRun", true, "reRun");

        CommandLineParser parser = new DefaultParser();
        CommandLine line;
        try {
            line = parser.parse(options, args);
            date = line.getOptionValue("date");
            reRun = Boolean.parseBoolean(line.getOptionValue("reRun"));
            hour = Integer.parseInt(line.getOptionValue("hour"));
            limit = Integer.parseInt(line.getOptionValue("limit"));

        } catch (ParseException e1) {
            log.warn("params error,date:{},hour:{}", date, hour);
            e1.printStackTrace();
        }

        Map<String, Project> allProjects = MetricUtils.queryAllProjects();

        if (null == allProjects || allProjects.size() == 0) {
            System.exit(RUN_ERROR);
        }

        try {
            if (reRun) {
                //limit = 1;
            } else {
                hour = queryMaxHour(date);
                while (hour < 0) {
                    date = LocalDate.parse(date, DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE)).minusDays(1L)
                            .format(DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE));
                    hour = queryMaxHour(date);
                }
            }
            int temLimit = limit;
            while (temLimit > 0) {
                initParams(date, hour, temLimit - 1);
                temLimit--;
                hourBatchInsert(allProjects);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if (null != conn2Analytics) {
            try {
                conn2Analytics.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        long end = System.currentTimeMillis();
        log.info("MetricFactTask:{}", (end - start) + " Minlls");
        System.exit(RUN_SUCCESS);
    }

    private static void initParams(String date, int hour, int offset) {
        LocalDate localDate = LocalDate.parse(date, DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE));
        LocalDateTime currentDateTime = LocalDateTime.of(localDate.getYear(), localDate.getMonth(), localDate.getDayOfMonth(), hour, 0).minusHours(
                offset);
        currentDate = currentDateTime.toLocalDate().format(DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE));
        currentHour = currentDateTime.getHour();
    }

    public static void hourBatchInsert(Map<String, Project> allProjects) throws SQLException {
        PreparedStatement insertps = null;
        PreparedStatement updateps = null;
        String insertSql = "insert into TD_METRIC_FACT "//
                + " (brand,region,city,province,channel,mall,project_name,project_type," //
                + "project_id,date,hour,hour_users,end_hour_users,"
                + "project_num,logical_city,c_city_cn_name,tenant_id) "
                + "values (?,?,?,?,?,?,?,?,  ?,?,?,?,?,  ?,?,?, ?)";

        String updateSql = "update TD_METRIC_FACT "//
                + "set hour_users=?,end_hour_users=?,update_time=?,tenant_id=? "//
                + "where project_id=? and date=? and hour=?";//

        insertps = conn2Analytics.prepareStatement(insertSql);
        updateps = conn2Analytics.prepareStatement(updateSql);

        int ii = 0;
        int ui = 0;

        Set<String> dateMetrictSet = queryMetricFact(currentDate, currentHour);

        String projectId;
        int hourUser = 0;
        int endHourUser = 0;
        String tenantId;

        Timestamp updateTime = new Timestamp(System.currentTimeMillis());

        Map<String, Integer> rm2Hour = MetricUtils.queryMetricDateAndHourMap(currentDate, currentHour, script2FactHour);
        Map<String, Integer> rm2EndHour = MetricUtils.queryMetricDateAndHourMap(currentDate, currentHour, script2EndHour);

        for (Map.Entry<String, Project> entry : allProjects.entrySet()) {
            projectId = entry.getKey();
            //更新

            hourUser = rm2Hour.get(projectId) == null ? 0 : rm2Hour.get(projectId);
            endHourUser = rm2EndHour.get(projectId) == null ? 0 : rm2EndHour.get(projectId);

            tenantId = entry.getValue().getTenantId();

            if (dateMetrictSet.contains(projectId)) {
                ui++;
                updateps.setInt(1, hourUser);
                updateps.setInt(2, endHourUser);
                updateps.setTimestamp(3, updateTime);
                updateps.setString(4, tenantId);
                updateps.setString(5, projectId);
                updateps.setString(6, currentDate);
                updateps.setInt(7, currentHour);
                updateps.addBatch();
                if (ui % MetricUtils.BATCH_SIZE == 0) {
                    int[] affectUpdateRows = updateps.executeBatch();
                    log.info("date:{},hour:{},updateRows:{}", currentDate, currentHour, affectUpdateRows.length);
                }
            } else {
                ii++;
                Project p = entry.getValue();

                insertps.setString(1, p.getBrand());
                insertps.setString(2, p.getRegion());
                insertps.setString(3, p.getCity());
                insertps.setString(4, p.getProvince());
                insertps.setString(5, p.getChannel());
                insertps.setString(6, p.getMall());
                insertps.setString(7, p.getProjectName());
                insertps.setInt(8, p.getProjectType());
                insertps.setInt(9, p.getId());
                insertps.setString(10, currentDate);
                insertps.setInt(11, currentHour);
                insertps.setInt(12, hourUser);
                insertps.setInt(13, endHourUser);
                insertps.setString(14, p.getProjectNum());
                insertps.setString(15, p.getLogicalCity());
                insertps.setString(16, p.getCityCnName());
                insertps.setString(17, p.getTenantId());

                insertps.addBatch();
                if (ii % MetricUtils.BATCH_SIZE == 0) {
                    int[] affectRows = insertps.executeBatch();
                    log.info("date:{},hour:{},insertRows:{}", currentDate, currentHour, affectRows.length);
                }
            }
        }
        int[] affectInsertRows = insertps.executeBatch();
        int[] affectUpdateRows = updateps.executeBatch();
        log.info("date:{},hour:{},insertRows:{},updateRows:{}", currentDate, currentHour, affectInsertRows.length, affectUpdateRows.length);
    }

    /**
     * 获取当前日期的最大时间
     * @param dateStr
     * @return
     */
    public static int queryMaxHour(String dateStr) {
        String sql = "select max(hour) as hour from active_user_hour_cube where date=?";
        List<Object> valuesList = new ArrayList<>();
        valuesList.add(dateStr);
        Map<String, Object> hourMap = QueryUtils.querySingle(sql, QueryUtils.BITMPA_DB, valuesList);
        if (null == hourMap || hourMap.isEmpty()) {
            return -1;
        } else {
            Object obj = hourMap.get("hour");
            return obj == null ? -1 : (int) obj;
        }
    }

    /**
     * 获取当前日期的已入库信息 
     * @param dateStr
     * @return
     * @throws SQLException
     */
    private static Set<String> queryMetricFact(String dateStr, Integer hour) throws SQLException {
        String sql = "select project_id from TD_METRIC_FACT where date='" + dateStr + "' and hour=" + hour + " and project_type=1";
        Set<String> result = new HashSet<>();
        PreparedStatement ps = conn2Analytics.prepareStatement(sql);
        ResultSet rs = ps.executeQuery();
        while (rs.next()) {
            result.add(rs.getString("project_id"));
        }
        rs.close();
        ps.close();
        return result;
    }
}
