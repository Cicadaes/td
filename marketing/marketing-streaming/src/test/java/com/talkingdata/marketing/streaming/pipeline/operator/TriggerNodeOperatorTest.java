package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.cache.EhcacheService;
import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.PipelineDiagram;
import com.talkingdata.marketing.streaming.pipeline.definition.node.EdgeDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.pipeline.definition.node.TriggerNodeDefinition;
import com.talkingdata.marketing.streaming.util.JsonUtil;
import com.tendcloud.tenddata.entity.AppEvent;
import com.tendcloud.tenddata.entity.EventPackage;
import com.tendcloud.tenddata.entity.Session;
import com.tendcloud.tenddata.entity.TMessage;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * TriggerNodeOperatorTest
 * Created by tend on 2017/9/29.
 */
public class TriggerNodeOperatorTest {

    private TriggerNodeOperator triggerNodeOperator = new TriggerNodeOperator();
    private TriggerNodeDefinition nodeDef = new TriggerNodeDefinition();
    private EventPackage eventPackage = new EventPackage();

    // 增加 startTime 和 endTime 的校验
    // 增加对 监测类型的校验
    // 增加对 表达式格式的校验
    @Test
    public void processMoniterTimeTest() throws ParseException, NodeOperatorException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        eventPackage.rectime = format.parse("2017-09-29 10:00:00").getTime();
        nodeDef.setMonitorType(1);
        // 增加 startTime 和 endTime 的校验
        nodeDef.setStartTime(format.parse("2017-09-29 10:00:00").getTime());
        nodeDef.setEndTime(format.parse("2017-09-29 11:00:00").getTime());
//        OperatorResult result1 = triggerNodeOperator.processMoniterTime(nodeDef, eventPackage);
//        System.out.println(result1);

