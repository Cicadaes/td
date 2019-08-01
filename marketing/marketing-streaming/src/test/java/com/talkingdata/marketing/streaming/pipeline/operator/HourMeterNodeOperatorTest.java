package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.ExpressionExecute;
import com.talkingdata.marketing.streaming.bitmap.MktBitmapImpl;
import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.pipeline.definition.node.HourMeterNodeDefinition;
import com.talkingdata.marketing.streaming.util.HbaseUtils;
import com.talkingdata.marketing.streaming.util.JsonUtil;
import com.tendcloud.tenddata.entity.*;
import com.tenddata.bitmap.Bitmap;
import org.apache.commons.io.FileUtils;
import org.apache.hadoop.hbase.*;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.*;
import java.util.*;
import java.util.zip.GZIPInputStream;

/**
 * HourMeterNodeOperator 测试类
 * Created by tend on 2017/10/10.
 */
public class HourMeterNodeOperatorTest {
    private HourMeterNodeOperator operator = new HourMeterNodeOperator();
    private HourMeterNodeDefinition nodeDef = new HourMeterNodeDefinition();
    private EventPackage eventPackage = new EventPackage();
    private PipelineDefinition definition = new PipelineDefinition();

    @Test
    public void processTimeTimerTest() throws NodeOperatorException {
        definition.setStartTime(new Date());
        // 1509441418613 2017-10-31 17:17:00
        System.out.println(System.currentTimeMillis());

        nodeDef.setTimeSchedulingExpression("5 : 0 : 0");
        eventPackage.additiveProfile.passBeforeNodeTime = 1609441418613L;
//        OperatorResult result = operator.processTimeTimer(definition, nodeDef, eventPackage);
//        System.out.println(result);
    }

    @Test
    public void processTargetTimerTest() throws NodeOperatorException {
        nodeDef.setStopTimeMillis(1509441418613L);
//        nodeDef.setStopTimeMillis(1609441418613L);
        nodeDef.setTimeSchedulingExpression("2017-10-14 15:40:00");
        nodeDef.setExpression("time >= '2017-10-14 15:40:00' && ( : 'app' : == : '王者荣耀' : && : 'event' : == : '1' : ) : && : ( : 'app' : == : '王者荣耀' : && : 'event' : == : '2' : )");

        AppProfile mAppProfile = new AppProfile();
        mAppProfile.mAppPackageName = "王者荣耀";

        List<TMessage> mTMessages = new ArrayList<>();
        TMessage tMessage = new TMessage();
        tMessage.session = new Session();
        List<AppEvent> appevents = new ArrayList<>();
        AppEvent appEvent1 = new AppEvent();
        appEvent1.id = "event1";
        appevents.add(appEvent1);

        AppEvent appEvent2 = new AppEvent();
        appEvent2.id = "event2";
        appevents.add(appEvent2);
        tMessage.session.appEvents = appevents;


        TMessage tMessage2 = new TMessage();
        tMessage2.session = new Session();
        List<AppEvent> appevents2 = new ArrayList<>();
        AppEvent appEvent3 = new AppEvent();
        appEvent3.id = "event3";
        appevents.add(appEvent3);

        AppEvent appEvent4 = new AppEvent();
        appEvent4.id = "event4";
        appevents.add(appEvent4);
        tMessage.session.appEvents = appevents;
        tMessage2.session.appEvents = appevents2;


        mTMessages.add(tMessage);
        mTMessages.add(tMessage2);

        eventPackage.mAppProfile = mAppProfile;
        eventPackage.mTMessages = mTMessages;
        eventPackage.additiveProfile.passBeforeNodeTime = System.currentTimeMillis();
//        OperatorResult result = operator.processTargetTimer(eventPackage, nodeDef);
//        System.out.println(result);
    }

    @Test
    public void processTargetTimerTest2() throws NodeOperatorException, IOException {
        String content = FileUtils.readFileToString(new File("C:\\Users\\tend\\Desktop\\营销闭环\\测试数据\\eventPackage02.txt"));
        EventPackage eventPackage = JsonUtil.toObject(content, EventPackage.class);
        String hourMeterString = "{\"type\":\"hourMeter\",\"id\":\"15137592172947594\",\"pipelineDefinitionId\":null,\"name\":\"计时器\",\"operatorCode\":null,\"x\":441,\"y\":148,\"width\":null,\"height\":null,\"description\":null,\"icon\":\"marketing/public/images/component-hourMeter.svg\",\"crowdIds\":[868],\"hourMeterType\":1,\"timeSchedulingExpression\":null,\"expression\":\"time : >= : '2017-12-28 03:00:00'\",\"stopTimeMillis\":1514401200000}";
        HourMeterNodeDefinition hourMeterNodeDefinition = JsonUtil.toObject(hourMeterString, HourMeterNodeDefinition.class);
        HourMeterNodeOperator hourMeterNodeOperator = new HourMeterNodeOperator();
//        OperatorResult result = hourMeterNodeOperator.processTargetTimer(eventPackage, hourMeterNodeDefinition);
//        System.out.println(result);
    }

