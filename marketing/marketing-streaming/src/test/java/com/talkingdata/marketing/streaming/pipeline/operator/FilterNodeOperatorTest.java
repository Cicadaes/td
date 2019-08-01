package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.pipeline.definition.node.FilterNodeDefinition;
import com.tendcloud.tenddata.entity.EventPackage;
import org.apache.commons.lang.StringUtils;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.ArrayList;
import java.util.List;

/**
 * FilterNodeOperatorTest
 * Created by tend on 2017/10/13.
 */
public class FilterNodeOperatorTest {

    @Test
    public void executorTest() throws NodeOperatorException, CrowdNotMatchException {
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:marketing-streaming-spring-beans.xml");
        FilterNodeOperator filterNodeOperator = (FilterNodeOperator) applicationContext.getBean("filterNodeOperator");
        FilterNodeDefinition filterNodeDefinition = new FilterNodeDefinition();
        List<String> rowKeyList = new ArrayList<>();
        String rowkey = StringUtils.rightPad("talking131_city_name_attribute_黄山市_METAACCOUNT20170109001", 128, " ");
        rowKeyList.add(rowkey);
        filterNodeDefinition.setTagRowKeyList(rowKeyList);
        filterNodeDefinition.setName("过滤器");

        EventPackage eventPackage = new EventPackage();
        eventPackage.additiveProfile.offset = 134362;

        Object executor = filterNodeOperator.executor(new PipelineDefinition(), filterNodeDefinition, eventPackage);
        System.out.println(executor);
        Assert.assertEquals(false, executor);
    }

}
