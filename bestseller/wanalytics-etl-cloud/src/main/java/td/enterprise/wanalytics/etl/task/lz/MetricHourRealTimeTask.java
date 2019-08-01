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
 * 实时小时客流
 * @description 
 * @author sxk
 * @date 2017年11月6日
 */
@Slf4j
public class MetricHourRealTimeTask {

    //入店小时客流
    private static String     script2ActiveHour = "r030102 = select * from bitmap.active_user_hour_cube where date=%s" // 
                                                        + " and hour=%d group by project_id; r030102.subkey(0);";
    //周边小时客流
    private static String     script2FrontHour  = "r030102 = select * from bitmap.front_user_hour_cube where date=%s" // 
                                                        + " and hour=%d group by project_id; r030102.subkey(0);";

    //停留小时客流
    private static String     script2StayHour   = "r030102 = select * from bitmap.stay_user_hour_cube where date=%s" // 
                                                        + " and hour=%d group by project_id; r030102.subkey(0);";

    private static Connection conn2Analytics;
    static {
        conn2Analytics = DbWifianalyticsConn.getConnection();
    }
    private static int        RUN_SUCCESS       = 0;
    private static int        RUN_ERROR         = 1;

    private static String     date;
    private static String     currentDate;
    private static int        hour;
    private static int        currentHour;
    private static boolean    reRun             = false;
    private static int        limit             = 1;

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
        log.info("MetricDayRealTimeTask:{}", (end - start) + " Minlls");
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
        String insertSql = "insert into TD_METRIC_HOUR_REAL_TIME "//
                + " (project_name,project_type," //
                + "project_id,date,hour,active_hour_users,front_hour_users,stay_hour_users,"
                + "project_num,logical_city,tenant_id) "
                + "values (?,?,  ?,?,?,?,?,?,  ?,?,?)";

        String updateSql = "update TD_METRIC_HOUR_REAL_TIME "//
                + "set active_hour_users=?,front_hour_users=?,stay_hour_users=?,update_time=? "//
                + "where project_id=? and date=? and hour=?";//

        insertps = conn2Analytics.prepareStatement(insertSql);
        updateps = conn2Analytics.prepareStatement(updateSql);

        int ii = 0;
        int ui = 0;

        Set<String> dateMetrictSet = queryMetricHourRealTime(currentDate, currentHour);

        String projectId;
        int hourUser = 0;
        int frontHourUser = 0;
        int stayHourUser = 0;

        Timestamp updateTime = new Timestamp(System.currentTimeMillis());

        Map<String, Integer> rm2Hour = MetricUtils.queryMetricDateAndHourMap(currentDate, currentHour, script2ActiveHour);
        Map<String, Integer> rm2FrontHour = MetricUtils.queryMetricDateAndHourMap(currentDate, currentHour, script2FrontHour);
        Map<String, Integer> rm2StayHour = MetricUtils.queryMetricDateAndHourMap(currentDate, currentHour, script2StayHour);
        String currentHourStr = String.valueOf(currentHour);
        for (Map.Entry<String, Project> entry : allProjects.entrySet()) {
            projectId = entry.getKey();
            //更新

            hourUser = rm2Hour.get(projectId) == null ? 0 : rm2Hour.get(projectId);
            frontHourUser = rm2FrontHour.get(projectId) == null ? 0 : rm2FrontHour.get(projectId);
            stayHourUser = rm2StayHour.get(projectId) == null ? 0 : rm2StayHour.get(projectId);

            if (dateMetrictSet.contains(projectId)) {
                ui++;
                updateps.setInt(1, hourUser);
                updateps.setInt(2, frontHourUser);
                updateps.setInt(3, stayHourUser);
                updateps.setTimestamp(4, updateTime);
                updateps.setString(5, projectId);
                updateps.setString(6, currentDate);
                updateps.setString(7, currentHourStr);
                updateps.addBatch();
                if (ui % MetricUtils.BATCH_SIZE == 0) {
                    int[] affectUpdateRows = updateps.executeBatch();
                    log.info("date:{},hour:{},updateRows:{}", currentDate, currentHour, affectUpdateRows.length);
                }
            } else {
                ii++;
                Project p = entry.getValue();
                insertps.setString(1, p.getProjectName());
                insertps.setInt(2, p.getProjectType());

                insertps.setInt(3, p.getId());
                insertps.setString(4, currentDate);
                insertps.setString(5, currentHourStr);
                insertps.setInt(6, hourUser);
                insertps.setInt(7, frontHourUser);
                insertps.setInt(8, stayHourUser);

                insertps.setString(9, p.getProjectNum());
                insertps.setString(10, p.getLogicalCity());
                insertps.setString(11, p.getTenantId());

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
     * 获取当前日期的已入库信息 
     * @param dateStr
     * @return
     * @throws SQLException
     */
    private static Set<String> queryMetricHourRealTime(String dateStr, Integer hour) throws SQLException {
        String sql = "select project_id from TD_METRIC_HOUR_REAL_TIME where date='" + dateStr + "' and hour=" + hour+" and project_type=1";
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
}
