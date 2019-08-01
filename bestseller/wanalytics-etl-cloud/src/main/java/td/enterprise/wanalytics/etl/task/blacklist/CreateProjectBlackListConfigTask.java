
package td.enterprise.wanalytics.etl.task.blacklist;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.PosixParser;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import td.enterprise.entity.Project;
import td.enterprise.service.ProjectService;
import td.enterprise.wanalytics.etl.bean.FilterMacConfig;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.ListUtils;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

/**
 * 把过滤项目黑名单相同规则的生成一天记录
 * 生成文件格式为：连续天数;出现次数;项目id,项目id
 *
 * @author junmin.li
 */
@Slf4j
public class CreateProjectBlackListConfigTask {

    static SqlSession sqlSession = null;

    public static void main(String[] args) {
        try {
            SqlSessionFactory sqlSessionFactory = MyBatisUtil.getSqlSessionFactory();

            sqlSession = sqlSessionFactory.openSession();

            long t0 = System.currentTimeMillis();
            Options options = new Options();
            options.addOption("outputFile", "outputFile", true, "输出文件");
            CommandLineParser parser = new PosixParser();
            CommandLine line = parser.parse(options, args);
            String outputFile = line.getOptionValue("outputFile");
            execute(outputFile);
            long t1 = System.currentTimeMillis();
            log.info("生成项目黑名单过滤规则用时：" + (t1 - t0) / 1000 + " 秒");
        } catch (Exception e) {
            log.error("生成项目黑名单过滤规则用时： ", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        } finally {
            sqlSession.commit();
            sqlSession.close();
        }
    }


    public static void execute(String outputFile) throws Exception {
        Project page = new Project();
        page.setStatus(1);
        List <Project> list = ProjectService.queryByList(sqlSession, page);
        HashMap <String, List <Integer>> configMap = new HashMap <>();
        for (Project p : list) {
            FilterMacConfig conf = ProjectFilterBlackMacTriggerTask.getProjectConfig(sqlSession, p.getId());
            String key = conf.getTotalDays() + "_" + conf.getOccurenceNumber();
            List <Integer> configList = configMap.get(key);
            if (null == configList || configList.isEmpty()) {
                configList = new ArrayList <Integer>();
            }
            configList.add(p.getId());
            configMap.put(key, configList);
        }

        log.info("合并后map大小:" + configMap.size());
        BufferedWriter bw = null;
        FileWriter fw = null;
        try {
            fw = new FileWriter(outputFile);
            bw = new BufferedWriter(fw);
            //生成配置信息
            //相同黑名单规则的放到一块
            Iterator <String> keys = configMap.keySet().iterator();
            while (keys.hasNext()) {
                String key = keys.next();
                String[] values = key.split("_");
                List <Integer> tempList = configMap.get(key);
                String ids = ListUtils.getIds(tempList);
                if (null != ids) {
                    bw.append(values[0]).append(Constant.SEMICOLON);
                    bw.append(values[1]).append(Constant.SEMICOLON);
                    bw.append(ids).append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
                }
            }
        } catch (Exception e) {
            log.error("写到文件失败：", e);
            throw new Exception("写入文件失败！", e);
        } finally {
            FileUtil.close(bw,fw);
        }
    }
}
