import junit.framework.TestCase;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import td.enterprise.wanalytics.etl.util.FileUtil;
import td.enterprise.wanalytics.etl.util.RedisClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 *
 */
@Slf4j
public class RedisTest  extends TestCase {

    public static void main(String [] args ) throws  Exception {
        long start = System.currentTimeMillis();
        //for(int i =0;i < 20;i ++){
            queryTest();
        //}
        long end = System.currentTimeMillis();
        log.info("----------Use time--------=" + (end -start) );
    }

    public static void makeRedisData() throws  Exception{
        List<String> sensorList = FileUtil.readFileAsList("C:\\Users\\Administrator\\Desktop\\sensors.txt");
        int i = 0;
        int total = sensorList.size();
        int size = 20;
        for(String sensor: sensorList){
            long start= System.currentTimeMillis();
            Map<String,String > map = new HashMap<String,String>() ;
            for(int j = 0;j < size;j ++){
                 String key = sensor + "_" + sensor + "_" + j;
                 String value = "1";
                 map.put(key,value);
            }
            RedisClient.put(map,86400,10);
            long end= System.currentTimeMillis();
            map.clear();
            map = null;
            log.info("同步到第" + (++i) + "个到redis 成功，用时:" + (end -start)/1000 + "秒,共计" + total + "个");
        }
    }

    public static void queryTest() throws Exception {
//          String keys = "94:b4:0f:ba:ef:60*";
          String keys = "SENSOR_a1:a2:a1:a2:a1:a2*";
          Set<String> set = RedisClient.keys(keys,0);
          log.info("==============set="  +  set);
    }

    @Test
    public  void testGet(){

    }
}
