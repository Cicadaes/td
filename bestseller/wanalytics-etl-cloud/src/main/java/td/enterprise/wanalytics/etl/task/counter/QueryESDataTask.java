package td.enterprise.wanalytics.etl.task.counter;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.HttpUtil;
import td.olap.query.WiFiAnalyticsESQuerService;
import td.olap.query.runscript.bean.EsQueryBean;
import td.olap.query.runscript.bean.QueryEngineResult;
import td.olap.query.utils.QueryEngineResultUtil;
import td.olap.query.utils.QueryServiceUtils;

import java.io.FileWriter;

/**
 * 从ES中查询数据
 * 追加到文件中
 */
public class QueryESDataTask {

    public static Logger logger = Logger.getLogger(QueryESDataTask.class);

    public static void main(String[] args) {
        try{

            long begin = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("outputFile", "outputFile", true, "输出文件");//追加到文件中
            options.addOption("runDate", "runDate", true, "运行日期");
            options.addOption("projectId", "projectId", true, "项目ID");
            options.addOption("tenantId", "tenantId", true, "租户ID");
            options.addOption("visitMinutes", "visitMinutes", true, "到访时间");
            options.addOption("stayMinutes", "stayMinutes", true, "停留时间");
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String outputFile = line.getOptionValue("outputFile");
            String runDate    = line.getOptionValue("runDate");
            int projectId = Integer.parseInt(line.getOptionValue("projectId"));
            int visitMinutes = Integer.parseInt(line.getOptionValue("visitMinutes"));
            int stayMinutes = Integer.parseInt(line.getOptionValue("stayMinutes"));
            String tenantId = line.getOptionValue("tenantId");
            execute(outputFile,runDate,projectId,visitMinutes,stayMinutes,tenantId);
            long end = System.currentTimeMillis();
            logger.info("生成项目停留数据完毕.用时：" + (end - begin)/1000 + " 秒 ");
        }catch (Exception e){
            logger.error("",e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    public static Boolean execute(String outputFile,String runDate,int projectId,int visitMinutes,int stayMinutes,String tenantId) throws Exception{
        FileWriter bw = null;
        String clusterName = HttpUtil.getParamFromConfigServer("es.cluster.name");
        String hosts = HttpUtil.getParamFromConfigServer("es.hosts");
        logger.info("es cluster name =" + clusterName + " hosts=" + hosts);

         WiFiAnalyticsESQuerService esQueryService =  WiFiAnalyticsESQuerService.getInstance(clusterName, hosts);
         long dateLong = DateUtil.format(runDate,DateUtil.PATTERN_DATE).getTime();
         logger.info("dateLong=" + dateLong);
        //key 停留时长，set 项目id
        try {
            bw = new FileWriter(outputFile,true);
            //查询有效项目
            String queryUrl = HttpUtil.getParamFromConfigServer("query.engine.url") + "/api/query";
            int stayNew = queryStayNewUsers(runDate, projectId, queryUrl);
            int stayOld = queryStayOldUsers(runDate, projectId, queryUrl);

            //分别查询出来到访次数，到访时长，停留次数，停留时长
            EsQueryBean query = new EsQueryBean();
            query.setDbName("wifianalytics");
            query.setTypeName("log_es");
            query.setIndex("tenant_offset");
            query.setProjectId(projectId + "");
            query.setMinDuration(visitMinutes + "");
            query.setStartDate(dateLong + "");
            query.setEndDate(dateLong + "");
            query.setHasMin(true);
            //到访次数
            long visitTimes = esQueryService.queryCounter(query);
            //到访新客次数
            query.setNewFlag("1"); //新客
            long visitNewTime = esQueryService.queryCounter(query);
            //到访老客次数
            query.setNewFlag("0"); //老客
            long visitOldTime = esQueryService.queryCounter(query);
            query.setMinDuration(stayMinutes + "");
            //停留次数
            long stayTimes = esQueryService.queryCounter(query);

            EsQueryBean queryDuration = new EsQueryBean();
            queryDuration.setDbName("wifianalytics");
            queryDuration.setTypeName("log_es");
            queryDuration.setIndex("session_duration");
            queryDuration.setProjectId(projectId + "");
            queryDuration.setStartDate(dateLong + "");
            queryDuration.setEndDate(dateLong + "");
            queryDuration.setMinDuration(visitMinutes + "");
            queryDuration.setHasMin(true);
            //到访时长
            Double visitDuration = esQueryService.querySum(queryDuration);
            
            //到访新客时长
            queryDuration.setNewFlag("1"); //新客
            Double visitNewDuration = esQueryService.querySum(queryDuration);
            
            //到访新客时长
            queryDuration.setNewFlag("0"); //老客
            Double visitOldDuration = esQueryService.querySum(queryDuration);

            queryDuration.setMinDuration(stayMinutes + "");
            queryDuration.setNewFlag("1"); //新客
            //停留时长
            Double stayNewDuration = esQueryService.querySum(queryDuration);

            queryDuration.setNewFlag("0"); //停留老客
            Double stayOldDuration = esQueryService.querySum(queryDuration);

            bw.append(tenantId + "").append(Constant.SEPARATER) ; //写入到文件
            bw.append(projectId + "").append(Constant.SEPARATER) ; //写入到文件
            bw.append(runDate + "").append(Constant.SEPARATER) ;
            bw.append(stayNew + "").append(Constant.SEPARATER) ;
            bw.append(stayOld + "").append(Constant.SEPARATER) ;
            bw.append((stayOld + stayNew) + "").append(Constant.SEPARATER) ;
            bw.append(visitTimes + "").append(Constant.SEPARATER) ;
            bw.append(stayTimes + "").append(Constant.SEPARATER) ;
            bw.append(visitDuration.intValue() + "").append(Constant.SEPARATER) ;
            bw.append(stayNewDuration.intValue() + "").append(Constant.SEPARATER) ;
            bw.append(stayOldDuration.intValue() + "").append(Constant.SEPARATER) ;
            bw.append(visitNewDuration.intValue() + "").append(Constant.SEPARATER) ;
            bw.append(visitOldDuration.intValue() + "").append(Constant.SEPARATER) ;
            bw.append(visitNewTime + "").append(Constant.SEPARATER) ;
            bw.append(visitOldTime + "").append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK) ;
        }catch(Exception e){
            logger.error("写到文件失败：", e);
        }finally{
            FileUtil.close(bw);
        }
        return true;
    }

    public static  int queryStayOldUsers(String date,int projectId,String queryUrl){
        String script = "r030102=select * from bitmap.stay_old_user_day_cube where project_id="  + projectId + "   and date between '" + date + "' and '" + date + "';" +
                "r030102.subkey(0);";
        QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
        Integer result = QueryEngineResultUtil.getDefaultValue(qer);
        return result;
    }

    public static int queryStayNewUsers(String date,int projectId,String queryUrl){
        String script = "r030102=select * from bitmap.stay_new_user_day_cube where project_id="  + projectId + "   and date between '" + date + "' and '" + date + "';" +
                "r030102.subkey(0);";
        QueryEngineResult qer = QueryServiceUtils.invoke("post", queryUrl, script);
        Integer result = QueryEngineResultUtil.getDefaultValue(qer);
        return result;
    }
}
