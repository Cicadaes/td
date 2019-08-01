package td.enterprise.wanalytics.etl.task;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.commons.lang.StringUtils;

import td.enterprise.wanalytics.etl.bean.WifiProcessorLog;
import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.FileUtil;

/**
 * 过滤出来项目session，房间session最大停留时间日志，减少导入到hive表空间和计算时间
 * @author junmin.li
 *
 */
@Slf4j
public class FilterSessionLogTask {

    private static Map<WifiProcessorLog, WifiProcessorLog> maxSessionMap = new LinkedHashMap<WifiProcessorLog, WifiProcessorLog>();

    public static void main(String[] args) {
        try {

            Options options = new Options();
            options.addOption("inputFile", "inputFile", true, "输入文件");
            options.addOption("outputFile", "outputFile", true, "输出文件");
            CommandLineParser parser = new DefaultParser();
            CommandLine line = parser.parse(options, args);
            String inputFile = line.getOptionValue("inputFile");
            String outputFile = line.getOptionValue("outputFile");
            long begin = System.currentTimeMillis();
            execute(inputFile);
            writeToFile(outputFile);
            long end = System.currentTimeMillis();
            log.info("siz of map = " + maxSessionMap.size());
            log.info("----FilterSessionLogTask Task is over. Used Time :" + (end - begin) / 1000 + " seconds.");
        } catch (Exception e) {
            log.error("", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }
    }

    public static void execute(String inputFile) {
        File file = new File(inputFile);
        if (!file.exists()) {
            log.error("inputFile=" + inputFile + "不存在,忽略执行");
            return;
        }

        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader(inputFile));
            String line = br.readLine();
            while (null != line) {
                String[] values = line.split(",");
                String projectSessionId = values[14];
                String projectDuration = values[15];
                int projectId = Integer.parseInt(values[8]);
                String mac = values[5];
                WifiProcessorLog key = new WifiProcessorLog();
                key.setSessionId(projectSessionId);
                key.setProjectId(projectId);
                key.setMac(mac);
                WifiProcessorLog value = maxSessionMap.get(key);
                if (null == value) {
                    value = new WifiProcessorLog();
                    value.setSessionId(projectSessionId);
                    value.setProjectId(projectId);
                    value.setMac(mac);
                    value.setLine(line);
                    Float proDuration = StringUtils.isNotBlank(projectDuration) ? Float.parseFloat(projectDuration) : 0;
                    value.setProjectDuration(proDuration.intValue());
                } else {
                    Float curProDuration = StringUtils.isNotBlank(projectDuration) ? Float.parseFloat(projectDuration) : 0;
                    if (curProDuration > value.getProjectDuration()) {
                        value.setLine(line);
                        value.setProjectDuration(curProDuration.intValue());
                    }
                }

                maxSessionMap.put(key, value);
                line = br.readLine();
            }
        } catch (Exception e) {
            log.info("FilterSessionLogTask failed!", e);
        } finally {
            FileUtil.close(br);
        }
    }

    public static void writeToFile(String outputFile) {
        BufferedWriter bw = null;
        FileWriter fw = null;
        try {
            fw = new FileWriter(outputFile);
            bw = new BufferedWriter(fw);
            Iterator<WifiProcessorLog> iter = maxSessionMap.keySet().iterator();
            int i = 0;
            while (iter.hasNext()) {
                bw.append(maxSessionMap.get(iter.next()).getLine());
                bw.append(Constant.BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK);
                i++;
                if (i % 1000 == 0) {
                    bw.flush();
                }
            }

            bw.flush();
        } catch (Exception e) {
            log.info("FilterSessionLogTask failed!", e);
        } finally {
            FileUtil.close(bw, fw);
        }
    }
}
