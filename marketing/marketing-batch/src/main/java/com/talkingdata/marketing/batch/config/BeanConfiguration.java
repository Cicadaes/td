package com.talkingdata.marketing.batch.config;

import kafka.javaapi.producer.Producer;
import kafka.producer.ProducerConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

/**
 * 创建BEAN
 * @author hongsheng
 * @create 2017-11-02-下午5:30
 * @since JDK 1.8
 */
@Configuration
public class BeanConfiguration {

    @Bean
    public Producer producer(KafkaConfig config) {
        Properties props = new Properties();
        props.put("metadata.broker.list", config.getBrokers());
        props.put("request.required.acks", config.getAcks());
        props.put("request.timeout.ms", config.getRequestTimeoutMs());
        props.put("producer.type", config.getProducerType());
        props.put("serializer.class", config.getSerializerClass());
        props.put("partitioner.class", config.getPartitionerClass());
        props.put("compression.codec", config.getCompressionCodec());
        props.put("queue.buffering.max.ms", config.getQueueMaxMs());
        props.put("queue.buffering.max.messages", config.getQueueMaxMessages());
        props.put("batch.num.messages", config.getBatchNumMessages());
        return new Producer(new ProducerConfig(props));
    }
}
