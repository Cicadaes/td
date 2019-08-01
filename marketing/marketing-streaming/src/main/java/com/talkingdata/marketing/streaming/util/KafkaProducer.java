package com.talkingdata.marketing.streaming.util;

import kafka.javaapi.producer.Producer;
import kafka.producer.KeyedMessage;
import kafka.producer.ProducerConfig;
import org.apache.commons.lang3.RandomUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.util.Properties;

/**
 * @author Created by tend on 2018/2/2.
 */
//@Component
public class KafkaProducer {

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducer.class);

    @Value("${kafka.producer.metadata.broker.list}")
    private String brokerList;

    @Value("${kafka.producer.request.required.acks}")
    private String acks;

    @Value("${kafka.producer.request.timeout.ms}")
    private String requestTimeoutMs;

    @Value("${kafka.producer.producer.type}")
    private String producerType;

    @Value("${kafka.producer.serializer.class}")
    private String serializerClass;

    @Value("${kafka.producer.partitioner.class}")
    private String partitionerClass;

    @Value("${kafka.producer.compression.codec}")
    private String compressionCodec;

    @Value("${kafka.producer.queue.buffering.max.ms}")
    private String queueMaxMs;

    @Value("${kafka.producer.queue.buffering.max.messages}")
    private String queueMaxMessages;

    @Value("${kafka.producer.batch.num.messages}")
    private String batchNumMessages;

    private Producer<String, String> producer;

    /**
     * 初始化Kafka Producer 对象
     *
     * @return Producer
     */
    @PostConstruct
    public Producer initProducer() {
        if (producer == null) {
            synchronized (this) {
                Properties props = new Properties();
                props.put("metadata.broker.list", brokerList);
                props.put("request.required.acks", acks);
                props.put("request.timeout.ms", requestTimeoutMs);
                props.put("producer.type", producerType);
                props.put("serializer.class", serializerClass);
                props.put("partitioner.class", partitionerClass);
                props.put("compression.codec", compressionCodec);
                props.put("queue.buffering.max.ms", queueMaxMs);
                props.put("queue.buffering.max.messages", queueMaxMessages);
                props.put("batch.num.messages", batchNumMessages);
                ProducerConfig config = new ProducerConfig(props);
                producer = new Producer<>(config);
            }
        }
        return producer;
    }

    /**
     * producer发送消息到Kafka, 消息key为1-200随机数
     *
     * @param topic Kafka topic
     * @param message 消息
     */
    public void producer(String topic, String message) {
        KeyedMessage<String, String> keyedMessage = new KeyedMessage<>(topic, String.valueOf(RandomUtils.nextInt(1, 200)), message);
        producer.send(keyedMessage);
    }

    @PreDestroy
    public void close() {
        if (producer != null) {
            producer.close();
        }
    }

}
