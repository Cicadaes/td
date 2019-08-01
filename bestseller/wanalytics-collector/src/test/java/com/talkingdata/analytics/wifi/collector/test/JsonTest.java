package com.talkingdata.analytics.wifi.collector.test;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.talkingdata.analytics.wifi.collector.databean.WiFiDataEntity;
import com.talkingdata.analytics.wifi.collector.processor.impl.RequestProcessor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by Administrator on 2017/6/6.
 */
public class JsonTest {

    private static final Logger logger = LoggerFactory.getLogger(JsonTest.class);

    private static ObjectMapper mapper = new ObjectMapper();

    public static void main(String [] args ) throws Exception{
//        WiFiDataEntity entity = new WiFiDataEntity();
//        mapper.setSerializationInclusion(JsonInclude.Include.NON_DEFAULT );
//        String str = mapper.writeValueAsString(entity);
//        System.out.println(str);

//         String jsonString  = "{\"version\":null,\"devtype\":null,\"keytype\":null,\"tsreceive\":0,\"wifidata\":null}";
//         WiFiDataEntity entity =  mapper.readValue(jsonString,WiFiDataEntity.class);
//         System.out.println("entity=" + entity);

        logger.info("abc");

        System.out.println(logger.getClass());

    }
}
