package td.enterprise.wanalytics.etl.task.clean;

import org.apache.commons.cli.*;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.QueryUtils;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * junmin.li
 * 获取临时hive表名，根据日期yyyyMMdd
 */
public class GetTempHiveTableByDate {

    public static Logger logger = Logger.getLogger(CreateProjectCrowdDataTask.class);

    public static void main(String []args) throws ParseException {
        Options options = new Options();
        options.addOption("date", "date", true, "日期");
        options.addOption("outputFile", "outputFile", true, "输出文件");
        options.addOption("dbName", "dbName", true, "数据库名称");//默认是wifianalytics

        CommandLineParser parser = new PosixParser();
        CommandLine line = parser.parse(options, args);
        String tmpDate = line.getOptionValue("date");
        String outputFile = line.getOptionValue("outputFile");
        String dbName = line.getOptionValue("dbName");
        logger.info("tmpDate=" + tmpDate + "  outputFile=" + outputFile + " dbName=" + dbName);
        execute(tmpDate,outputFile,dbName);
        logger.info("GetTempHiveTableByDate.. 生成hive临时表完毕");
    }

    public static Boolean execute(String tmpDate,String outputFile,String dbName){
        BufferedWriter bw = null;
        FileWriter writer = null;
        try {
            writer = new FileWriter(outputFile);
            bw = new BufferedWriter(writer);
            List<Map<String,Object>> list = getTmpTablesByDate (tmpDate,dbName);
            for(Map<String,Object> map : list){
                bw.append("drop table ").append(map.get("TBL_NAME").toString()).append(Constant.SEMICOLON);
                bw.append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
            }
            bw.flush();
        }catch(Exception e){
            logger.error("写到文件失败：", e);
        }finally{
            FileUtil.close(writer,bw);
        }

        return true;
    }

    /**
     * 公用方法
     * @param date
     * @param dbName
     * @return
     */
    public static List<Map<String,Object>> getTmpTablesByDate(String date,String dbName){
        String dbSql = "select DB_ID from DBS where NAME='" + dbName + "'";
        Map<String,Object> dbMap = QueryUtils.querySingle(dbSql,QueryUtils.HIVE_DB);
        List<Map<String,Object>> list = new ArrayList<>();
        if(dbMap == null ){
            logger.error("hive 数据库=" + dbName + " 没找到");
            return list;
        }

        String dbID = dbMap.get("DB_ID").toString();

        String sql = "select TBL_NAME from TBLS where DB_ID=" + dbID + " and TBL_NAME like '%" + date + "%'" ;
        list = QueryUtils.query(sql,QueryUtils.HIVE_DB);
        return list;
    }
}
