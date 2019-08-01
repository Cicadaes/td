package td.enterprise.wanalytics.etl.task.counter;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.io.BufferedReader;
import java.io.FileReader;

/**
 * 导入到Counter总
 */
public class ImportCounter {
    public static Logger logger = Logger.getLogger(ImportCounter.class);

    public static void main(String[] args) {
        try{
            long begin = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("inputFile", "inputFile", true, "输入文件");
            options.addOption("counter", "counter", true, "输入文件");
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String inputFile = line.getOptionValue("inputFile");
            String counter = line.getOptionValue("counter");
            execute(inputFile,counter);
            long end = System.currentTimeMillis();
            logger.info("导入到counter表中结束.用时：" + (end - begin)/1000 + " 秒 ");
        }catch (Exception e){
            logger.error("SendCollectorDataTask",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    public static void execute(String inputFile,String counter) throws Exception{
        BufferedReader br = null;
        FileReader fr = null;
        try {
            fr = new FileReader(inputFile);
            br = new BufferedReader(fr);
            String line = br.readLine();
            while (null != line) {
                switch (counter){
                    case "offline_enter_user_degree_duration_counter" :
                        insertDegreeDurationData(line);
                        break;
                    case "offline_enter_user_degree_times_counter" :
                        insertDegreeTimesData(line);
                        break;
                }
                line = br.readLine();
            }
        } catch (Exception e) {
            logger.info("ImportCounter failed!", e);
            throw new Exception("ImportCounter failed!", e);
        } finally {
            FileUtil.close(br,fr);
        }
    }

    /**
     * offline_enter_user_degree_duration_counter
     * @param line
     */
    public static void insertDegreeDurationData(String line){
        String [] values = line.split(",");
        if(null != values && 6 == values.length){
            int i = 0 ;
            String tenantId = values [ i ++] ;
            String projectId = values [ i ++] ;
            String date = values [ i ++] ;
            String type = values [ i ++] ;
            String room_number = values [ i ++] ;
            String metric_value = values [ i ++] ;
            String  deleteSql = "delete from offline_enter_user_degree_duration_counter where tenant_id='" + tenantId + "' and project_id=" + projectId + " and date='" + date + "' and room_number=" + room_number  + " and type='" + type + "'" ;
            String insertSql = "insert into offline_enter_user_degree_duration_counter(tenant_id,project_id,date,type,room_number,metric_value) values(" + tenantId + "," + projectId + ",'" + date + "' ,'" + type  + "'," +  room_number +  "," + metric_value  + ") " ;
            QueryUtils.execute(deleteSql, QueryUtils.COUNTER_DB);
            QueryUtils.execute(insertSql,QueryUtils.COUNTER_DB);
        }
    }

    /**
     * offline_enter_user_degree_times_counter
     * @param line
     */
    public static void insertDegreeTimesData(String line){
        String [] values = line.split(",");
        if(null != values && 6 == values.length){
            int i = 0 ;
            String tenantId = values [ i ++] ;
            String projectId = values [ i ++] ;
            String date = values [ i ++] ;
            String type = values [ i ++] ;
            String room_number = values [ i ++] ;
            String metric_value = values [ i ++] ;
            String  deleteSql = "delete from offline_enter_user_degree_times_counter where tenant_id='" + tenantId + "' and project_id=" + projectId + " and date='" + date + "' and room_number=" + room_number + " and type='" + type + "'";
            String insertSql = "insert into offline_enter_user_degree_times_counter(tenant_id,project_id,date,type,room_number,metric_value) values(" + tenantId + "," + projectId + ",'" + date + "' ,'" + type  + "'," +  room_number +  "," + metric_value  + ")" ;
            QueryUtils.execute(deleteSql, QueryUtils.COUNTER_DB);
            QueryUtils.execute(insertSql,QueryUtils.COUNTER_DB);
        }
    }
}
