package td.enterprise.collector.service;

import java.io.IOException;
import java.util.List;
import java.util.Properties;

import kafka.javaapi.producer.Producer;
import kafka.producer.KeyedMessage;
import lombok.extern.slf4j.Slf4j;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 主要用来发送消息到Kafka队列
 *
 */
@Slf4j
public class KafkaService {

    private KafkaClient         wifiKafkaClient;

    private boolean             isWifiKafkaUseable          = true;

    private static KafkaService _instance;

    private int                 KAFKA_CLIENT_CHECK_INTERVAL = 60;
    private int                 KAFKA_CLIENT_MAXERRORTIME   = 10;

    public static final String  SRC_TYPE_WIFI               = "wifi";

    private KafkaService() {
    }

    public static KafkaService getInstance(Properties props) {
        if (_instance == null) {
            _instance = new KafkaService();

            String brokers = props.getProperty("kafka.collector.wifi.brokers");
            String topic = props.getProperty("kafka.collector.wifi.topic");
            _instance.wifiKafkaClient = new KafkaClient(SRC_TYPE_WIFI, brokers, topic);

            _instance.KAFKA_CLIENT_CHECK_INTERVAL = Integer.valueOf(props.getProperty("kafka.client.check.interval"));
            _instance.KAFKA_CLIENT_MAXERRORTIME = Integer.valueOf(props.getProperty("kafka.client.maxerrortime"));

            _instance.checkStart();
        }
        return _instance;
    }

    /**
     * 检查Kafka Client是否正常
     */
    private void checkStart() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    try {
                        check();
                    } catch (Exception e) {

                    } finally {
                        try {
                            Thread.sleep(KAFKA_CLIENT_CHECK_INTERVAL * 1000L);
                        } catch (InterruptedException e) {
                            log.error("====== checkStart.Thread.sleep error.", e);
                        }
                    }
                }
            }
        }).start();
    }

    private void check() {
        if (!isWifiKafkaUseable) {
            try {
                this.wifiKafkaClient.send(null, null);
                isWifiKafkaUseable = true;
            } catch (IOException e) {

            }
        }

    }

    /**
     * @param srcType 预留字段,做数据来源区分,暂时只有wifi
     * @param data    数据
     * @param apMac   ap mac 地址
     */
    public void send(String srcType, byte[] data, String apMac) {
        if (data == null) {
            return;
        }
        KafkaClient kafkaClient;
        if (SRC_TYPE_WIFI.equalsIgnoreCase(srcType)) {
            if (!isWifiKafkaUseable) {
                throw new RuntimeException("WiFiKafka Unuseable.");
            }
            kafkaClient = wifiKafkaClient;
            boolean flag = doRealSend(kafkaClient, data, apMac);
            if (!flag) {
                isWifiKafkaUseable = false;
                throw new RuntimeException("Send data to Kafka (topic->" + kafkaClient.getTopic() + ")error.");
            }
        }
    }

    public void send(List<KeyedMessage<String, byte[]>> list) {
        if (list == null || list.size() == 0) {
            return;
        }
        KafkaClient kafkaClient;
        if (!isWifiKafkaUseable) {
            throw new RuntimeException("WiFiKafka Unuseable.");
        }
        kafkaClient = wifiKafkaClient;
        boolean flag = doRealSend(kafkaClient, list);
        if (!flag) {
            isWifiKafkaUseable = false;
            throw new RuntimeException("Send data to Kafka (topic->" + kafkaClient.getTopic() + ")error.");
        }
    }

    private boolean doRealSend(KafkaClient kafkaClient, List<KeyedMessage<String, byte[]>> list) {
        int c = 0;
        while (c < this.KAFKA_CLIENT_MAXERRORTIME) {
            c++;
            try {
                kafkaClient.send(list);
                return true;
            } catch (Exception e) {
                log.error("====== 发送失败:" + c, e);
            }
        }
        return false;
    }

    private boolean doRealSend(KafkaClient kafkaClient, byte[] ep, String deviceid) {
        int c = 0;
        while (c < this.KAFKA_CLIENT_MAXERRORTIME) {
            c++;
            try {
                kafkaClient.send(ep, deviceid);
                return true;
            } catch (Exception e) {
                log.error("====== 发送失败:" + c, e);
            }
        }
        return false;
    }

    public boolean isWifiKafkaUseable() {
        return isWifiKafkaUseable;
    }

    /**
     * Kfaka发送程序
     *
     * @author guoping.zhou@tendcloud.com
     */
    private static class KafkaClient {

        private static Logger            logger    = LoggerFactory.getLogger(KafkaClient.class);

        private String                   brokers;                                               // Kafka集群地址
        private String                   topic;                                                 // Kafka队列名
        private Producer<String, byte[]> producer;                                              // Kafka消息生产者
        private String                   type;                                                  // 备用字段,区分数据来源
        private boolean                  isUseable = true;

        KafkaClient(String type, String brokers, String topic) {
            this.type = type;
            this.brokers = brokers;
            this.topic = topic;

            Properties props = new Properties();
            props.put("metadata.broker.list", brokers);
            props.put("key.serializer.class", "kafka.serializer.StringEncoder");

            this.producer = new Producer<String, byte[]>(new kafka.producer.ProducerConfig(props));

            logger.info("====== Init KafkaClient success: brokers->{},topic->{}", brokers, topic);
        }

        void send(byte[] data, String apMac) throws IOException {
            if (data != null) {
                this.producer.send(new KeyedMessage<String, byte[]>(this.topic, apMac, data));
            } else {
                this.producer.send(new KeyedMessage<String, byte[]>(this.topic, data));
            }
        }

        void send(List<KeyedMessage<String, byte[]>> list) throws IOException {
            this.producer.send(list);
        }

        public String getBrokers() {
            return brokers;
        }

        String getTopic() {
            return topic;
        }

        public String getType() {
            return type;
        }

        public boolean isUseable() {
            return isUseable;
        }

        public void setUseable(boolean isUseable) {
            this.isUseable = isUseable;
        }
    }
}
