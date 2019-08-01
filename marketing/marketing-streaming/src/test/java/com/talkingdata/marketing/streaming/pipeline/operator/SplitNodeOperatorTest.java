package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.cache.EhcacheService;
import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.PipelineDiagram;
import com.talkingdata.marketing.streaming.pipeline.definition.node.Branch;
import com.talkingdata.marketing.streaming.pipeline.definition.node.EdgeDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.node.SplitNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.pipeline.executor.PipelineExecutor;
import com.talkingdata.marketing.streaming.util.JsonUtil;
import com.tendcloud.tenddata.entity.EventPackage;
import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.File;
import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

/**
 * Split Node Operator Test
 *
 * @author hongsheng
 * @create 2017-10-11-下午8:02
 * @since JDK 1.8
 */
public class SplitNodeOperatorTest {
    /**
     * 验证分流器算子
     * 执行pipelineExecutor.executor(eventPackage)，通过验证便输出链接下一个执行点的边对象数据
     *
     * @throws IOException
     */
    @Test
    public void executorTest() throws IOException {
        PipelineExecutor pipelineExecutor = new PipelineExecutor();
        pipelineExecutor.executor(getEventPackage());
    }

    private EventPackage getEventPackage() throws IOException {
        String data = FileUtils.readFileToString(new File(PipelineExecutorTest.class.getResource("/pipelineexecutor/EventPackage.txt").getPath()), "UTF-8");
        return JsonUtil.toObject(data, EventPackage.class);
    }

    @Test
    public void splitByPercentTest() {
        SplitNodeDefinition splitNodeDefinition = new SplitNodeDefinition();
        splitNodeDefinition.setCount(4);

        List<Branch> branches = new ArrayList<>();
        Branch branch1 = new Branch();
        branch1.setName("A");
        branch1.setPercent(20);


        Branch branch2 = new Branch();
        branch2.setName("B");
        branch2.setPercent(30);

        Branch branch3 = new Branch();
        branch3.setName("C");
        branch3.setPercent(30);

        Branch branch4 = new Branch();
        branch4.setName("D");
        branch4.setPercent(20);
        branches.add(branch1);
        branches.add(branch3);
        branches.add(branch4);
        branches.add(branch2);
        splitNodeDefinition.setBranchList(branches);
        SplitNodeOperator splitNodeOperator = new SplitNodeOperator();
        //需要修改splitByNumber()的修饰符
//        String result = splitNodeOperator.splitByPercent(splitNodeDefinition, 181);
//        System.out.println(result);
    }

    @Test
    public void splitByNumberTest() {
        SplitNodeDefinition splitNodeDefinition = new SplitNodeDefinition();
        splitNodeDefinition.setCount(4);

        List<Branch> branches = new ArrayList<>();
        Branch branch1 = new Branch();
        branch1.setName("A");
        branch1.setMin(2L);
        branch1.setMax(5L);

        Branch branch2 = new Branch();
        branch2.setName("B");
        branch2.setMin(4L);
        branch2.setMax(6L);

        Branch branch3 = new Branch();
        branch3.setName("C");
        branch3.setMin(3L);
        branch3.setMax(8L);

        Branch branch4 = new Branch();
        branch4.setName("D");
        branch4.setMin(4L);
        branch4.setMax(9L);
        branches.add(branch1);
        branches.add(branch3);
        branches.add(branch4);
        branches.add(branch2);
        splitNodeDefinition.setBranchList(branches);
        SplitNodeOperator splitNodeOperator = new SplitNodeOperator();
        //需要修改splitByNumber()的修饰符
//        String result = splitNodeOperator.splitByNumber(splitNodeDefinition, 34, null);
//        System.out.println(result);
    }

    @Test
    public void debugTest() throws ParseException, IOException, NodeOperatorException, CrowdNotMatchException {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("marketing-streaming-spring-beans.xml");
        EhcacheService ehcacheService = (EhcacheService) applicationContext.getBean("ehcacheService");
        PipelineDefinition pipelineDef = ehcacheService.findPipelineDefinitionCache(357, 411, "1.0");
        PipelineDiagram pipelineDiagram = JsonUtil.toObject(pipelineDef.getDiagram(), PipelineDiagram.class);
        SplitNodeDefinition splitNodeDef = (SplitNodeDefinition) pipelineDiagram.findNodeById("15149684110462442");
        SplitNodeOperator splitNodeOperator = (SplitNodeOperator) applicationContext.getBean("splitNodeOperator");
        EdgeDefinition edgeDefinitions = splitNodeOperator.debug(pipelineDef, splitNodeDef, null);
        System.out.println(edgeDefinitions.getName());
    }
}
