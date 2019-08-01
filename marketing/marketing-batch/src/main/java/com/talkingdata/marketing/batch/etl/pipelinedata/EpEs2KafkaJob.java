package com.talkingdata.marketing.batch.etl.pipelinedata;

import com.talkingdata.marketing.batch.config.ApplicationContextManager;
import com.talkingdata.marketing.batch.producer.EpEs2KafkaProducer;

/**
 * @author Created by tend on 2017/11/15.
 */
public class EpEs2KafkaJob {

    public static void main(String[] args) {
        ApplicationContextManager instance = ApplicationContextManager.getInstance();
        EpEs2KafkaProducer epEs2KafkaProducer = instance.getBean("epEs2KafkaProducer", EpEs2KafkaProducer.class);
        epEs2KafkaProducer.producer();
        instance.getApplicationContext().close();
    }

}
