package td.enterprise.wanalytics.processor.timer;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;

import td.enterprise.framework.plugin.changer.atomic.impl.SpringDaoChanger;
import td.enterprise.wanalytics.processor.cache.CacheFactory;

/**
 * <p>Description：同步探针到cache</p>
 * <p><b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.</b></p>
 * @author liyinglei
 * @version 1.0
 * @date 2017年12月4日下午3:50:49 
 * @since jdk1.7
 */
public class SensorCacheSync {

    public static Logger logger = LoggerFactory.getLogger(SensorCacheSync.class);

    private static final ScheduledExecutorService SUBMIT_SERVICE = Executors.newSingleThreadScheduledExecutor();

    private static int SENSOR_LOG_TTL = 10; //同步探针，默认1小时

    //提交探针缓存
    private static final Runnable SubmitThread = new Runnable() {
        @Override
        public void run() {
            try {
            	logger.info("----Start Update Sensor Cache----");
            	Cache allSensorCache = CacheFactory.getAllSensorCache();
                //查询有所数据库已有探针
                JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
                String query = "select distinct sensor_mac from TD_SENSOR where project_id is not null and status = 1";//所有探针
                List <Map <String, Object>> sensorMacs = jdbcTemplate.queryForList(query);
                logger.info("----Sensor Count is: " + sensorMacs.size() + "----");
                for (Map <String, Object> sensorMac : sensorMacs) {
//                    allSensorMacs.add(relatedAttribute.get("sensor_mac") + "");
                    //更新所有探针到cache缓存
                    Element sensorElement = new Element(sensorMac.get("sensor_mac") + "", "1");
                    allSensorCache.put(sensorElement);
                }
            } catch (Exception e) {
                logger.error("同步未部署探针失败", e);
            }
        }
    };

    static {
        SUBMIT_SERVICE.scheduleAtFixedRate(SubmitThread, 10, SENSOR_LOG_TTL, TimeUnit.HOURS);
        logger.info("----Sensor Mac Cache----初始化成功");
    }

}
