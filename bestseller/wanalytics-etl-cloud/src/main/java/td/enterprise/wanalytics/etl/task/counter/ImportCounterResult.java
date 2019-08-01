package td.enterprise.wanalytics.etl.task.counter;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.io.*;

/**
 * 导入到counter表中
 * 导入到到访时长，到访次数，停留时长，停留次数
 * TD_TENANT_STAY_DURATION
 * offline_active_user_times_day_counter
 * offline_active_user_duration_day_counter
 * offline_stay_user_duration_day_counter
 * offline_stay_user_times_day_counter
 *
 */
public class ImportCounterResult {

    public static Logger logger = Logger.getLogger(ImportCounterResult.class);

    public static void main(String[] args) {
        try{

            long begin = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("inputFile", "inputFile", true, "输入文件");
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String inputFile = line.getOptionValue("inputFile");
            execute(inputFile);
            long end = System.currentTimeMillis();
            logger.info("导入到counter表中结束.用时：" + (end - begin)/1000 + " 秒 ");
        }catch (Exception e){
            logger.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    public static void execute(String inputFile) throws Exception{
        BufferedReader br = null;
        FileReader fr = null;
        try {
            fr = new FileReader(inputFile);
            br = new BufferedReader(fr);
            String line = br.readLine();
            while (null != line) {
                String  [] values = line.split(",");
                if( values.length != 11){
                    logger.error("字段数目不对，或略处理");
                }
                int i = 0;
                String tenantId = values [0];
                String projectId = values [1];
                String runDate = values [2];
                String stayNew = values [3];
                String stayOld = values [4];
                String stayTotal = values [5];
                String visitTimes = values [6];
                String stayTimes = values [7];
                String visitDuration = values [8];
                String stayNewDuration = values [9];
                String stayOldDuration = values [10];

                insertActiveData(tenantId,projectId,runDate,visitTimes,visitDuration);
                insertStayData(tenantId,projectId,runDate,Integer.parseInt(stayNew),Integer.parseInt(stayOld),Integer.parseInt(stayNewDuration),Integer.parseInt(stayOldDuration),Integer.parseInt(stayTimes),Integer.parseInt(stayTotal));

                line = br.readLine();
            }
        } catch (Exception e) {
            logger.info("ImportCounterResult failed!", e);
            throw new Exception("ImportCounterResult failed!", e);
        } finally {
            FileUtil.close(br,fr);
        }
    }

    /**
     * 添加到访次数，和到访时间
     * @param tenantId
     * @param projectId
     * @param runDate
     * @param visitTimes
     * @param visitDuration
     */
    public static void insertActiveData(String tenantId,String projectId,String runDate,String visitTimes,String visitDuration){
         String deleteSql = "delete from offline_active_user_times_day_counter where tenant_id='" + tenantId + "' and project_id=" + projectId + " and date='" + runDate + "'";
         String insertSql = "insert into offline_active_user_times_day_counter(tenant_id,project_id,date,metric_value)values(" + tenantId + "," + projectId + ",'" + runDate + "' ," + visitTimes  + ")" ;
         QueryUtils.execute(deleteSql,QueryUtils.COUNTER_DB);
         QueryUtils.execute(insertSql,QueryUtils.COUNTER_DB);

         deleteSql = "delete from offline_active_user_duration_day_counter where tenant_id='" + tenantId + "' and project_id=" + projectId + " and date='" + runDate + "'";
         insertSql = "insert into offline_active_user_duration_day_counter(tenant_id,project_id,date,metric_value)values(" + tenantId + "," + projectId + ",'" + runDate + "' ," + visitDuration  + ")" ;
         QueryUtils.execute(deleteSql,QueryUtils.COUNTER_DB);
         QueryUtils.execute(insertSql,QueryUtils.COUNTER_DB);

    }

    /**
     * 添加停留次数，和停留时间
     * @param tenantId
     * @param projectId
     * @param runDate
     * @param stayNew
     * @param stayOld
     * @param stayNewDuration
     * @param stayOldDuration
     */
    public static void insertStayData(String tenantId,String projectId,String runDate,int stayNew,int stayOld,int stayNewDuration, int stayOldDuration,int stayTimes,int stayTotal){
        String deleteSql = "delete from offline_stay_user_times_day_counter where tenant_id='" + tenantId + "' and project_id=" + projectId + " and date='" + runDate + "'";
        String insertSql = "insert into offline_stay_user_times_day_counter(tenant_id,project_id,date,metric_value)values(" + tenantId + "," + projectId + ",'" + runDate + "' ," + stayTimes  + ")" ;
        QueryUtils.execute(deleteSql,QueryUtils.COUNTER_DB);
        QueryUtils.execute(insertSql,QueryUtils.COUNTER_DB);

        int stayDuration = stayNewDuration + stayOldDuration;
        deleteSql = "delete from offline_stay_user_duration_day_counter where tenant_id='" + tenantId + "' and project_id=" + projectId + " and date='" + runDate + "'";
        insertSql = "insert into offline_stay_user_duration_day_counter(tenant_id,project_id,date,metric_value)values(" + tenantId + "," + projectId + ",'" + runDate + "' ," + stayDuration  + ")" ;
        QueryUtils.execute(deleteSql,QueryUtils.COUNTER_DB);
        QueryUtils.execute(insertSql,QueryUtils.COUNTER_DB);

        deleteSql = "delete from TD_TENANT_STAY_DURATION where tenant_id='" + tenantId + "' and project_id=" + projectId + " and date='" + runDate + "'";
        int averStayDuration = 0;
        int averStayNewDuration = 0;
        int averStayOldDuration = 0;
        if(stayTotal != 0){
            averStayDuration = stayDuration/stayTotal;
        }
        if(stayNew != 0){
            averStayNewDuration = stayNewDuration/stayNew;
        }
        if(stayOld != 0){
            averStayOldDuration = stayOldDuration/stayOld;
        }

        insertSql = "insert into TD_TENANT_STAY_DURATION(tenant_id,project_id,date,stay_users,new_users,old_users,stay_duration,new_duration,old_duration,average_stay_duration,average_new_duration,average_old_duration) " +
                "values(" + tenantId + "," + projectId + ",'" + runDate + "' ," + stayTotal  + "," + stayNew  + "," + stayOld  + "," + stayDuration + "," + stayNewDuration + "," + stayOldDuration + "," + averStayDuration + "," + averStayNewDuration + "," + averStayOldDuration+ ")" ;
        QueryUtils.execute(deleteSql,QueryUtils.WIFIANALYTICS_DB);
        QueryUtils.execute(insertSql,QueryUtils.WIFIANALYTICS_DB);

    }
}
