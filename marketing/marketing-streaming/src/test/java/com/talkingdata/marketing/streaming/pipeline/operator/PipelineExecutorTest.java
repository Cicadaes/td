package com.talkingdata.marketing.streaming.pipeline.operator;

import com.alibaba.fastjson.JSON;
import com.talkingdata.marketing.streaming.cache.EhcacheService;
import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.model.PipelineStage;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.PipelineDiagram;
import com.talkingdata.marketing.streaming.pipeline.definition.node.*;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.executor.PipelineExecutor;
import com.talkingdata.marketing.streaming.pipeline.executor.PipelineNodeExecutor;
import com.talkingdata.marketing.streaming.pipeline.executor.PipelineStageExecutor;
import com.talkingdata.marketing.streaming.util.JsonUtil;
import com.talkingdata.marketing.streaming.util.RedisUtils;
import com.tendcloud.tenddata.entity.EventPackage;
import org.apache.commons.io.FileUtils;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * PipelineExecutorTest
 * Created by tend on 2017/10/17.
 */
public class PipelineExecutorTest {

    @Test
    public void executorTest() throws IOException, ParseException {
        System.setProperty("HADOOP_USER_NAME", "hadoop");
        String eventStr = FileUtils.readFileToString(new File("C:\\Users\\tend\\Desktop\\营销闭环\\测试数据\\eventPackage02.txt"));
        EventPackage eventPackage = JSON.parseObject(eventStr, EventPackage.class);
//        eventPackage.rectime = 1508464559878L;
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = format.parse("2017-10-28 10:00:00");
        eventPackage.rectime = date.getTime();
        eventPackage.additiveProfile.stageName = "";
        PipelineExecutor pipelineExecutor = new PipelineExecutor();
        pipelineExecutor.executor(eventPackage);

    }

    @Test
    public void genExecuteStageNodesTest() throws IOException, ParseException {
        EventPackage eventPackage = new EventPackage();
        eventPackage.additiveProfile.campaignId = 357;
        eventPackage.additiveProfile.pipelineDefinitionId = 348;
        eventPackage.additiveProfile.version = "1.0";
        eventPackage.additiveProfile.stageName = "stage_1";
//        eventPackage.additiveProfile.stageName = "";

        ArrayList<String> branchEdgeIds = new ArrayList<>();
//        branchEdgeIds.add("15119418970215184"); // A
        branchEdgeIds.add("15119418970211480"); // B
//        branchEdgeIds.add("15142563448120243"); // 定时器
//        branchEdgeIds.add("15142563448128955"); // 生成人群
        eventPackage.additiveProfile.lastBranchEdgeIds = null;
        eventPackage.additiveProfile.lastBranchEdgeIds = branchEdgeIds;
        ArrayList<String> processedNodeIds = new ArrayList<>();
        processedNodeIds.add("15137615062329440"); // 过滤器11
        processedNodeIds.add("15119420020630018"); // 触发器
        eventPackage.additiveProfile.lastProcessedNodeIds = null;
        eventPackage.additiveProfile.lastProcessedNodeIds = processedNodeIds;

        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:marketing-streaming-spring-beans.xml");
        PipelineStageExecutor stageExecutor = (PipelineStageExecutor) applicationContext.getBean("pipelineStageExecutor");
        EhcacheService ehcacheService = (EhcacheService) applicationContext.getBean("ehcacheService");
        PipelineDefinition pipelineDef = ehcacheService.findPipelineDefinitionCache(eventPackage.additiveProfile.campaignId,
                eventPackage.additiveProfile.pipelineDefinitionId,  eventPackage.additiveProfile.version);

        PipelineDiagram pipelineDiagram = JsonUtil.toObject(pipelineDef.getDiagram(), PipelineDiagram.class);
//        PipelineDiagram stageDiagram = stageExecutor.stageDiagram(eventPackage);

//        Set<AbstractNodeDefinition> nodeDefinitions = stageExecutor.genExecuteStageNodes(eventPackage, pipelineDiagram, stageDiagram);

        Set<AbstractNodeDefinition> nodeDefinitions = new HashSet<>();
        for (AbstractNodeDefinition nodeDefinition : nodeDefinitions) {
            if (nodeDefinition instanceof EntranceNodeDefinition) {
                System.out.println(nodeDefinition.getName() + " EntranceNodeDefinition");
            } else if (nodeDefinition instanceof SplitNodeDefinition) {
                System.out.println(nodeDefinition.getName() + " SplitNodeDefinition");
            } else if (nodeDefinition instanceof PushNodeDefinition) {
                System.out.println(nodeDefinition.getName() + " PushNodeDefinition");
            } else if (nodeDefinition instanceof ShortMessageNodeDefinition) {
                System.out.println(nodeDefinition.getName() + " ShortMessageNodeDefinition");
            } else if (nodeDefinition instanceof TriggerNodeDefinition) {
                System.out.println(nodeDefinition.getName() + " TriggerNodeDefinition");
            } else if (nodeDefinition instanceof HourMeterNodeDefinition) {
                System.out.println(nodeDefinition.getName() + " HourMeterNodeDefinition");
            } else if (nodeDefinition instanceof FilterNodeDefinition) {
                System.out.println(nodeDefinition.getName() + " FilterNodeDefinition");
            } else if (nodeDefinition instanceof GenerateCrowdNodeDefinition) {
                System.out.println(nodeDefinition.getName() + " GenerateCrowdNodeDefinition");
            }
        }
//        Assert.assertEquals("stage_2", eventPackage.additiveProfile.stageName);
    }