    @Test
    public void testExpression() {
//        String ex = "( : '应用' : == : 'app1' : && : '事件' : == : 'event1' : ) : || : ( : '应用' : == : 'app2' : && : '事件' : == : 'event2' : )";
//        String[] split = ex.split("&&");
//
//        for (String s : split) {
//            if (s.contains("事件")) {
//                int i = s.indexOf(")");
//                String[] eventArr = s.substring(0, i).replaceAll(" : ", "").split("==");
//                System.out.println(s.substring(0, i).replaceAll(" : ", ""));
//                System.out.println("[1,2,3].constant(" + eventArr[1] + ")");
//                System.out.println(s);
//                ex = ex.replace(s.substring(0, i), " [1,2,3].constant(" + eventArr[1] + ")");
//            }
//        }
//
//        System.out.println(ex);
//        ExpressionExecute.executeForBooleanResult(ex, new HashMap<>(16));

        String timeEx = "now <= '2017-10-14 15:27:07'";
        Map<String, Object> hashMap = new HashMap<>(16);
        hashMap.put("now", "'2017-10-14 15:17:08'");
        boolean b = ExpressionExecute.executeForBooleanResult(timeEx, hashMap);
        System.out.println(b);
    }

    @Test
    public void testHbase() throws IOException, ClassNotFoundException {
//        String rowkey = StringUtils.rightPad("talking131_city_name_attribute_黄山市_METAACCOUNT20170109001", 128, " ");
//        System.out.println(rowkey + ":");
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:marketing-streaming-spring-beans.xml");
        HbaseUtils hbase = (HbaseUtils) applicationContext.getBean("hbaseUtils");
        String rowkey = "rowkey0001";
        byte[] byRowKey = hbase.getByRowKey("tag_bitmap", rowkey, "d", "bitmap");

//        MktBitmapImpl mktBitmap = new MktBitmapImpl();
        ByteArrayInputStream bais = new ByteArrayInputStream(byRowKey);
        GZIPInputStream gzipIn = new GZIPInputStream(bais);
        ObjectInputStream is = new ObjectInputStream(gzipIn);

        Bitmap bitmap = (Bitmap) is.readObject();

        MktBitmapImpl mktBitmap = new MktBitmapImpl();
        Iterator<Integer> offsetIterator = bitmap.offsetIterator();
        while (offsetIterator.hasNext()) {
            mktBitmap.set(offsetIterator.next());
        }

        System.out.println(mktBitmap.toArray().length);
        System.out.println(Arrays.toString(mktBitmap.toArray()));
        System.out.println(mktBitmap.contains(134362));
        System.out.println(mktBitmap.contains(13436111));


        System.out.println(bitmap.toArray().length);
        System.out.println(Arrays.toString(bitmap.toArray()));


//        ObjectInputStream is = new ObjectInputStream(bais);
//        Bitmap bitmap = (Bitmap) is.readObject();

    }

    @Test
    public void testHbaseObjectPut() throws IOException, ClassNotFoundException {
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:marketing-streaming-spring-beans.xml");
        HbaseUtils hbase = (HbaseUtils) applicationContext.getBean("hbaseUtils");
        Connection connection = hbase.getConnection();
        Table table = connection.getTable(TableName.valueOf("l_test"));

        Put put = new Put(Bytes.toBytes("td002"));

        Person person = new Person("aa", "bb");
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ObjectOutputStream dout = new ObjectOutputStream(baos);
        dout.writeObject(person);
        dout.flush();

        put.addColumn(Bytes.toBytes("colfamily"), Bytes.toBytes("col"), baos.toByteArray());

        table.put(put);

    }

    @Test
    public void testHbaseObjectGet() throws IOException, ClassNotFoundException {
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:marketing-streaming-spring-beans.xml");
        HbaseUtils hbase = (HbaseUtils) applicationContext.getBean("hbaseUtils");
        byte[] bytes = hbase.getByRowKey("l_test", "td002", "colfamily", "col");
        ByteArrayInputStream bais = new ByteArrayInputStream(bytes);
        ObjectInputStream is = new ObjectInputStream(bais);
        Person person = (Person) is.readObject();

        System.out.println(person.getName());
    }
}

class Person implements Serializable {
    private String name;
    private String fullName;

    Person(String name, String fullName) {
        this.name = name;
        this.fullName = fullName;
    }

    String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}