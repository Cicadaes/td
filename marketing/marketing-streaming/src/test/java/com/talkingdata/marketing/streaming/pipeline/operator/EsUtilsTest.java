package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.model.MessageData;
import com.talkingdata.marketing.streaming.util.EsUtils;
import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author Created by tend on 2017/11/7.
 */
public class EsUtilsTest {

    @Test
    public void initEsClientTest() {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("marketing-streaming-spring-beans.xml");
        EsUtils esUtils = (EsUtils) applicationContext.getBean("esUtils");
        String index = "twitter";
        String type = "tweet";
        String id = "AV-QoRMMIVAIcuVEurif";
        System.out.println(esUtils.getById(index, type, id));
    }

    @Test
    public void indexEsClientTest() throws ParseException {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("marketing-streaming-spring-beans.xml");
        EsUtils esUtils = (EsUtils) applicationContext.getBean("esUtils");
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date parse = dateFormat.parse("2017-10-02 00:00:00");
        String index = "mkt-messagedata";
        String type = "messagedata";
        String id = "";
        MessageData data = new MessageData(341, 304, "1.0", "22222",
                "18232323223", 1,"2017-11-20 12:01:22");

        String source = "{" +
                "\"user\":\"kimchy\"," +
                "\"postDatemill\":" + parse.getTime() + "," +
                "\"message\":\"trying out Elasticsearch\"" +
                "}";
//        System.out.println(esUtils.index(index, type, id, source));
       // System.out.println(esUtils.index(index, type, id, JSONObject.toJSONString(data)));
    }

    public static void main(String[] args) throws IOException {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("marketing-streaming-spring-beans.xml");
        EsUtils esUtils = (EsUtils) applicationContext.getBean("esUtils");
        String content = FileUtils.readFileToString(new File("C:\\Users\\tend\\Desktop\\营销闭环\\测试数据\\eventPackage02.txt"));

        String index = "mkt-eventpackage";
        String type = "eventpackage";

        for (int i = 0; i < 2000; i++) {
            esUtils.bulk(index, type, content);
        }

    }


}
