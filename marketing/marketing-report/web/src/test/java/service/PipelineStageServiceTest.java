package service;

import com.talkingdata.marketing.Application;
import com.talkingdata.marketing.core.entity.campaign.PipelineStage;
import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.PipelineDiagram;
import com.talkingdata.marketing.core.entity.campaign.definition.node.*;
import com.talkingdata.marketing.core.service.admin.FunnelStepConditionDefinitionService;
import com.talkingdata.marketing.core.service.campaign.PipelineStageService;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import springfox.documentation.spring.web.json.Json;

import java.io.IOException;
import java.util.*;

/**
 *
 * PipelineStageService 测试类
 * @author hongsheng
 * @create 2017-09-20-下午3:21
 * @since JDK 1.8
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = Application.class)
@WebAppConfiguration
public class PipelineStageServiceTest {

    private static final Logger logger = LoggerFactory.getLogger(PipelineStageServiceTest.class);

    @Autowired
    private PipelineStageService pipelineStageService;
    @Autowired
    private FunnelStepConditionDefinitionService funnelStepConditionDefinitionService;

    @Test
    public void deleteByCampaignIdAndPipelineIdAndVersionTest() throws Exception {
        pipelineStageService.deleteByCampaignIdAndPipelineIdAndVersion(115, 2312, "1.0", "123");
    }
    @Test
    public void saveTest() throws Exception {
        List<PipelineStage> pipelineStages = new ArrayList<>();
        PipelineStage stage1 = new PipelineStage();
        stage1.setCampaignId(1001);
        stage1.setPipelineDefinitionId(1021);
        stage1.setVersion("20170920009");
        stage1.setStageName("Stage" + 1);
        stage1.setDiagram("diagram1");
        stage1.setTenantId("talking131");
        stage1.setCreateTime(new Date());
        stage1.setUpdateTime(new Date());

        PipelineStage stage2 = new PipelineStage();
        stage2.setCampaignId(1002);
        stage2.setPipelineDefinitionId(1022);
        stage2.setVersion("20170920010");
        stage2.setStageName("Stage" + 2);
        stage2.setDiagram("diagram2");
        stage2.setTenantId("talking131");
        stage2.setCreateTime(new Date());
        stage2.setUpdateTime(new Date());

        pipelineStages.add(stage1);
        pipelineStages.add(stage2);

        pipelineStageService.save(pipelineStages);
    }

    @Test
    public void generateStageTest() throws Exception {
        PipelineDiagram pipelineDiagram = new PipelineDiagram();
        pipelineDiagram.setPipelineId(2312);
        pipelineDiagram.setCampaignId(115);
        pipelineDiagram.setName("test");
        pipelineDiagram.setVersion("2017009");
        pipelineDiagram.setStartTime(new Date());
        pipelineDiagram.setEndTime(new Date());

        List<AbstractNodeDefinition> nodeDefinitionList = new ArrayList<>();
        //入口
        EntranceNodeDefinition entranceNode = new EntranceNodeDefinition();
        entranceNode.setId("2017001");
        entranceNode.setName("入口");
        //分流器
        SplitNodeDefinition splitNode = new SplitNodeDefinition();
        splitNode.setId("2017002");
        splitNode.setName("分流器");
        //push
        PushNodeDefinition pushNode = new PushNodeDefinition();
        pushNode.setId("2017003");
        pushNode.setName("push");
        //短信
        ShortMessageNodeDefinition shortMessageNode = new ShortMessageNodeDefinition();
        shortMessageNode.setId("2017004");
        shortMessageNode.setName("短信");
        //触发器
        TriggerNodeDefinition triggerNode = new TriggerNodeDefinition();
        triggerNode.setId("2017005");
        triggerNode.setName("触发器");
        //计时器
        HourMeterNodeDefinition hourMeterNode = new HourMeterNodeDefinition();
        hourMeterNode.setId("2017006");
        hourMeterNode.setName("计时器");
        //人群生成
        GenerateCrowdNodeDefinition generateCrowdNode = new GenerateCrowdNodeDefinition();
        generateCrowdNode.setId("2017007");
        generateCrowdNode.setName("人群生成");
        //过滤器
        FilterNodeDefinition filterNode = new FilterNodeDefinition();
        filterNode.setId("2017008");
        filterNode.setName("过滤器");
        //END
        EndNodeDefinition endNode = new EndNodeDefinition();
        endNode.setId("2017009");
        endNode.setName("END");

        nodeDefinitionList.add(entranceNode);
        nodeDefinitionList.add(splitNode);
        nodeDefinitionList.add(pushNode);
        nodeDefinitionList.add(shortMessageNode);
        nodeDefinitionList.add(triggerNode);
        nodeDefinitionList.add(hourMeterNode);
        nodeDefinitionList.add(generateCrowdNode);
        nodeDefinitionList.add(filterNode);
        nodeDefinitionList.add(endNode);

        List<EdgeDefinition> edgeDefinitionList = new ArrayList<>();
        EdgeDefinition edge1 = new EdgeDefinition();
        edge1.setId("E2001");
        edge1.setSourceNodeId("2017001");
        edge1.setTargetNodeId("2017002");

        EdgeDefinition edge2 = new EdgeDefinition();
        edge2.setId("E2002");
        edge2.setSourceNodeId("2017002");
        edge2.setTargetNodeId("2017003");

        EdgeDefinition edge3 = new EdgeDefinition();
        edge3.setId("E2003");
        edge3.setSourceNodeId("2017002");
        edge3.setTargetNodeId("2017004");

        EdgeDefinition edge4 = new EdgeDefinition();
        edge4.setId("E2004");
        edge4.setSourceNodeId("2017003");
        edge4.setTargetNodeId("2017005");

        EdgeDefinition edge5 = new EdgeDefinition();
        edge5.setId("E2005");
        edge5.setSourceNodeId("2017004");
        edge5.setTargetNodeId("2017005");

        EdgeDefinition edge6 = new EdgeDefinition();
        edge6.setId("E2006");
        edge6.setSourceNodeId("2017005");
        edge6.setTargetNodeId("2017006");

        EdgeDefinition edge7 = new EdgeDefinition();
        edge7.setId("E2007");
        edge7.setSourceNodeId("2017005");
        edge7.setTargetNodeId("2017007");

        EdgeDefinition edge8 = new EdgeDefinition();
        edge8.setId("E2008");
        edge8.setSourceNodeId("2017006");
        edge8.setTargetNodeId("2017008");

        EdgeDefinition edge9 = new EdgeDefinition();
        edge9.setId("E2009");
        edge9.setSourceNodeId("2017008");
        edge9.setTargetNodeId("2017009");

        EdgeDefinition edge10 = new EdgeDefinition();
        edge10.setId("E20010");
        edge10.setSourceNodeId("2017007");
        edge10.setTargetNodeId("2017009");

        edgeDefinitionList.add(edge1);
        edgeDefinitionList.add(edge2);
        edgeDefinitionList.add(edge3);
        edgeDefinitionList.add(edge4);
        edgeDefinitionList.add(edge5);
        edgeDefinitionList.add(edge6);
        edgeDefinitionList.add(edge7);
        edgeDefinitionList.add(edge8);
        edgeDefinitionList.add(edge9);
        edgeDefinitionList.add(edge10);

        pipelineDiagram.setNodeDefinitionList(nodeDefinitionList);
        pipelineDiagram.setEdgeDefinitionList(edgeDefinitionList);
//        pipelineStageService.generateStage(pipelineDiagram);
        System.out.println(pipelineDiagram.toJsonSring());
        List<AbstractNodeDefinition> allEndNode = pipelineDiagram.findAllEndNode();
        Set<AbstractNodeDefinition> resultss = new LinkedHashSet<>();
        for (AbstractNodeDefinition abstractNodeDefinition : allEndNode) {
            resultss.addAll(linear(pipelineDiagram, abstractNodeDefinition));
        }

        for (AbstractNodeDefinition results : resultss) {
            System.out.println(results.getName());
        }
    }

    @Test
    public void stageTest() throws IOException {
        String stage1 = "{\"pipelineId\":2312,\"campaignId\":115,\"name\":\"test\",\"status\":null,\"version\":\"2017009\"," +
                "\"startTime\":1508210022707,\"endTime\":1508210022707,\"description\":null,\"tenantId\":null,\"creator\":null," +
                "\"createBy\":null,\"createTime\":null,\"updater\":null,\"updateBy\":null,\"updateTime\":null," +
                "\"pipelineTerminationRuleDefinition\":null,\"pipelineEnterRuleDefinition\":null,\"pipelineForbiddenRuleDefinition\":null," +
                "\"nodeDefinitionList\":[{\"type\":\"entrance\",\"id\":\"2017001\",\"pipelineDefinitionId\":null,\"name\":\"入口\"," +
                "\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null,\"height\":null,\"description\":null,\"icon\":null," +
                "\"crowdType\":null,\"crowdId\":null,\"crowdName\":null,\"crowdVersion\":null,\"crowdDescription\":null,\"calcType\":null," +
                "\"period\":null,\"ruleDefinition\":null,\"unlimited\":null,\"lessThanTimes\":null,\"lessThanDays\":null," +
                "\"forbiddenExpression\":null},{\"type\":\"split\",\"id\":\"2017002\",\"pipelineDefinitionId\":null,\"name\":\"分流器\"," +
                "\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null,\"height\":null,\"description\":null,\"icon\":null," +
                "\"splitType\":null,\"count\":null,\"dimensionCode\":null,\"branchList\":null},{\"type\":\"push\",\"id\":\"2017003\"," +
                "\"pipelineDefinitionId\":null,\"name\":\"push\",\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null,\"height\":null," +
                "\"description\":null,\"icon\":null,\"groupName\":null,\"maxDeliveryCount\":null,\"frequency\":null,\"triggerType\":null," +
                "\"subTriggerType\":null,\"cronExpression\":null,\"appointedTime\":null,\"offlineDataRetentionTime\":null,\"enhancedChannelId" +
                "\":null,\"enhancedChannelName\":null,\"action\":null,\"title\":null,\"content\":null,\"clearable\":null,\"vibrate\":null," +
                "\"wakeup\":null,\"ex\":null,\"xiaomi\":null,\"huawei\":null,\"sound\":null,\"soundName\":null,\"badge\":null,\"channel\":null," +
                "\"prod\":null,\"os\":null,\"app\":null},{\"type\":\"shortMessage\",\"id\":\"2017004\",\"pipelineDefinitionId\":null," +
                "\"name\":\"短信\",\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null,\"height\":null,\"description\":null,\"icon\":null," +
                "\"groupName\":null,\"maxDeliveryCount\":null,\"frequency\":null,\"scheduleType\":null,\"expression\":null,\"channelCode\":null," +
                "\"content\":null,\"attachmentId\":9527,\"shortCode\":null,\"linkAddress\":null}],\"edgeDefinitionList\":[{\"id\":\"E2001\"," +
                "\"pipelineDefinitionId\":null,\"name\":null,\"expression\":null,\"sourceNodeId\":\"2017001\",\"targetNodeId\":\"2017002\"}," +
                "{\"id\":\"E2002\",\"pipelineDefinitionId\":null,\"name\":null,\"expression\":null,\"sourceNodeId\":\"2017002\"," +
                "\"targetNodeId\":\"2017003\"},{\"id\":\"E2003\",\"pipelineDefinitionId\":null,\"name\":null,\"expression\":null," +
                "\"sourceNodeId\":\"2017002\",\"targetNodeId\":\"2017004\"}],\"startNodeDefinitionList\":[{\"type\":\"entrance\"," +
                "\"id\":\"2017001\",\"pipelineDefinitionId\":null,\"name\":\"入口\",\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null," +
                "\"height\":null,\"description\":null,\"icon\":null,\"crowdType\":null,\"crowdId\":null,\"crowdName\":null,\"crowdVersion\":null," +
                "\"crowdDescription\":null,\"calcType\":null,\"period\":null,\"ruleDefinition\":null,\"unlimited\":null,\"lessThanTimes\":null," +
                "\"lessThanDays\":null,\"forbiddenExpression\":null}]}";

        String stage2 = "{\"pipelineId\":2312,\"campaignId\":115,\"name\":\"test\",\"status\":null,\"version\":\"2017009\",\"startTime\":1508210022707,\"endTime\":1508210022707,\"description\":null,\"tenantId\":null,\"creator\":null,\"createBy\":null,\"createTime\":null,\"updater\":null,\"updateBy\":null,\"updateTime\":null,\"pipelineTerminationRuleDefinition\":null,\"pipelineEnterRuleDefinition\":null,\"pipelineForbiddenRuleDefinition\":null,\"nodeDefinitionList\":[{\"type\":\"trigger\",\"id\":\"2017005\",\"pipelineDefinitionId\":null,\"name\":\"触发器\",\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null,\"height\":null,\"description\":null,\"icon\":null,\"monitorType\":null,\"startTime\":null,\"endTime\":null,\"lessThanHour\":null,\"branchType\":null,\"mainExpression\":null,\"additionExpression\":null,\"unlimited\":null,\"sameBranchLessThanDays\":null,\"sameBranchLessThanTimes\":null,\"diffBranchLessThanDays\":null,\"diffBranchLessThanTimes\":null,\"targetType\":null},{\"type\":\"hourMeter\",\"id\":\"2017006\",\"pipelineDefinitionId\":null,\"name\":\"计时器\",\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null,\"height\":null,\"description\":null,\"icon\":null,\"hourMeterType\":null,\"timeSchedulingExpression\":null,\"expression\":null},{\"type\":\"generate\",\"id\":\"2017007\",\"pipelineDefinitionId\":null,\"name\":\"人群生成\",\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null,\"height\":null,\"description\":null,\"icon\":null,\"acquisitionStartTime\":null,\"acquisitionEndTime\":null,\"behaviorPathDescription\":null},{\"type\":\"end\",\"id\":\"2017009\",\"pipelineDefinitionId\":null,\"name\":\"END\",\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null,\"height\":null,\"description\":null,\"icon\":null}],\"edgeDefinitionList\":[{\"id\":\"E2006\",\"pipelineDefinitionId\":null,\"name\":null,\"expression\":null,\"sourceNodeId\":\"2017005\",\"targetNodeId\":\"2017006\"},{\"id\":\"E2007\",\"pipelineDefinitionId\":null,\"name\":null,\"expression\":null,\"sourceNodeId\":\"2017005\",\"targetNodeId\":\"2017007\"},{\"id\":\"E20010\",\"pipelineDefinitionId\":null,\"name\":null,\"expression\":null,\"sourceNodeId\":\"2017007\",\"targetNodeId\":\"2017009\"}],\"startNodeDefinitionList\":[{\"type\":\"trigger\",\"id\":\"2017005\",\"pipelineDefinitionId\":null,\"name\":\"触发器\",\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null,\"height\":null,\"description\":null,\"icon\":null,\"monitorType\":null,\"startTime\":null,\"endTime\":null,\"lessThanHour\":null,\"branchType\":null,\"mainExpression\":null,\"additionExpression\":null,\"unlimited\":null,\"sameBranchLessThanDays\":null,\"sameBranchLessThanTimes\":null,\"diffBranchLessThanDays\":null,\"diffBranchLessThanTimes\":null,\"targetType\":null}]}";
//        触发器, 计时器, 人群生成, END
        String stage3 = "{\"pipelineId\":2312,\"campaignId\":115,\"name\":\"test\",\"status\":null,\"version\":\"2017009\",\"startTime\":1508210022707,\"endTime\":1508210022707,\"description\":null,\"tenantId\":null,\"creator\":null,\"createBy\":null,\"createTime\":null,\"updater\":null,\"updateBy\":null,\"updateTime\":null,\"pipelineTerminationRuleDefinition\":null,\"pipelineEnterRuleDefinition\":null,\"pipelineForbiddenRuleDefinition\":null,\"nodeDefinitionList\":[{\"type\":\"filter\",\"id\":\"2017008\",\"pipelineDefinitionId\":null,\"name\":\"过滤器\",\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null,\"height\":null,\"description\":null,\"icon\":null,\"tagRowKeyList\":null},{\"type\":\"end\",\"id\":\"2017009\",\"pipelineDefinitionId\":null,\"name\":\"END\",\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null,\"height\":null,\"description\":null,\"icon\":null}],\"edgeDefinitionList\":[{\"id\":\"E2009\",\"pipelineDefinitionId\":null,\"name\":null,\"expression\":null,\"sourceNodeId\":\"2017008\",\"targetNodeId\":\"2017009\"}],\"startNodeDefinitionList\":[{\"type\":\"filter\",\"id\":\"2017008\",\"pipelineDefinitionId\":null,\"name\":\"过滤器\",\"operatorCode\":null,\"x\":null,\"y\":null,\"width\":null,\"height\":null,\"description\":null,\"icon\":null,\"tagRowKeyList\":null}]}";
//        过滤器，END
//        PipelineDiagram pipelineDiagram = JsonUtil.toObject(stage1, PipelineDiagram.class);
//        PipelineDiagram pipelineDiagram = JsonUtil.toObject(stage2, PipelineDiagram.class);
        PipelineDiagram pipelineDiagram = JsonUtil.toObject(stage3, PipelineDiagram.class);
        List<AbstractNodeDefinition> allEndNode = pipelineDiagram.findAllEndNode();
        Set<AbstractNodeDefinition> results = new LinkedHashSet<>();
        for (AbstractNodeDefinition abstractNodeDefinition : allEndNode) {
            results.addAll(linear(pipelineDiagram, abstractNodeDefinition));
        }
        for (AbstractNodeDefinition result : results) {
            System.out.println(result.getName());
        }
    }

    public Set<AbstractNodeDefinition> linear(PipelineDiagram pipelineDiagram, AbstractNodeDefinition abstractNodeDefinition) {
        Set<AbstractNodeDefinition> result = new LinkedHashSet<>();
        List<AbstractNodeDefinition> preNodeDefinition = pipelineDiagram.findPreNodeDefinition(abstractNodeDefinition.getId());
        for (AbstractNodeDefinition each : preNodeDefinition) {
            result.addAll(linear(pipelineDiagram, each));
        }
        result.add(abstractNodeDefinition);
        return result;
    }

}
