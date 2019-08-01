package com.talkingdata.marketing.streaming.pipeline.executor;

import static com.talkingdata.marketing.streaming.model.ExecutorResultDataConstant.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.talkingdata.marketing.streaming.cache.EhcacheService;
import com.talkingdata.marketing.streaming.model.*;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.PipelineDiagram;
import com.talkingdata.marketing.streaming.pipeline.definition.node.EndNodeDefinition;
import com.talkingdata.marketing.streaming.util.DateUtil;
import com.talkingdata.marketing.streaming.util.JsonUtil;
import com.tendcloud.tenddata.entity.EventPackage;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

/**
 * 营销流程执行器-阶段执行
 *
 * @author Created by yangtao on 2017/9/19.
 */
@Component
public class PipelineStageExecutor implements IPipelineStageExecutor {
    private static final Logger logger = LoggerFactory.getLogger(PipelineStageExecutor.class);
    /**
     * stageName的前缀，例：stage1，stage2
     */
    private static final String STAGE_NAME_PREFIX = "stage_";
    private static final String STAGE_ONE_NAME = "stage_1";

    @Autowired
    private EhcacheService ehcacheService;

    @Autowired
    private IPipelineNodeExecutor pipelineNodeExecutor;

    @Override
    public List<ExecutorResultData> executor(PipelineDefinition definition, EventPackage eventPackage) {
        // 根据当前EventPackage执行到的stage，执行相应的stage
        PipelineDiagram stageDiagram = stageDiagram(eventPackage);
        if (stageDiagram == null) {
            return new ArrayList<>();
        }
        PipelineDiagram pipelineDiagram;
        try {
            pipelineDiagram = JsonUtil.toObject(definition.getDiagram(), PipelineDiagram.class);
        } catch (IOException e) {
            logger.error("parse PipelineDiagram failed, input json: {}, exception: {}", definition.getDiagram(), e.getMessage());
            return new ArrayList<>();
        }
        Set<AbstractNodeDefinition> executorNodes = genExecuteStageNodes(eventPackage, pipelineDiagram, stageDiagram);
        if (executorNodes.isEmpty()) {
            logger.warn("eventPackage mDeviceId: {}, stage nodes is empty", eventPackage.mDeviceId);
            return new ArrayList<>();
        }
        OperatorResult operatorResult = pipelineNodeExecutor.executeNodes(definition, pipelineDiagram, executorNodes, eventPackage);
        // 通过上一个节点的时间
        eventPackage.additiveProfile.passBeforeNodeTime = System.currentTimeMillis();
        // 设置上一次通过的分支信息
        if (operatorResult.getLastBranchEdgeIds() != null && !operatorResult.getLastBranchEdgeIds().isEmpty()) {
            eventPackage.additiveProfile.lastBranchEdgeIds = operatorResult.getLastBranchEdgeIds();
        }
        List<ExecutorResultData> resultData = operatorResult.getResultData();
        if (Objects.equals(operatorResult.getStatus(), OperatorResult.LESS_THAN_STATUS)) {
            // 下一次继续执行当前stage 写eventPackage
            // 设置下一次触发时间（触发器和计时器）
            if (operatorResult.getLastProcessedNodeIds() != null && !operatorResult.getLastProcessedNodeIds().isEmpty()) {
                eventPackage.additiveProfile.lastProcessedNodeIds = operatorResult.getLastProcessedNodeIds();
            }
            exportEp(eventPackage, operatorResult.getUntilTime(), resultData);
        } else if (Objects.equals(operatorResult.getStatus(), OperatorResult.COMPLETED_STATUS)) {
            // 下一次执行下一个stage 写eventPackage
            eventPackage.additiveProfile.stageName = genCurrentStageName(eventPackage.additiveProfile.stageName);
            eventPackage.additiveProfile.lastProcessedNodeIds = Collections.emptyList();
            // 只有当该ep执行的时候存在下一个stage的时候，才写至es，作为流程重新发起
            if (hasNextNode(eventPackage, stageDiagram, pipelineDiagram) &&
                    hasNextStage(eventPackage.additiveProfile.stageName, definition, eventPackage.mDeviceId)) {
                exportEp(eventPackage, DateUtil.format(System.currentTimeMillis(), DateUtil.dtf_y4mmdd_hhmmss), resultData);
            }
        }
        return resultData;
    }

