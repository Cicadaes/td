package com.talkingdata.marketing.batch.message;

import com.talkingdata.marketing.batch.config.ApplicationContextManager;
import org.junit.Test;

/**
 * KafkaProducer Test Class
 * @author hongsheng
 * @create 2017-11-02-下午3:29
 * @since JDK 1.8
 */
public class KafkaProducerTest {

    /**
     * 本地启动需要在hosts中配置kafka服务器
     * marketing DEV环境：172.23.7.125 zk01.mkt.td.com
     */
    @Test
    public void testSendMessage(){
        KafkaProducer kafkaProducer = ApplicationContextManager.getInstance().getBean("kafkaProducer", KafkaProducer.class);
        kafkaProducer.sendMessage("第二次测试呢");
    }
}
