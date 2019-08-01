package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.pipeline.definition.node.GenerateCrowdNodeDefinition;
import com.tendcloud.tenddata.entity.EventPackage;
import org.junit.Assert;
import org.junit.Test;

import java.text.ParseException;
import java.text.SimpleDateFormat;

/**
 * GenerateCrowdNodeOperatorTest
 * Created by tend on 2017/10/13.
 */
public class GenerateCrowdNodeOperatorTest {

    @Test
    public void executorTest() throws NodeOperatorException, ParseException, CrowdNotMatchException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        GenerateCrowdNodeDefinition generateCrowdNodeDef = new GenerateCrowdNodeDefinition();
        generateCrowdNodeDef.setAcquisitionStartTime(format.parse("2017-10-12 10:39:00").getTime());
        generateCrowdNodeDef.setAcquisitionEndTime(format.parse("2017-10-13 10:40:00").getTime());

        EventPackage eventPackage = new EventPackage();
        eventPackage.rectime = format.parse("2017-10-13 10:39:00").getTime();

        GenerateCrowdNodeOperator generateCrowdNodeOperator = new GenerateCrowdNodeOperator();
        Object executor = generateCrowdNodeOperator.executor(null, generateCrowdNodeDef, eventPackage);

        Assert.assertEquals(eventPackage, executor);

    }

}
