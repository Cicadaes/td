package td.enterprise.wanalytics.etl.task.lz;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.*;
import org.apache.commons.cli.ParseException;
import td.enterprise.wanalytics.etl.jdbc.DbWifianalyticsConn;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by admin on 2017/11/28.
 */
@Slf4j
public class VisitCycle {
    private static Connection conn2Analytics;
    static {
        conn2Analytics = DbWifianalyticsConn.getConnection();
    }
    private final static int   RUN_SUCCESS     = 0;
    private final static int   RUN_ERROR       = 1;

    /**
     * @param args  传入的参数有文件日期 runDate 还有文件目录
     * @throws Exception
     */
    public static void main(String[] args) throws Exception {
        String runDate=null;
        String dealFile=null;

        Options options = new Options();
        options.addOption("d", "runDate", true, "处理时间");
        options.addOption("f", "dealFile", true, "处理文件");

        CommandLineParser parser = new PosixParser();
        CommandLine line;
        try {
            line = parser.parse(options, args);
            runDate = line.getOptionValue("runDate");
            dealFile = line.getOptionValue("dealFile");
        } catch (ParseException e1) {
            log.warn("params error,date:{},hour:{}", runDate);
            e1.printStackTrace();
        }


        updateVisitCycle(runDate,dealFile);

        if (null != conn2Analytics) {
            try {
                conn2Analytics.close();
            } catch (SQLException e) {
                e.printStackTrace();
                System.exit(RUN_ERROR);
            }
        }
        System.exit(RUN_SUCCESS);
    }

   /**
     *  文件 中每行含两个字段，依次为project_id, 到访时长， 两个字段以逗号分隔
     * @param runDate
     * @param dealFile
     */
    private static void updateVisitCycle(String runDate,String dealFile) {
        List<String> srcList = readFileByLines(dealFile);

        String sql = "update TD_METRIC_DAY set visit_cycle=? where project_id=? and date=?";

        try {
            PreparedStatement pstat = conn2Analytics.prepareStatement(sql);
            for(int k=0;k<srcList.size();k++){
                String line = srcList.get(k);
                String [] arrs = line.split(",");
                pstat.setLong(1,Long.valueOf(arrs[1]));
                pstat.setLong(2,Long.valueOf(arrs[0]));
                pstat.setDate(3, new java.sql.Date(new SimpleDateFormat("yyyy-MM-dd").parse(runDate).getTime()));

                pstat.addBatch();
             }
            pstat.executeBatch();
            pstat.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static List<String> readFileByLines(String fileName) {
        List<String> result = new ArrayList<String>();
        File file = new File(fileName);
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(file));
            String tempString = null;
            // 一次读入一行，直到读入null为文件结束
            while ((tempString = reader.readLine()) != null) {
                if (!tempString.trim().isEmpty()){
                    result.add(tempString);
                }
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e1) {
                }
            }
        }
        return result;
    }
}
