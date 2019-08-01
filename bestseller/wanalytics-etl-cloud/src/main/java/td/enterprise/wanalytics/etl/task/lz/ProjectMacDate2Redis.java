package td.enterprise.wanalytics.etl.task.lz;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;

import td.enterprise.wanalytics.etl.constant.Constant;
import td.enterprise.wanalytics.etl.util.RedisClient;

/**
 * 活跃客流保存到redis
 * @description 
 * @author sxk
 * @date 2017年11月26日
 */
@Slf4j
public class ProjectMacDate2Redis {
    //最多一万店 
    private static int MAX_SHOP_SIZE = 10000;

    private static int RUN_SUCCESS   = 0;
    private static int RUN_ERROR     = 1;

    public static void main(String[] args) {
        try {
            Options options = new Options();
            options.addOption("f", "f", true, "文件路径");
            options.addOption("d", "d", true, "日期");

            CommandLineParser parser = new DefaultParser();
            CommandLine line = parser.parse(options, args);
            String file = line.getOptionValue("f");
            String dateStr = line.getOptionValue("d");
            long begin = System.currentTimeMillis();
            execute(file, dateStr);
            long end = System.currentTimeMillis();
            log.info("----ProjectMacDate2Redis runTime :" + (end - begin) / 1000 + " seconds.");
            System.exit(RUN_SUCCESS);
        } catch (Exception e) {
            log.error("ProjectMacDate2Redis error:", e);
            System.exit(RUN_ERROR);
        }

    }

    public static void execute(String file, String dateStr) throws Exception {
        long begin = System.currentTimeMillis();
        Map<String, Map<String, String>> result = new HashMap<>(MAX_SHOP_SIZE);
        try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] array = line.split(",");
                if (array.length != 4) {
                    continue;
                }
                String redisKey = array[0] + "_" + array[1];
                if (result.containsKey(redisKey)) {
                    result.get(redisKey).put(array[2], array[3]);
                } else {
                    HashMap<String, String> macMap = new HashMap<>();
                    macMap.put(array[2], array[3]);
                    result.put(redisKey, macMap);
                }
            }
        } catch (Exception e) {
            log.error(String.format("readLineError file:%s", file), e);
        }
        long end = System.currentTimeMillis();
        log.info("----ProjectMacDate2Redis file2Map :" + (end - begin) + " millis.");
        for (Map.Entry<String, Map<String, String>> entry : result.entrySet()) {
            String redisKey = "projectmacdate_" + entry.getKey() + "_" + dateStr;
            RedisClient.putHashTable(redisKey, entry.getValue(), RedisClient.EXPIRE_SECONDS_ACTIVE_USER, Constant.DB_INDEX_ACTIVE_USER_CROWD);
        }
        end = System.currentTimeMillis();
        log.info("----ProjectMacDate2Redis map2redis :" + (end - begin) + " millis.");
    }
}
