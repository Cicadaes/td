package td.enterprise.wanalytics.processor.timer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import td.enterprise.wanalytics.common.Constants;
import td.enterprise.wanalytics.processor.utils.RedisClient;
import td.enterprise.wanalytics.processor.utils.RssiCheckUtils;

import java.util.HashMap;
import java.util.Set;
import java.util.concurrent.*;

/**
 * 读取配置统一类，
 * 使用定时器进行调用
 */
public class ReadRedisConfig {

  public static Logger logger = LoggerFactory.getLogger(ReadRedisConfig.class);

  public static CopyOnWriteArraySet<String> SENSOR_SET = new CopyOnWriteArraySet<> ();

  private static final ScheduledExecutorService READ_REDIS_SERVICE = Executors.newSingleThreadScheduledExecutor();

  private static final ScheduledExecutorService SUBMIT_SERVICE = Executors.newSingleThreadScheduledExecutor();

  private static  int SENSOR_LOG_TTL = 60; //探针日志，在redis中，默认60秒

  //提交日志队列
  private static ConcurrentLinkedQueue<String> SENSOR_LOG_QUEUE = new ConcurrentLinkedQueue<>();

  private static final Runnable ReadRedisThread  = new Runnable() {
    @Override
    public void run() {
       Set<String> apsensorSet = RedisClient.keys(Constants.MONITOR_SENSOR_KEYS + "*", Constants.MONITOR_SENSOR_DB_INDEX);
       if(null != apsensorSet){
           for(String sensor : apsensorSet ){
               sensor = sensor.split("_")[2];
               SENSOR_SET.add(sensor);
           }
       }
       //logger.info("=================================读取探针日志：" + SENSOR_SET);
    }
  };


  //提交日志缓存
  private static final Runnable SubmitThread  = new Runnable() {
    @Override
    public void run() {
      try{
          HashMap<String,String> map = new HashMap<>();
            if(!SENSOR_LOG_QUEUE.isEmpty()){
              while(!SENSOR_LOG_QUEUE.isEmpty()){
                 map.put(SENSOR_LOG_QUEUE.poll(),"1");
              }
              RedisClient.put(map,SENSOR_LOG_TTL,Constants.MONITOR_SENSOR_DB_INDEX);
            }
        //logger.info("=================================同步到redis中成功:" + map);
      }catch (Exception e){
           logger.error("监控探针日志，同步到Redis失败",e);
      }

    }
  };

  static {
       READ_REDIS_SERVICE.scheduleAtFixedRate(ReadRedisThread,10,1, TimeUnit.SECONDS);

       SENSOR_LOG_TTL = Integer.parseInt(RedisClient.paramsMap.get(Constants.SENSOR_LOG_TTL));

       int submitSensorLogTime = Integer.parseInt(RedisClient.paramsMap.get(Constants.SUBMIT_SENSOR_LOG_TIME));

       SUBMIT_SERVICE.scheduleAtFixedRate(SubmitThread,10,submitSensorLogTime, TimeUnit.SECONDS);

       logger.info("==========提交到redis 时间间隔是：" + submitSensorLogTime + "秒");
       logger.info("==========探针日志在Redis中生存时间是：" + SENSOR_LOG_TTL + "秒");
       logger.info("----ReadRedisConfig----初始化成功");
  }


  public static void addSensorLog(String sensorMac,String userMac,String rssi){
    Integer maxRssi = RssiCheckUtils.getMaxRssi(rssi);
    SENSOR_LOG_QUEUE.add(Constants.MONITOR_SENSOR_PREFIX + sensorMac + "_" + userMac + "_" + maxRssi);
  }

}
