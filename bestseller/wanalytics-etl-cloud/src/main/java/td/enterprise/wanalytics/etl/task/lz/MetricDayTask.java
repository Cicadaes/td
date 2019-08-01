package td.enterprise.wanalytics.etl.task.lz;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;

import td.enterprise.entity.Project;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.util.DateUtil;

/**
 * 实时客流
 * @description 
 * @author sxk
 * @date 2017年11月6日
 */
@Slf4j
public class MetricDayTask {

    private static Connection conn2Analytics;
    private static LocalDate  runDate     = null;
    static {
        conn2Analytics = DbWifianalyticsConn.getConnection();
    }
    private static int        RUN_SUCCESS = 0;
    private static int        RUN_ERROR   = 1;

    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        String dateStr = "2017-11-07";

        Options options = new Options();
        options.addOption("d", "date", true, "实时客流统计日期");

        CommandLineParser parser = new DefaultParser();
        CommandLine line;
        try {
            line = parser.parse(options, args);
            dateStr = line.getOptionValue("date");
        } catch (ParseException e1) {
            log.warn("params error,date:{}", dateStr);
            e1.printStackTrace();
        }

        runDate = getDate(dateStr);
        if (null == runDate) {
            System.exit(RUN_ERROR);
        }
        Map<String, Project> allProjects = MetricUtils.queryAllProjects();
        if (null == allProjects || allProjects.isEmpty()) {
            System.exit(RUN_ERROR);
        }

        try {
            dayBatchInsert(dateStr, allProjects);
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
        log.info("MetricDayTask:{}", (end - start) + " Minlls");
        System.exit(RUN_SUCCESS);
    }

