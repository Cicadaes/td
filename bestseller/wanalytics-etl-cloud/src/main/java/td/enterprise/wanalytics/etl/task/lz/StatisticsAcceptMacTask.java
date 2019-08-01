package td.enterprise.wanalytics.etl.task.lz;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.apache.commons.lang3.StringUtils;

import td.enterprise.entity.Sensor;
import td.enterprise.wanalytics.etl.jdbc.DbCounterConn;
import td.enterprise.wanalytics.etl.task.lz.MetricUtils;
import td.enterprise.wanalytics.etl.util.DateUtil;

import com.clearspring.analytics.stream.cardinality.AdaptiveCounting;
import com.clearspring.analytics.stream.cardinality.ICardinality;

/**
 * @description 
 * @author sxk
 * @date 2018年1月29日
 */
@Slf4j
public class StatisticsAcceptMacTask {

    private static Connection                    conn2Counter;
    private static LocalDate                     runDate          = null;

    /**
     * FTP文件夹日期格式
     */
    public static final DateTimeFormatter        FTP_PATTERN      = DateTimeFormatter.ofPattern("yyyyMMdd");
    /**
     * FTP文件夹日期小时格式
     */
    public static final DateTimeFormatter        FTP_PATTERN_HOUR = DateTimeFormatter.ofPattern("yyyyMMddHH");

    /**
     * 文件读取后缀
     */
    public static final String                   FTP_FILE_SUFFIX  = ".zip";

    private static HashMap<String, ICardinality> apMac2CountMap   = new HashMap<>();

    static {
        conn2Counter = DbCounterConn.getConnection();
    }
    private static int                           RUN_SUCCESS      = 0;
    private static int                           RUN_ERROR        = 1;

    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        String dateStr = "2017-12-13";
        //ftp文件存储路径
        String ftpPath = "/data/wifianalytics/bestseller/";
        String seaFtpPath = "/data/wifianalytics/seabestseller/";

        Options options = new Options();
        options.addOption("d", "date", true, "统计接受mac日期");
        options.addOption("fp", "ftpPath", true, "大陆path");
        options.addOption("sfp", "seaFtpPath", true, "海外path");

        CommandLineParser parser = new DefaultParser();
        CommandLine line;
        try {
            line = parser.parse(options, args);
            dateStr = line.getOptionValue("date");
            ftpPath = line.getOptionValue("ftpPath");
            seaFtpPath = line.getOptionValue("seaFtpPath");
        } catch (ParseException e1) {
            log.warn("params error,date:{}", dateStr);
            e1.printStackTrace();
        }

        runDate = getDate(dateStr);
        if (null == runDate) {
            System.exit(RUN_ERROR);
        }

        Map<String, Sensor> allSensors = MetricUtils.queryAllSensor();
        if (null == allSensors || allSensors.isEmpty()) {
            System.exit(RUN_ERROR);
        }

        try {
            dayBatchInsert(ftpPath, seaFtpPath, dateStr, allSensors);
        } catch (SQLException e) {
            e.printStackTrace();
        }