        eventPackage.additiveProfile.passBeforeNodeTime = format.parse("2017-09-29 9:00:00").getTime();
        nodeDef.setMonitorType(2);
        nodeDef.setLessThanHour(2);
//        OperatorResult result = triggerNodeOperator.processMoniterTime(nodeDef, eventPackage);
//        System.out.println(result);
    }

    @Test
    public void eventBranchTest() throws ParseException {
        List<AppEvent> appEvents = new ArrayList<>();
        AppEvent appEvent = new AppEvent();
        appEvent.id = "2";
        appEvents.add(appEvent);

        List<TMessage> mTMessages = new ArrayList<>();
        TMessage tMessage = new TMessage();
        tMessage.session = new Session();
        tMessage.session.appEvents = appEvents;
        mTMessages.add(tMessage);
        eventPackage.mTMessages = mTMessages;

        List<String> branchs = new ArrayList<>();
        List<String> mainExpression = new ArrayList<>();
        mainExpression.add("1 : == : 分支1");
        mainExpression.add("2 : == : 分支2");
        mainExpression.add("分支3");
//        triggerNodeOperator.eventBranch(eventPackage, branchs, mainExpression, 1);

//        mainExpression.add("2 : == : 分支1");
//        mainExpression.add("1 : == : 分支2");
//        mainExpression.add("2 : == : 分支3");
//        triggerNodeOperator.eventBranch(eventPackage, branchs, mainExpression, 2);
        for (String branch : branchs) {
            System.out.println(branch);
        }
    }

    @Test
    public void targetBranchTest() throws ParseException {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("marketing-streaming-spring-beans.xml");
//        triggerNodeOperator.pipelineUtil = (PipelineUtil) applicationContext.getBean("pipelineUtil");
        List<String> branchs = new ArrayList<>();
        PipelineDefinition definition = new PipelineDefinition();
        definition.setCampaignId(205);
        List<String> mainExpression = new ArrayList<>();
//        mainExpression.add("kaihushu : > : 1000 : && kaihushu : < : 20001 : == : 分支1");
//        mainExpression.add("kaihushu : < : 30000 : == : 分支2");
//        mainExpression.add("分支3");
//        triggerNodeOperator.targetBranch(definition, branchs, mainExpression, 1);

        mainExpression.add("kaihushu : > : 1000 : && kaihushu : < : 20001 : == : 分支1");
        mainExpression.add("kaihushu : < : 30000 : == : 分支2");
        mainExpression.add("kaihushu : < : 3 : == : 分支3");
//        triggerNodeOperator.targetBranch(definition, branchs, mainExpression, 2);
        for (String branch : branchs) {
            System.out.println(branch);
        }
    }

    @Test
    public void processMainExpressionTest() throws ParseException {
    }

    @Test
    public void debugTest() throws ParseException, IOException, NodeOperatorException, CrowdNotMatchException {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("marketing-streaming-spring-beans.xml");
        EhcacheService ehcacheService = (EhcacheService) applicationContext.getBean("ehcacheService");
        PipelineDefinition pipelineDef = ehcacheService.findPipelineDefinitionCache(357, 411, "1.0");
        PipelineDiagram pipelineDiagram = JsonUtil.toObject(pipelineDef.getDiagram(), PipelineDiagram.class);
        TriggerNodeDefinition triggerNodeDef = (TriggerNodeDefinition) pipelineDiagram.findNodeById("15149684252458255");
        TriggerNodeOperator triggerNodeOperator = (TriggerNodeOperator) applicationContext.getBean("triggerNodeOperator");
        List<EdgeDefinition> edgeDefinitions = triggerNodeOperator.debug(pipelineDef, triggerNodeDef, null);
        for (EdgeDefinition edgeDefinition : edgeDefinitions) {
            System.out.println(edgeDefinition.getName());
        }
    }

    @Test
    public void processAdditionExpressionTest() throws ParseException {
//        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("marketing-streaming-spring-beans.xml");
//        triggerNodeOperator.pipelineUtil = (PipelineUtil) applicationContext.getBean("pipelineUtil");
//        PipelineDefinition definition = new PipelineDefinition();
//        definition.setCampaignId(205);
//        List<String> additionExpression = new ArrayList<>();
//        additionExpression.add("kaihushu : > : 1000 : && kaihushu : < : 2000");
//        nodeDef.setAdditionExpression(additionExpression);
//        boolean result = triggerNodeOperator.processAdditionExpression(definition, nodeDef);
//        System.out.println(result);
    }

    @Test
    public void genBranchMapTest() {
//        TriggerNodeDefinition triggerNodeDefinition = new TriggerNodeDefinition();
//        List<String> expression = new ArrayList<>();
//        expression.add("指标 : < : 123 : = : 分支1");
//        expression.add("指标 : == : 124 : && 指标 : <= : 156 : = : 分支2");
//        expression.add("指标 : >= : 178 : = : 分支3");
//        expression.add("分支4");
//        triggerNodeDefinition.setMainExpression(expression);
//        triggerNodeDefinition.setSameUserTarget(1);

//        Map<String, Integer> branchMap = triggerNodeOperator.genBranchMap(triggerNodeDefinition);
//        for (Map.Entry<String, Integer> entry : branchMap.entrySet()) {
//            System.out.println(entry.getKey() + ", " + entry.getValue());
//        }
    }

    @Test
    public void processSingleTargetRuleTest() {
//        TriggerNodeDefinition triggerNodeDefinition = new TriggerNodeDefinition();
//        List<String> expression = new ArrayList<>();
//        expression.add("指标 : < : 123 : = : 分支1");
//        expression.add("指标 : == : 124 : && 指标 : <= : 156 : = : 分支2");
//        expression.add("指标 : >= : 178 : = : 分支3");
//        expression.add("分支4");
//        triggerNodeDefinition.setMainExpression(expression);
////        triggerNodeDefinition.setSameUserTarget(1);
//        triggerNodeDefinition.setSameUserTarget(0);
//
//        eventPackage.mDeviceId = "mDeviceId000001";
//
//        ArrayList<String> branchs = new ArrayList<>();
//        branchs.add("分支2");
//        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("marketing-streaming-spring-beans.xml");
//        triggerNodeOperator.redisUtils = (RedisUtils) applicationContext.getBean("redisUtils");

//        Boolean targetRule = triggerNodeOperator.processSingleTargetRule(triggerNodeDefinition, eventPackage, branchs, "triggerNodeTest001");
//        Boolean targetRule = triggerNodeOperator.processSingleTargetRule(triggerNodeDefinition, eventPackage, branchs, "triggerNodeTest002");
//        System.out.println(targetRule);
    }

    @Test
    public void processDaysAndTimesRuleTest() throws ParseException {
//        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("marketing-streaming-spring-beans.xml");
//        triggerNodeOperator.redisUtils = (RedisUtils) applicationContext.getBean("redisUtils");
//        TriggerNodeDefinition triggerNodeDefinition = new TriggerNodeDefinition();
//        triggerNodeDefinition.setSameUserLessThanDays(1);
//        triggerNodeDefinition.setSameUserLessThanTimes(2);
//
//        boolean timesRule = triggerNodeOperator.processDaysAndTimesRule(triggerNodeDefinition, "triggerNodeTest003");
//        System.out.println(timesRule);
    }


}
