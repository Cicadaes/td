package td.enterprise.collector.service;

import java.util.List;
import java.util.Properties;

import kafka.producer.KeyedMessage;
import td.enterprise.collector.config.Configuration;
import td.enterprise.collector.control.AsyncProcesser;
import td.enterprise.common.util.LogUtils;
import td.enterprise.constants.ThreadConstants;

public class CollectorService {

    private static CollectorService collectorService;

    private static KafkaService     kafkaService;

    private CollectorService() {
    }

    public static CollectorService getInstance() {
        if (collectorService == null) {
            synchronized (CollectorService.class) {
                if (collectorService == null) {
                    collectorService = new CollectorService();
                    // 初始化相关实例（以后建议使用Spring管理）
                    Properties props = Configuration.get();
                    kafkaService = KafkaService.getInstance(props);
                    AsyncProcesser.getInstance();
                }
            }
        }
        return collectorService;
    }

    /**
     * 发送数据到Kafka消息队列
     * @param srcType
     * @param ep
     */
    public void send(String srcType, byte[] ep, String deviceid) {
        long startTime = System.currentTimeMillis();
        kafkaService.send(srcType, ep, deviceid);
        long runTime = System.currentTimeMillis() - startTime;
        if (runTime > ThreadConstants.RUN_TIME_PRINTLOG) {
            LogUtils.log4Task.info("kafkaSend runtime :{} ms", runTime);
        }
    }

    public void send(List<KeyedMessage<String, byte[]>> list) {
        long startTime = System.currentTimeMillis();
        kafkaService.send(list);
        long runTime = System.currentTimeMillis() - startTime;
        if (runTime > ThreadConstants.RUN_TIME_PRINTLOG) {
            LogUtils.log4Task.info("kafkaSend runtime :{} ms", runTime);
        }
    }

    public KafkaService getKafkaService() {
        return kafkaService;
    }

    public void setKafkaService(KafkaService kafkaService) {
        this.kafkaService = kafkaService;
    }

}