    /**
     * 获取当前日期的已入库信息 
     * @param dateStr
     * @return
     * @throws SQLException
     */
    private static Set<String> queryMetricDay(String dateStr) throws SQLException {
        String sql = "select project_id from TD_METRIC_DAY where date='" + dateStr + "' and project_type=1";
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

    public static void dayBatchInsert(String dateStr, Map<String, Project> allProjects) throws SQLException {
        PreparedStatement insertps = null;
        PreparedStatement updateps = null;
        String insertSql = "insert into TD_METRIC_DAY "//
                + " (brand,region,city,province,channel,mall,project_name,project_type,project_id," //
                + "date,week_of_year,month," //
                + "active_new_users,active_old_users,active_users,stay_new_users,stay_old_users,stay_users,"//
                + "front_users,jump_users," //
                + "high_active_users,middle_active_users,low_active_users,sleep_active_users," //
                + "high_stay_users,middle_stay_users,low_stay_users,sleep_stay_users," //
                + "project_num,logical_city,tenant_id,c_city_cn_name) " // 
                + "values (?,?,?,?,?,?,?,?,?,  ?,?,?,  ?,?,?,?,?,?,  ?,?,  ?,?,?,?,  ?,?,?,?,  ?,?,?,?) ";//

        String updateSql = "update TD_METRIC_DAY "//
                + "set active_new_users=?,active_old_users=?,active_users=?,stay_new_users=?,stay_old_users=?,stay_users=?,"//
                + "front_users=?,jump_users=?," //
                + "high_active_users=?,middle_active_users=?,low_active_users=?,sleep_active_users=?,"
                + "high_stay_users=?,middle_stay_users=?,low_stay_users=?,sleep_stay_users=?,update_time=?" // 
                + "where project_id=? and date=? ";//

        insertps = conn2Analytics.prepareStatement(insertSql);
        updateps = conn2Analytics.prepareStatement(updateSql);

        int ii = 0;
        int ui = 0;

        Set<String> dateMetrictSet = queryMetricDay(dateStr);

        Map<String, Integer> rm2New = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2New);
        Map<String, Integer> rm2Old = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2Old);
        Map<String, Integer> rm2NStay = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2NStay);
        Map<String, Integer> rm2OStay = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2OStay);

        Map<String, Integer> rm2Front = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2Front);
        Map<String, Integer> rm2Jump = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2Jump);

        Map<String, Integer> rm2HAcitve = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2HActive);
        Map<String, Integer> rm2MActive = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2MActive);
        Map<String, Integer> rm2LActive = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2LActive);
        Map<String, Integer> rm2SActive = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2SActive);

        Map<String, Integer> rm2HStay = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2HStay);
        Map<String, Integer> rm2MStay = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2MStay);
        Map<String, Integer> rm2LStay = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2LStay);
        Map<String, Integer> rm2SStay = MetricUtils.queryMetricDateMap(dateStr, MetricDayConstants.script2SStay);

        String projectId;
        int newUser = 0;
        int oldUser = 0;
        int stayNUser = 0;
        int stayOUser = 0;

        int frontUser = 0;
        int jumpUser = 0;
        int hActiveUser = 0;
        int mActiveUser = 0;
        int lActiveUser = 0;
        int sActiveUser = 0;

        int hStayUser = 0;
        int mStayUser = 0;
        int lStayUser = 0;
        int sStayUser = 0;
        Timestamp updateTime = new Timestamp(runDate.toDateTimeAtCurrentTime().getMillis());

        for (Map.Entry<String, Project> entry : allProjects.entrySet()) {
            projectId = entry.getKey();
            //更新
            if (dateMetrictSet.contains(projectId)) {
                ui++;
                newUser = rm2New.get(projectId) == null ? 0 : rm2New.get(projectId);
                oldUser = rm2Old.get(projectId) == null ? 0 : rm2Old.get(projectId);
                stayNUser = rm2NStay.get(projectId) == null ? 0 : rm2NStay.get(projectId);
                stayOUser = rm2OStay.get(projectId) == null ? 0 : rm2OStay.get(projectId);

                updateps.setInt(1, newUser);
                updateps.setInt(2, oldUser);
                updateps.setInt(3, newUser + oldUser);
                updateps.setInt(4, stayNUser);
                updateps.setInt(5, stayOUser);
                updateps.setInt(6, stayNUser + stayOUser);

                frontUser = rm2Front.get(projectId) == null ? 0 : rm2Front.get(projectId);
                jumpUser = rm2Jump.get(projectId) == null ? 0 : rm2Jump.get(projectId);

                updateps.setInt(7, frontUser);
                updateps.setInt(8, jumpUser);

                hActiveUser = rm2HAcitve.get(projectId) == null ? 0 : rm2HAcitve.get(projectId);
                mActiveUser = rm2MActive.get(projectId) == null ? 0 : rm2MActive.get(projectId);
                lActiveUser = rm2LActive.get(projectId) == null ? 0 : rm2LActive.get(projectId);
                sActiveUser = rm2SActive.get(projectId) == null ? 0 : rm2SActive.get(projectId);

                //进店客流的活跃度
                updateps.setInt(9, hActiveUser);
                updateps.setInt(10, mActiveUser);
                updateps.setInt(11, lActiveUser);
                updateps.setInt(12, sActiveUser);

                hStayUser = rm2HStay.get(projectId) == null ? 0 : rm2HStay.get(projectId);
                mStayUser = rm2MStay.get(projectId) == null ? 0 : rm2MStay.get(projectId);
                lStayUser = rm2LStay.get(projectId) == null ? 0 : rm2LStay.get(projectId);
                sStayUser = rm2SStay.get(projectId) == null ? 0 : rm2SStay.get(projectId);

                //停留客流的活跃度人数
                updateps.setInt(13, hStayUser);
                updateps.setInt(14, mStayUser);
                updateps.setInt(15, lStayUser);
                updateps.setInt(16, sStayUser);
                //where
                updateps.setTimestamp(17, updateTime);

                updateps.setString(18, projectId);
                updateps.setString(19, dateStr);

                updateps.addBatch();
                if (ui % MetricUtils.BATCH_SIZE == 0) {
                    int[] affectUpdateRows = updateps.executeBatch();
                    log.info("updateRows:{}", affectUpdateRows.length);
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
                //项目信息结束

                insertps.setString(10, dateStr);
                insertps.setString(11, runDate.weekOfWeekyear().get() + "");
                insertps.setString(12, runDate.monthOfYear().get() + "");
                //日期结束

                newUser = rm2New.get(projectId) == null ? 0 : rm2New.get(projectId);
                oldUser = rm2Old.get(projectId) == null ? 0 : rm2Old.get(projectId);
                stayNUser = rm2NStay.get(projectId) == null ? 0 : rm2NStay.get(projectId);
                stayOUser = rm2OStay.get(projectId) == null ? 0 : rm2OStay.get(projectId);

                insertps.setInt(13, newUser);
                insertps.setInt(14, oldUser);
                insertps.setInt(15, newUser + oldUser);
                insertps.setInt(16, stayNUser);
                insertps.setInt(17, stayOUser);
                insertps.setInt(18, stayNUser + stayOUser);

                frontUser = rm2Front.get(projectId) == null ? 0 : rm2Front.get(projectId);
                jumpUser = rm2Jump.get(projectId) == null ? 0 : rm2Jump.get(projectId);

                insertps.setInt(19, frontUser);
                insertps.setInt(20, jumpUser);

                hActiveUser = rm2HAcitve.get(projectId) == null ? 0 : rm2HAcitve.get(projectId);
                mActiveUser = rm2MActive.get(projectId) == null ? 0 : rm2MActive.get(projectId);
                lActiveUser = rm2LActive.get(projectId) == null ? 0 : rm2LActive.get(projectId);
                sActiveUser = rm2SActive.get(projectId) == null ? 0 : rm2SActive.get(projectId);

                //进店客流的活跃度
                insertps.setInt(21, hActiveUser);
                insertps.setInt(22, mActiveUser);
                insertps.setInt(23, lActiveUser);
                insertps.setInt(24, sActiveUser);

                hStayUser = rm2HStay.get(projectId) == null ? 0 : rm2HStay.get(projectId);
                mStayUser = rm2MStay.get(projectId) == null ? 0 : rm2MStay.get(projectId);
                lStayUser = rm2LStay.get(projectId) == null ? 0 : rm2LStay.get(projectId);
                sStayUser = rm2SStay.get(projectId) == null ? 0 : rm2SStay.get(projectId);

                //停留客流的活跃度人数
                insertps.setInt(25, hStayUser);
                insertps.setInt(26, mStayUser);
                insertps.setInt(27, lStayUser);
                insertps.setInt(28, sStayUser);
                insertps.setString(29, p.getProjectNum());
                insertps.setString(30, p.getLogicalCity());
                insertps.setString(31, p.getTenantId());
                insertps.setString(32, p.getCityCnName());

                insertps.addBatch();
                if (ii % MetricUtils.BATCH_SIZE == 0) {
                    int[] affectInsertRows = insertps.executeBatch();
                    log.info("insertRows:{}", affectInsertRows.length);
                }
            }

        }
        int[] affectInsertRows = insertps.executeBatch();
        int[] affectUpdateRows = updateps.executeBatch();
        log.info("insertRows:{},updateRows:{}", affectInsertRows.length, affectUpdateRows.length);
    }

    /**
     * 转换日期
     * @param dateStr
     * @return
     *
     */
    private static LocalDate getDate(String dateStr) {
        if (StringUtils.isEmpty(dateStr)) {
            log.warn("params error,date:{}", dateStr);
            return null;
        }
        LocalDate date = null;
        try {
            date = LocalDate.parse(dateStr, DateTimeFormat.forPattern(DateUtil.PATTERN_DATE));
        } catch (IllegalArgumentException e) {
            log.warn("params error,date:{}", dateStr);
            e.printStackTrace();
            return null;
        }
        if (date.isAfter(LocalDate.now())) {
            log.warn("params error,date:{}", dateStr);
            return null;
        }
        return date;
    }

}
