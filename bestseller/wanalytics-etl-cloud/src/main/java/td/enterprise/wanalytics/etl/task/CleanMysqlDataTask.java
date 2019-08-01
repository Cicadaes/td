package td.enterprise.wanalytics.etl.task;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.QueryUtils;

/**
 * 清理数据库表数据，根据指定条件进行清理
 */
public class CleanMysqlDataTask {

    public static Logger logger = Logger.getLogger(CleanMysqlDataTask.class);

    public static void main(String[] args) {
        try{

            Options options = new Options();
            options.addOption("code", "code", true, "输入代码");
            options.addOption("condition", "condition", true, "条件");
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String code = line.getOptionValue("code");
            String condition = line.getOptionValue("condition");//条件不能为空，如果为空，进行报错，不处理
            logger.info("code=" + code + " condition=" + condition);
            if(StringUtils.isBlank(condition)){
                logger.error("条件不能为空，如果为空忽略执行");
                return ;
            }
            long begin = System.currentTimeMillis();
            execute(code,condition);
            long end = System.currentTimeMillis();
            logger.info("----CleanMysqlDataTask Task is over. Used Time :" + (end - begin) / 1000 + " seconds.");
        }catch (Exception e){
            logger.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    /**
     * 根据指定条件，清理数据库表数据
     * @param code
     */
    public static void execute(String code,String condition) {
          if(StringUtils.isBlank(condition)){
              logger.info("条件为空，不执行");
              return;
          }
           String sql = "";
           switch (code.toUpperCase()){
               case "TD_TENANT_HOUSING_COVERAGE_COUNT":
               case "TD_TENANT_JOB_HOUSING_COUNT":
               case "TD_TENANT_REGION_COUNT":
               case "TD_TENANT_TOP_AREA_COUNT":
                   String arry [] = condition.split("\\|");
                    sql = "delete from " + code +" where run_date='" + arry[0] + "' and project_id=" + arry[1] + " and crowd_id=" + arry[2]  ;
                   break;
           }
           logger.info("执行清理的Sql 是：" + sql);
           if(StringUtils.isNotBlank(sql)){
               QueryUtils.execute(sql,QueryUtils.WIFIANALYTICS_DB);
           }
    }
}
