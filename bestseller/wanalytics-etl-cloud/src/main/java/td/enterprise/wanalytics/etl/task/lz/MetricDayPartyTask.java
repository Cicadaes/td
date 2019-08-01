package td.enterprise.wanalytics.etl.task.lz;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;

import td.enterprise.service.MetricDayPartyService;
import td.enterprise.service.MetricDayService;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

@Slf4j
public class MetricDayPartyTask {

    static SqlSession sqlSession = null;

    public static void main(String[] args) {

        SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();
        sqlSession = sqlSessionFactory.openSession();
        try {
            Options options = new Options();
            options.addOption("runDate", "runDate", true, "执行日期");
            CommandLineParser parser = new DefaultParser();
            CommandLine lines = parser.parse(options, args);
            String runDate = lines.getOptionValue("runDate");

            //          //test data
            //String runDate = "2017-11-08";

            execute(runDate);
        } catch (Exception e) {
            log.error("任务异常 ", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        } finally {
            sqlSession.commit();
            sqlSession.close();
        }
        System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
    }

    private static void execute(String runDate) throws Exception {

        try {

            MetricDayPartyService.deleteByRunDate(sqlSession, runDate);

            MetricDayPartyService.batchInsertMetricDayParty(sqlSession, runDate);

            // 批量update会员数和潜客数到TD_METRIC_DAY
            MetricDayService.batchUpdateByMemberAndPotential(sqlSession, runDate);

        } catch (Exception e) {
            log.error("执行一方数据日指标同步异常", e);
        }

    }

}
