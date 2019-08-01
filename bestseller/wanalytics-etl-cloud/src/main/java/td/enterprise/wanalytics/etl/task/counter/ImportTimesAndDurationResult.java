package td.enterprise.wanalytics.etl.task.counter;

import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;

import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;
import td.enterprise.wanalytics.etl.task.lz.MetricUtils;
import td.enterprise.wanalytics.etl.util.FileUtil;

/**
 * 导入到TD_METRIC_DAY表中
 * 导入到到访时长，到访次数，停留时长，停留次数
 * TD_TENANT_STAY_DURATION
 * 原数据导入counter表：
 * offline_active_user_times_day_counter
 * offline_active_user_duration_day_counter
 * offline_stay_user_duration_day_counter
 * offline_stay_user_times_day_counter
 *
 */
@Slf4j
public class ImportTimesAndDurationResult {

    public static void main(String[] args) {
        try {

            long begin = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("inputFile", "inputFile", true, "输入文件");
            CommandLineParser parser = new DefaultParser();
            CommandLine line = parser.parse(options, args);
            String inputFile = line.getOptionValue("inputFile");
            execute(inputFile);
            long end = System.currentTimeMillis();
            log.info("导入到TD_METRIC_DAY表中结束.用时：" + (end - begin) / 1000 + " 秒 ");
        } catch (Exception e) {
            log.error("ImportTimesAndDurationResult Error", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    public static void execute(String inputFile) throws Exception {

        Connection conn2Analytics = DbWifianalyticsConn.getConnection();
        String updateSql = "update TD_METRIC_DAY " //
                + "set active_duration=?,active_times=?,stay_duration=?,stay_times=?,"//
                + "new_active_duration=?,new_active_time=?,old_active_duration=?,old_active_time=?" //
                + ",update_time=? where project_id=? and date=? ";
        PreparedStatement updateps = conn2Analytics.prepareStatement(updateSql);
        Timestamp updateTime = new Timestamp(System.currentTimeMillis());

        BufferedReader br = null;
        FileReader fr = null;
        try {
            fr = new FileReader(inputFile);
            br = new BufferedReader(fr);
            String line = br.readLine();
            int i = 0;
            while (null != line) {
                String[] values = line.split(",");
                if (values.length != 15) {
                    log.error("字段数目不对，或略处理");
                }
                i++;
                String tenantId = values[0];
                String projectId = values[1];
                String runDate = values[2];
                String stayNew = values[3];
                String stayOld = values[4];
                String stayTotal = values[5];
                String visitTimes = values[6];
                String stayTimes = values[7];
                String visitDuration = values[8];
                String stayNewDuration = values[9];
                String stayOldDuration = values[10];

                String visitNewDuration = values[11];
                String visitOldDuration = values[12];
                String visitNewTime = values[13];
                String visitOldTime = values[14];

                insertActiveAndStayData(updateps, tenantId, projectId, runDate, Integer.parseInt(visitTimes), Integer.parseInt(visitDuration),
                        Integer.parseInt(stayNew), Integer.parseInt(stayOld), Integer.parseInt(stayNewDuration), Integer.parseInt(stayOldDuration),
                        Integer.parseInt(stayTimes), Integer.parseInt(stayTotal), Integer.parseInt(visitNewDuration), //
                        Integer.parseInt(visitOldDuration), Integer.parseInt(visitNewTime), Integer.parseInt(visitOldTime), updateTime);
                i++;
                if (i % MetricUtils.BATCH_SIZE == 0) {
                    int[] affectUpdateRows = updateps.executeBatch();
                    log.info("updateRowsMetricDay:{}", affectUpdateRows.length);
                }
                line = br.readLine();
            }
            int[] affectUpdateRows = updateps.executeBatch();
            log.info("updateRowsMetricDay:{}", affectUpdateRows.length);
        } catch (Exception e) {
            log.error("ImportTimesAndDurationResult failed!", e);
            throw new Exception("ImportTimesAndDurationResult failed!", e);
        } finally {
            FileUtil.close(br, fr);
        }
    }

    /**
     * 添加到访次数，和到访时间，添加停留次数，和停留时间
     * @param tenantId
     * @param projectId
     * @param runDate
     * @param visitTimes
     * @param visitDuration
     * @param tenantId
     * @param projectId
     * @param runDate
     * @param stayNew
     * @param stayOld
     * @param stayNewDuration
     * @param stayOldDuration
     * @throws SQLException 
     */
    public static void insertActiveAndStayData(PreparedStatement updateps, String tenantId, String projectId,//
            String runDate, int visitTimes, int visitDuration, int stayNew, int stayOld, int stayNewDuration,//
            int stayOldDuration, int stayTimes, int stayTotal, int visitNewDuration, int visitOldDuration,//
            int visitNewTime, int visitOldTime, Timestamp updateTime) throws SQLException {
        int stayDuration = stayNewDuration + stayOldDuration;
        updateps.setInt(1, visitDuration);
        updateps.setInt(2, visitTimes);
        updateps.setInt(3, stayDuration);
        updateps.setInt(4, stayTimes);
        updateps.setInt(5, visitNewDuration);
        updateps.setInt(6, visitNewTime);
        updateps.setInt(7, visitOldDuration);
        updateps.setInt(8, visitOldTime);
        updateps.setTimestamp(9, updateTime);
        //where
        updateps.setString(10, projectId);
        updateps.setString(11, runDate);
        updateps.addBatch();
    }
}
