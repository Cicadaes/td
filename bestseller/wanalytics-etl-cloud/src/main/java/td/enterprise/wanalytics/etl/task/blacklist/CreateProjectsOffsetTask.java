package td.enterprise.wanalytics.etl.task.blacklist;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.log4j.Logger;
import td.enterprise.entity.Project;
import td.enterprise.service.ProjectService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.task.filterblackmac.FilterBlackMacTask;
import td.enterprise.wanalytics.etl.util.DateUtil;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.List;


/**
 * 根据项目ids 和 endDate 和 前面几天时间，
 * 生成租户id，项目id，date，offset文件信息
 * @author junmin.li
 */

public class CreateProjectsOffsetTask {

    private static final Logger logger = Logger.getLogger(CreateProjectsOffsetTask.class);
    static SqlSession sqlSession = null;

    public static void main(String[] args) {
        try{
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
            sqlSession = sqlSessionFactory.openSession();

            long t0 = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("projectIds", "projectIds", true, "项目id，逗号分割");
            options.addOption("endDate", "endDate", true, "查询结束日期");
            options.addOption("totalDays", "totalDays", true, "包括endDate，往前连续totalDays天");
            options.addOption("outputFile", "outputFile", true, "输出文件");
            CommandLineParser parser = new PosixParser();
            CommandLine line  = parser.parse(options, args);
            String endDate = line.getOptionValue("endDate");
            String projectIds = line.getOptionValue("projectIds");
            int totalDays    = Integer.parseInt(line.getOptionValue("totalDays") );
            String outputFile = line.getOptionValue("outputFile");

            execute(outputFile,projectIds,endDate,totalDays);
            long t1 = System.currentTimeMillis();
            logger.info("批量生成项目offset结束：" + (t1 - t0)/1000  + " 秒");
        }catch (Exception e) {
            logger.error("生成项目黑名单过滤规则用时： ", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }finally {
            sqlSession.commit();
            sqlSession.close();
        }
    }
    
    /**
     * 生成项目每天offset列表
     * @param outputFile
     * @param projectIds
     * @param endDate
     * @param totalDays
     * @throws Exception
     */
    public static void execute(String outputFile,String projectIds,String endDate,int totalDays) throws Exception{
        BufferedWriter bw = null;
        try {
            bw = new BufferedWriter(new FileWriter(outputFile));
            for(String projectId : projectIds.split(",")){
                Project p = ProjectService.selectByPrimaryKey(sqlSession, projectId);
                if(StringUtils.isEmpty(p.getTenantId())) {
                    logger.error("项目Id=" + projectId + " TenantId为空！忽略执行!");
                    continue;
                }
                for(int i=0;i<totalDays;i ++){
                   String date = DateUtil.getDateString(endDate, -i);
                   List<Integer> list = FilterBlackMacTask.queryOffsetList(p.getTenantId(),p.getId(),date);
                   if(null != list){
                       for(Integer t : list){
                           bw.append(p.getTenantId()).append("\t");
                           bw.append(projectId + "").append("\t");
                           bw.append(date + "").append("\t");
                           bw.append(t + "").append("\n");
                       }
                       bw.flush();
                   }
                }
            }
            bw.flush();
        }catch(Exception e){
            logger.error("生成项目offset失败", e);
        }finally{
            FileUtil.close(bw);
        }
    }

}
