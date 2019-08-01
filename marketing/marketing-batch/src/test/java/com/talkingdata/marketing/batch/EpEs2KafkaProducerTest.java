package com.talkingdata.marketing.batch;

import com.talkingdata.marketing.batch.producer.EpEs2KafkaProducer;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author Created by tend on 2017/11/9.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({"classpath:config/marketing-batch-spring-config.xml"})
public class EpEs2KafkaProducerTest {

    @Autowired
    private EpEs2KafkaProducer epEs2KafkaProducer;

    @Test
    public void producerTest() {
        epEs2KafkaProducer.producer();


    }


}
