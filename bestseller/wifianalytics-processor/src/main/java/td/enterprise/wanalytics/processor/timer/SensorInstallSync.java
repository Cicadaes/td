package td.enterprise.wanalytics.processor.timer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import td.enterprise.framework.plugin.changer.atomic.impl.SpringDaoChanger;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * 同步未部署探针
 */
public class SensorInstallSync {

    public static Logger logger = LoggerFactory.getLogger(SensorInstallSync.class);

    public static CopyOnWriteArraySet <String> SENSOR_SET = new CopyOnWriteArraySet <>();

    private static final ScheduledExecutorService SUBMIT_SERVICE = Executors.newSingleThreadScheduledExecutor();

    private static int SENSOR_LOG_TTL = 60; //同步探针，默认1小时

    //提交探针缓存
    private static final Runnable SubmitThread = new Runnable() {
        @Override
        public void run() {
            try {
                //查询有所数据库已有探针
                List <String> allSensorMacs = new ArrayList <>();//数据库中所有探针mac集合
                JdbcTemplate jdbcTemplate = SpringDaoChanger.jdbcTemplate;
                String query = "select distinct related_attribute from TD_INSTALL_INFO where related_type = 1 and status = 1";//已部署的探针
                List <Map <String, Object>> SensorMacs = jdbcTemplate.queryForList(query);
                for (Map <String, Object> relatedAttribute : SensorMacs) {
                    allSensorMacs.add(relatedAttribute.get("related_attribute") + "");
                }
                query = "select distinct sensor_mac from TD_SENSOR where (project_id is null and status = -1) or (project_id is not null and status = 1)";//已标志未录入记录的探针和已添加的探针
                List <Map <String, Object>> noTypeSensorMacs = jdbcTemplate.queryForList(query);
                for (Map <String, Object> relatedAttribute : noTypeSensorMacs) {
                    allSensorMacs.add(relatedAttribute.get("sensor_mac") + "");
                }

                //所有收数探针去掉数据库已有探针
                SENSOR_SET.removeAll(allSensorMacs);

                //将未录入探针加入数据库
                for (String s : SENSOR_SET) {
                    String insert = "replace into TD_SENSOR(sensor_mac, status) values ('" + s + "' , -1)";
                    logger.info("将未录入探针加入数据库" + insert);
                    jdbcTemplate.update(insert);
                }

                //清空set
                SENSOR_SET.clear();
            } catch (Exception e) {
                logger.error("同步未部署探针失败", e);
            }

        }
    };

    static {

        SUBMIT_SERVICE.scheduleAtFixedRate(SubmitThread, 10, SENSOR_LOG_TTL, TimeUnit.MINUTES);
        logger.info("----SensorInstallSync----初始化成功");
    }

    public static void addSensorMac(String sensorMac) {
        SENSOR_SET.add(sensorMac);
    }

}