    /**
     * 当前stage执行完后, 是否还有有效的算子可执行
     * 先获取当前stage的结束节点，与所走分支的算子求交集，得到当前ep所走的当前stage的结束节点
     * 然后判断当前stage结束节点后是否还存在有效的计算算子
     *
     * @param eventPackage    EventPackage
     * @param stageDiagram    当前stage的diagram
     * @param pipelineDiagram 整个Pipeline的diagram
     * @return 还存在有效的算子返回true，否则false
     */
    private boolean hasNextNode(EventPackage eventPackage, PipelineDiagram stageDiagram, PipelineDiagram pipelineDiagram) {
        List<AbstractNodeDefinition> allEndNode = stageDiagram.findAllEndNode();
        Set<String> branchNodeIds = branchNodeIds(eventPackage, pipelineDiagram);
        allEndNode.removeIf(node -> !branchNodeIds.contains(node.getId()));
        boolean hasNext = false;
        for (AbstractNodeDefinition nodeDefinition : allEndNode) {
            List<AbstractNodeDefinition> nextNode = pipelineDiagram.findNextNodeDefinition(nodeDefinition.getId());
            for (AbstractNodeDefinition node : nextNode) {
                if (!(node instanceof EndNodeDefinition)) {
                    hasNext = true;
                }
            }
        }
        return hasNext;
    }

    /**
     * 判断当前的ep执行Pipeline是否还存在下一个stage
     *
     * @param currentStageName 当前的stageName
     * @param definition       PipelineDefinition
     * @param deviceId         ep的deviceId
     * @return 存在返回true，否则返回false
     */
    private boolean hasNextStage(String currentStageName, PipelineDefinition definition, String deviceId) {
        String nextStageName = genCurrentStageName(currentStageName);
        Map<String, PipelineStage> pipelineStageCache = ehcacheService.findPipelineStageCache(definition.getCampaignId(),
                definition.getId(), definition.getVersion());
        if (pipelineStageCache == null) {
            logger.error("campaignId: {}, pipelineDefinitionId: {}, version: {}, PipelineStage not exist",
                    definition.getCampaignId(), definition.getId(), definition.getVersion());
            return false;
        }
        PipelineStage pipelineStage = pipelineStageCache.get(nextStageName);
        if (pipelineStage == null) {
            logger.warn("campaignId: {}, pipelineDefinitionId: {}, version: {}, currentStageName: {}, deviceId: {}. pipeline is finished",
                    definition.getCampaignId(), definition.getId(), definition.getVersion(), currentStageName, deviceId);
            return false;
        }
        return true;
    }

    /**
     * 将EP数据写入到Kafka
     */
    private void exportEp(EventPackage eventPackage, String nextTriggerTime, List<ExecutorResultData> resultData) {
        logger.info("prepare export the eventPackage");
        try {
            EventPackageWraper epWraper = new EventPackageWraper(JsonUtil.toJsonString(eventPackage), nextTriggerTime);
            ExecutorResultDataContent<EventPackageWraper> dataContent = new ExecutorResultDataContent<>(DATA_TYPE_EVENTPACKAGE, epWraper);
            resultData.add(new ExecutorResultData(SAVE_TYPE_ES, dataContent));
        } catch (JsonProcessingException e) {
            logger.error("write eventPackage has exception: ", e);
        }
    }

    /**
     * 获取当前EventPackage应该执行的stage，并根据stage生成PipelineDiagram，按照node顺序生成应该执行的node
     *
     * @param eventPackage eventPackage
     * @return nodes
     */
    private Set<AbstractNodeDefinition> genExecuteStageNodes(EventPackage eventPackage, PipelineDiagram pipelineDiagram, PipelineDiagram stageDiagram) {
        Set<AbstractNodeDefinition> executorNodes = new LinkedHashSet<>();
        if (stageExecutorNodes(executorNodes, stageDiagram)) {
            return executorNodes;
        }
        // 上次走的分支信息, 清除非该走的分支的算子, 也就是求交集，交集就是当前stage该执行的算子
        Set<String> branchNodeIds = branchNodeIds(eventPackage, pipelineDiagram);
        if (branchNodeIds != null && !branchNodeIds.isEmpty()) {
            executorNodes.removeIf(next -> !branchNodeIds.contains(next.getId()));
        }
        // 如果上次等待, 清除已经走过的算子
        List<String> processedNodeIds = eventPackage.additiveProfile.lastProcessedNodeIds;
        if (processedNodeIds != null && !processedNodeIds.isEmpty()) {
            executorNodes.removeIf(next -> processedNodeIds.contains(next.getId()));
        }
        return executorNodes;
    }

