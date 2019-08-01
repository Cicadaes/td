package td.enterprise.wanalytics.etl.task;

import org.apache.log4j.Logger;
import td.enterprise.wanalytics.etl.constant.WifipixTaskConstant;
import td.enterprise.wanalytics.etl.util.QueryUtils;
import td.enterprise.wanalytics.etl.util.RedisClient;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;

/**
 * 从redis同步每天用户mac到mysql中
 */
public class SensorAllMacSync {

    private static final Logger logger = Logger.getLogger(SensorAllMacSync.class);

    public static int ALL_MAC_DB_INDEX = 1; //全部MAC 默认redis 位置
    public static String ALL_SENSOR_PREFIX = "all_";
    public static String ALL_SENSOR_KEY = ALL_SENSOR_PREFIX + "mac_key";


    public static void main(String[] args) {

        try {
            long begin = System.currentTimeMillis();
            execute();
            long end = System.currentTimeMillis();
            logger.info("----SensorAllMacSync Task is over. Used Time :" + (end - begin) / 1000 + " seconds.");
        } catch (Exception e) {
            logger.error("从redis同步每天用户mac到mysql中：", e);
            System.exit(WifipixTaskConstant.SHELL_STATUS_EXCEPTION);
        }

        System.exit(WifipixTaskConstant.SHELL_STATUS_DEFAULT);
    }

    public static void execute() throws Exception {

        //获取所有key
        Set <String> keySet = RedisClient.getSet(ALL_SENSOR_KEY, ALL_MAC_DB_INDEX);

        //获取所有mac
        for (String key : keySet) {
            Set <String> macSet = RedisClient.getSet(key, ALL_MAC_DB_INDEX);
            if (macSet != null && macSet.size() > 0 && key != null && key.split("_").length >= 4) {
                String[] keyArr = key.split("_");
                String projectId = keyArr[1];
                String sensorId = keyArr[2];
                String date = keyArr[3];

                //同步结果到数据库
                String insertSql = "insert into wifianalytics_counter.offline_sensor_all_mac_day_counter (project_id, sensor_id, date, metric_value) values ('" + projectId + "'," + sensorId + ",'" + date + "'," + macSet.size() + ") ON DUPLICATE KEY UPDATE metric_value = VALUES(metric_value)";
                try {
                    QueryUtils.execute(insertSql, QueryUtils.COUNTER_DB);
                    logger.info("insertSql " + insertSql);
                } catch (Exception e) {
                    e.printStackTrace();
                }

                //删除非当天的数据
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String dateStr = sdf.format(new Date());
                if (!dateStr.equals(date)) {
                    //删除key
                    RedisClient.srem(ALL_SENSOR_KEY, key, ALL_MAC_DB_INDEX);

                    //删除mac
                    RedisClient.delete(key, ALL_MAC_DB_INDEX);
                    logger.info("remove key " + key);
                }
            }
        }
    }

}