    @Test
    public void executeNodesTest() throws IOException, ParseException {
//        System.setProperty("HADOOP_USER_NAME", "hadoop");
        String eventStr = FileUtils.readFileToString(new File("C:\\Users\\tend\\Desktop\\营销闭环\\测试数据\\eventPackage02.txt"));
        EventPackage eventPackage = JSON.parseObject(eventStr, EventPackage.class);
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:marketing-streaming-spring-beans.xml");
        PipelineNodeExecutor nodeExecutor = (PipelineNodeExecutor) applicationContext.getBean("pipelineNodeExecutor");
        PipelineStageExecutor stageExecutor = (PipelineStageExecutor) applicationContext.getBean("pipelineStageExecutor");
        EhcacheService ehcacheService = (EhcacheService) applicationContext.getBean("ehcacheService");
        eventPackage.additiveProfile.stageName = "";
        PipelineDefinition pipelineDefinition = ehcacheService.findPipelineDefinitionCache(eventPackage.additiveProfile.campaignId, eventPackage.additiveProfile.pipelineDefinitionId, eventPackage.additiveProfile.version);
//        Set<AbstractNodeDefinition> nodeDefinitions = stageExecutor.genExecuteStageNodes(eventPackage);
//        nodeExecutor.executeNodes(pipelineDefinition, nodeDefinitions, eventPackage);
//        RedisUtils redisUtils = (RedisUtils) applicationContext.getBean("redisUtils");
//        System.out.println(redisUtils.getHash("user001", "time"));
//        System.out.println(redisUtils.getHash("user001", "times"));

    }

    @Test
    public void validateCrowdIsMatchTest() throws CrowdNotMatchException {

        EventPackage eventPackage = new EventPackage();
        eventPackage.additiveProfile.crowdId = 12;

        HashSet<Integer> crowdIds = new HashSet<>();
//        crowdIds.add(12);
        crowdIds.add(11);
        crowdIds.add(13);
        FilterNodeDefinition filterNodeDefinition = new FilterNodeDefinition();
        filterNodeDefinition.setCrowdIds(crowdIds);

        FilterNodeOperator filterNodeOperator = new FilterNodeOperator();
        filterNodeOperator.validateCrowdIsMatch(null, eventPackage, filterNodeDefinition);
    }

    @Test
    public void isSkipThisNodeTest2() throws CrowdNotMatchException {
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:marketing-streaming-spring-beans.xml");
        PipelineNodeExecutor nodeExecutor = (PipelineNodeExecutor) applicationContext.getBean("pipelineNodeExecutor");
        PipelineStageExecutor stageExecutor = (PipelineStageExecutor) applicationContext.getBean("pipelineStageExecutor");
        EventPackage eventPackage = new EventPackage();
        eventPackage.additiveProfile.campaignId = 357;
        eventPackage.additiveProfile.pipelineDefinitionId = 394;
        eventPackage.additiveProfile.version = "1.0";
        eventPackage.additiveProfile.stageName = "";

//        eventPackage.additiveProfile.pauseNodeId = "15137592172947594";

//        Set<AbstractNodeDefinition> nodes = stageExecutor.genExecuteStageNodes(eventPackage);

        HourMeterNodeDefinition hourMeterNodeDefinition = new HourMeterNodeDefinition();
        hourMeterNodeDefinition.setId("15137592172947594");

//        boolean skipThisNode = nodeExecutor.isSkipThisNode(nodes, eventPackage, hourMeterNodeDefinition);
//        System.out.println(skipThisNode);
    }

    @Test
    public void diagramTest() throws IOException {
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:marketing-streaming-spring-beans.xml");
        EhcacheService ehcacheService = (EhcacheService) applicationContext.getBean("ehcacheService");
        PipelineDefinition pipelineDef = ehcacheService.findPipelineDefinitionCache(357, 348, "1.0");
        PipelineDiagram pipelineDiagram = JsonUtil.toObject(pipelineDef.getDiagram(), PipelineDiagram.class);

        AbstractNodeDefinition targetNode = pipelineDiagram.findTargetNodeByEdgeDefinitionId("15119418970215184");
//        System.out.println(targetNode.getName());
        Set<AbstractNodeDefinition> linear = linear(pipelineDiagram, targetNode);

        for (AbstractNodeDefinition nodeDefinition : linear) {
            System.out.println(nodeDefinition.getName());
        }
    }

    private Set<AbstractNodeDefinition> linear(PipelineDiagram pipelineDiagram, AbstractNodeDefinition nodeDefinition) {
        Set<AbstractNodeDefinition> result = new LinkedHashSet<>();
        result.add(nodeDefinition);
        List<AbstractNodeDefinition> preNodeDefinition = pipelineDiagram.findNextNodeDefinition(nodeDefinition.getId());
        for (AbstractNodeDefinition each : preNodeDefinition) {
            result.addAll(linear(pipelineDiagram, each));
        }
//        result.add(nodeDefinition);
        return result;
    }

}