        if (null != conn2Counter) {
            try {
                conn2Counter.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        long end = System.currentTimeMillis();
        log.info("StatisticsAcceptMacTask:{}", (end - start) + " Minlls");
        System.exit(RUN_SUCCESS);
    }

    public static void dayBatchInsert(String ftpPath, String seaFtpPath, String dateStr, Map<String, Sensor> allSensors) throws SQLException {
        PreparedStatement delps = null;
        PreparedStatement insertps = null;

        String delSql = "delete from offline_sensor_all_mac_day_counter where date=?";//
        String insertSql = "insert into offline_sensor_all_mac_day_counter (project_id,sensor_id,date,metric_value) values(?,?,?,?)";

        delps = conn2Counter.prepareStatement(delSql);
        insertps = conn2Counter.prepareStatement(insertSql);

        macCount(ftpPath);
        macCount(seaFtpPath);

        delps.setString(1, dateStr);
        int delRows = delps.executeUpdate();
        log.info("delRows:{}", delRows);

        int i = 0;
        for (Map.Entry<String, Sensor> entry : allSensors.entrySet()) {
            Sensor sensor = entry.getValue();
            Integer metricValue = apMac2CountMap.get(entry.getKey()) == null ? 0 : (int) apMac2CountMap.get(entry.getKey()).cardinality();

            insertps.setInt(1, sensor.getProjectId());
            insertps.setInt(2, sensor.getId());
            insertps.setString(3, dateStr);
            insertps.setInt(4, metricValue);
            insertps.addBatch();
            i++;
            if (i % MetricUtils.BATCH_SIZE == 0) {
                int[] affectInsertRows = insertps.executeBatch();
                log.info("insertRows:{}", affectInsertRows.length);
            }
        }

        int[] affectInsertRows = insertps.executeBatch();
        log.info("insertRows:{},delRows:{}", affectInsertRows.length, delRows);
    }

    private static void macCount(String path) {
        for (int i = 0; i < 24; i++) {
            LocalTime fixTime = LocalTime.of(i, 0);
            LocalDateTime fixDateTime = LocalDateTime.of(runDate, fixTime);

            String localPath = path + fixDateTime.format(FTP_PATTERN) + "/" + fixDateTime.format(FTP_PATTERN_HOUR) + "/";

            File fixDataDirectory = new File(localPath);
            if (!fixDataDirectory.isDirectory()) {
                log.info(localPath + " is not directory");
                continue;
            }
            log.info("ftpPath:{}", localPath);

            File[] list = fixDataDirectory.listFiles();

            for (File file : list) {
                if (null == file || file.length() == 0) {
                    log.error("file is null");
                    continue;
                }
                if (!file.getName().endsWith(FTP_FILE_SUFFIX)) {
                    log.warn("file {} is bak", file.getName());
                    continue;
                }
                try (ZipFile zf = new ZipFile(file)) {
                    Enumeration<ZipEntry> entries = (Enumeration<ZipEntry>) zf.entries();
                    ZipEntry ze;
                    // 枚举zip文件内的文件
                    while (entries.hasMoreElements()) {
                        ze = entries.nextElement();
                        // 读取目标对象
                        if (ze.isDirectory() || ze.getSize() == 0) {
                            log.error("zipFile is directory or is null");
                            continue;
                        } else {
                            log.debug("file - " + ze.getName() + " : " + ze.getSize() + " bytes");
                            long size = ze.getSize();
                            if (size > 0) {
                                try (BufferedReader br = new BufferedReader(new InputStreamReader(zf.getInputStream(ze)))) {
                                    String line;
                                    while ((line = br.readLine()) != null) {
                                        // daa11952b553,13,1,9c061bcea560,1505231941913
                                        String[] split = line.split(",");
                                        if (split.length != 5) {
                                            log.error("单行数据格式错误！filename={};line={}", file.getName(), line);
                                            continue;
                                        }
                                        //用户mac
                                        String mac = split[0];
                                        //AP MAC地址
                                        String apMac = split[3];
                                        if (StringUtils.isEmpty(mac) || StringUtils.isEmpty(apMac)) {
                                            log.warn("mac:{} is null,apMac:{} is null", mac, apMac);
                                            continue;
                                        }
                                        apMac = apMac.toLowerCase();
                                        mac = mac.toLowerCase();
                                        if (apMac2CountMap.containsKey(apMac)) {
                                            ICardinality card = apMac2CountMap.get(apMac);
                                            card.offer(mac);
                                        } else {
                                            ICardinality card = AdaptiveCounting.Builder.obyCount(Integer.MAX_VALUE).build();
                                            card.offer(mac);
                                            apMac2CountMap.put(apMac, card);
                                        }
                                    }
                                } catch (Exception e) {
                                    log.error("readZipFile is error", e);
                                }
                            }

                        }
                    }

                } catch (Exception e) {
                    log.error("ZipFile is error", e);
                }

            }
        }
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
            date = LocalDate.parse(dateStr, DateTimeFormatter.ofPattern(DateUtil.PATTERN_DATE));
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