    /**
     * 得到当前执行stage的diagram对象
     */
    private PipelineDiagram stageDiagram(EventPackage eventPackage) {
        String beforeStageName = eventPackage.additiveProfile.stageName;
        String currentStageName = genCurrentStageName(beforeStageName);
        Integer campaignId = eventPackage.additiveProfile.campaignId;
        Integer pipelineDefinitionId = eventPackage.additiveProfile.pipelineDefinitionId;
        String version = eventPackage.additiveProfile.version;

        Map<String, PipelineStage> pipelineStageCache = ehcacheService.findPipelineStageCache(campaignId, pipelineDefinitionId, version);
        if (pipelineStageCache == null) {
            logger.error("campaignId: {}, pipelineDefinitionId: {}, version: {}, PipelineStage not exist",
                    campaignId, pipelineDefinitionId, version);
            return null;
        }
        PipelineStage pipelineStage = pipelineStageCache.get(currentStageName);
        if (pipelineStage == null) {
            logger.warn("campaignId: {}, pipelineDefinitionId: {}, version: {}, beforeStageName: {}, currentStageName: {} not exist",
                    campaignId, pipelineDefinitionId, version, beforeStageName, currentStageName);
            return null;
        }
        PipelineDiagram stageDiagram;
        try {
            stageDiagram = JsonUtil.toObject(pipelineStage.getDiagram(), PipelineDiagram.class);
        } catch (IOException e) {
            logger.error("parse PipelineDiagram failed, input json: {}, exception: {}", pipelineStage.getDiagram(), e.getMessage());
            return null;
        }
        return stageDiagram;
    }

    /**
     * 根据上次走的分支信息, 计算分支后的所有算子，用于与当前stage所有算子求交集
     *
     * @param eventPackage    EventPackage
     * @param pipelineDiagram PipelineDiagram
     * @return 分支后所有算子的Id集合
     */
    private Set<String> branchNodeIds(EventPackage eventPackage, PipelineDiagram pipelineDiagram) {
        Set<String> branchNodeIds = new LinkedHashSet<>();
        List<String> branchEdgeIds = eventPackage.additiveProfile.lastBranchEdgeIds;
        if (branchEdgeIds == null) {
            return branchNodeIds;
        }
        for (String edgeId : branchEdgeIds) {
            AbstractNodeDefinition nodeDefinition = pipelineDiagram.findTargetNodeByEdgeDefinitionId(edgeId);
            branchNodeIds.addAll(recursiveFromStart(pipelineDiagram, nodeDefinition));
        }
        return branchNodeIds;
    }

    /**
     * 计算当前stage中所有的算子
     *
     * @param executorNodes stage中所有算子集合
     * @param stageDiagram  PipelineDiagram
     * @return 解析Diagram失败返回true
     */
    private boolean stageExecutorNodes(Set<AbstractNodeDefinition> executorNodes, PipelineDiagram stageDiagram) {
        List<AbstractNodeDefinition> entranceNode = stageDiagram.findAllEndNode();
        for (AbstractNodeDefinition nodeDefinition : entranceNode) {
            executorNodes.addAll(linear(stageDiagram, nodeDefinition));
        }
        return false;
    }

    private String genCurrentStageName(String beforeStageName) {
        String currentStageName;
        if (StringUtils.isEmpty(beforeStageName)) {
            currentStageName = STAGE_ONE_NAME;
        } else {
            int stageNo = Integer.parseInt(beforeStageName.replace(STAGE_NAME_PREFIX, ""));
            currentStageName = STAGE_NAME_PREFIX + (stageNo + 1);
        }
        return currentStageName;
    }

    /**
     * 从开始节点递归到diagram的最后一个节点，返回算子的Id
     *
     * @param pipelineDiagram PipelineDiagram
     * @param nodeDefinition  开始算子
     * @return 开始节点后的算子Id集合
     */
    static Set<String> recursiveFromStart(PipelineDiagram pipelineDiagram, AbstractNodeDefinition nodeDefinition) {
        Set<String> result = new LinkedHashSet<>();
        result.add(nodeDefinition.getId());
        List<AbstractNodeDefinition> nextDefinition = pipelineDiagram.findNextNodeDefinition(nodeDefinition.getId());
        for (AbstractNodeDefinition each : nextDefinition) {
            result.addAll(recursiveFromStart(pipelineDiagram, each));
        }
        return result;
    }

    /**
     * 递归获取输入节点前的所有节点
     *
     * @param pipelineDiagram pipelineDiagram
     * @param nodeDefinition  nodeDefinition
     * @return 依赖顺序的当前节点前所有node
     */
    private Set<AbstractNodeDefinition> linear(PipelineDiagram pipelineDiagram, AbstractNodeDefinition nodeDefinition) {
        Set<AbstractNodeDefinition> result = new LinkedHashSet<>();
        List<AbstractNodeDefinition> preNodeDefinition = pipelineDiagram.findPreNodeDefinition(nodeDefinition.getId());
        for (AbstractNodeDefinition each : preNodeDefinition) {
            result.addAll(linear(pipelineDiagram, each));
        }
        result.add(nodeDefinition);
        return result;
    }

}
