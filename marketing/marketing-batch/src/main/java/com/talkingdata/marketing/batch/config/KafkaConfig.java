package com.talkingdata.marketing.batch.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Kafka Config
 * @author hongsheng
 * @create 2017-11-02-下午5:02
 * @since JDK 1.8
 */
@Component
public class KafkaConfig {
    /**
     * broker服务器集群列表
     */
    @Value("${kafka.metadata.broker.list}")
    private String brokers;

    @Value("${kafka.request.required.acks}")
    private String acks;

    @Value("${kafka.request.timeout.ms}")
    private String requestTimeoutMs;

    @Value("${kafka.producer.type}")
    private String producerType;
    /**
     * 消息加密格式
     */
    @Value("${kafka.serializer.class}")
    private String serializerClass;

    @Value("${kafka.partitioner.class}")
    private String partitionerClass;

    @Value("${kafka.compression.codec}")
    private String compressionCodec;

    @Value("${kafka.queue.buffering.max.ms}")
    private String queueMaxMs;

    @Value("${kafka.queue.buffering.max.messages}")
    private String queueMaxMessages;

    @Value("${kafka.batch.num.messages}")
    private String batchNumMessages;

    @Value("${kafka.topic}")
    private String topic;

    public String getBrokers() {
        return brokers;
    }

    public String getAcks() {
        return acks;
    }

    public String getRequestTimeoutMs() {
        return requestTimeoutMs;
    }

    public String getProducerType() {
        return producerType;
    }

    public String getSerializerClass() {
        return serializerClass;
    }

    public String getPartitionerClass() {
        return partitionerClass;
    }

    public String getCompressionCodec() {
        return compressionCodec;
    }

    public String getQueueMaxMs() {
        return queueMaxMs;
    }

    public String getQueueMaxMessages() {
        return queueMaxMessages;
    }

    public String getBatchNumMessages() {
        return batchNumMessages;
    }

    public String getTopic() {
        return topic;
    }
}
