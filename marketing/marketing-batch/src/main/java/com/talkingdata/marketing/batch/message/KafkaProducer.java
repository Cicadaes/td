package com.talkingdata.marketing.batch.message;

import com.talkingdata.marketing.batch.config.KafkaConfig;
import kafka.javaapi.producer.Producer;
import kafka.producer.KeyedMessage;
import org.apache.commons.lang3.RandomUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Kafka Producer
 *
 * @author hongsheng
 * @create 2017-11-02-下午3:14
 * @since JDK 1.8
 */
@Component
public class KafkaProducer {

    @Autowired
    private KafkaConfig kafkaConfig;

    @Autowired
    private Producer<String, String> producer;

    /**
     * 生产
     */
    public void sendMessage(String message) {
        producer.send(new KeyedMessage<>(kafkaConfig.getTopic(), String.valueOf(RandomUtils.nextInt(1, 200)), message));
    }

    /**
     * 批量生成消息到kafka
     *
     * @param messages list的message集合
     */
    public void sendMessage(List<String> messages) {
        List<KeyedMessage<String, String>> keyedMessages = new ArrayList<>();
        for (String message : messages) {
            keyedMessages.add(new KeyedMessage<>(kafkaConfig.getTopic(), String.valueOf(RandomUtils.nextInt(1, 200)), message));
        }
        producer.send(keyedMessages);
    }

}