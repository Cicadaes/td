package com.talkingdata.marketing.streaming.pipeline.executor;

import static com.talkingdata.marketing.streaming.model.ExecutorResultDataConstant.*;

import com.talkingdata.marketing.streaming.model.*;
import com.talkingdata.marketing.streaming.pipeline.PipelineUtil;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.model.OperatorResult;
import com.talkingdata.marketing.streaming.pipeline.definition.PipelineDiagram;
import com.talkingdata.marketing.streaming.pipeline.definition.node.*;
import com.talkingdata.marketing.streaming.pipeline.operator.*;
import com.talkingdata.marketing.streaming.util.*;
import com.tendcloud.tenddata.entity.EventPackage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * 算子执行器
 * PipelineStageExecutor执行每个stage会根据stage包含的每种算子，调用算子执行器执行单个算子获取结果。
 *
 * @author tend
 */
@Component
public class PipelineNodeExecutor implements IPipelineNodeExecutor {
    private static final Logger logger = LoggerFactory.getLogger(PipelineNodeExecutor.class);

    /**
     * idType-tdId
     */
    private static final String ID_TYPE_TDID = "tdId";

    @Autowired
    private EntranceNodeOperator entranceNodeOperator;
    @Autowired
    private SplitNodeOperator splitNodeOperator;
    @Autowired
    private PushNodeOperator pushNodeOperator;
    @Autowired
    private ShortMessageNodeOperator shortMessageNodeOperator;
    @Autowired
    private TriggerNodeOperator triggerNodeOperator;
    @Autowired
    private HourMeterNodeOperator hourMeterNodeOperator;
    @Autowired
    private FilterNodeOperator filterNodeOperator;
    @Autowired
    private GenerateCrowdNodeOperator generateCrowdNodeOperator;
    @Autowired
    private PipelineUtil pipelineUtil;
    @Autowired
    private RedisUtils redisUtils;
    @Autowired
    private PipelineMonitorHandle monitorHandle;

    /**
     * 执行node
     *
     * @param pipelineDefinition pipelineDefinition
     * @param pipelineDiagram    PipelineDiagram
     * @param executorNodes      executorNodes
     * @param eventPackage       eventPackage
     */
    @Override
    public OperatorResult executeNodes(PipelineDefinition pipelineDefinition, PipelineDiagram pipelineDiagram,
                                       Set<AbstractNodeDefinition> executorNodes, EventPackage eventPackage) {
        // 分流器或触发器, 计算完成的边节点, 只有分流器和触发器会修改该参数
        List<EdgeDefinition> edgeDefinitions = new ArrayList<>();
        // 当前stage已经处理过的算子的id
        List<String> processedNodeIds = new ArrayList<>();
        // 计算当前stage所返回的数据
        List<ExecutorResultData> resultDatas = new ArrayList<>();

        for (AbstractNodeDefinition nodeDefinition : executorNodes) {
            try {
                if (!validateCrowdId(eventPackage, nodeDefinition, pipelineDefinition, pipelineDiagram)) {
                    return OperatorResult.dissatisfyResult().setResultData(resultDatas);
                }
                if (isExecuteThisNode(edgeDefinitions, pipelineDiagram, nodeDefinition)) {
                    if (nodeDefinition instanceof EntranceNodeDefinition) {
                        if (pipelineDiagram.getDebugParam() == null || isRunExecutor(pipelineDefinition, pipelineDiagram.getDebugParam().isSkipEntrance())) {
                            Boolean isEnter = entranceNodeOperator.executor(pipelineDefinition, nodeDefinition, eventPackage);
                            if (!isEnter) {
                                logger.warn("mDeviceId: {}, pipelineId: {}, EntranceNodeOperator retrun false, skip",
                                        eventPackage.mDeviceId, pipelineDefinition.getId());
                                return OperatorResult.dissatisfyResult().setResultData(resultDatas);
                            }
                            monitorHandle.accumulator(pipelineDefinition, nodeDefinition);
                            logger.info("mDeviceId: {}, pipelineId: {}, EntranceNodeOperator retrun true", eventPackage.mDeviceId, pipelineDefinition.getId());
                        } else {
                            logger.info("mDeviceId: {}, pipelineId: {}, EntranceNodeOperator debug skip", eventPackage.mDeviceId, pipelineDefinition.getId());
                        }
                    } else if (nodeDefinition instanceof SplitNodeDefinition) {
                        EdgeDefinition edgeDefinition;
                        if (pipelineDiagram.getDebugParam() == null || isRunExecutor(pipelineDefinition, pipelineDiagram.getDebugParam().isSkipSplit())) {
                            edgeDefinition = splitNodeOperator.executor(pipelineDefinition, nodeDefinition, eventPackage);
                        } else {
                            edgeDefinition = splitNodeOperator.debug(pipelineDefinition, nodeDefinition, eventPackage);
                        }
                        if (edgeDefinition != null) {
                            logger.info("mDeviceId: {}, pipelineId: {}, SplitNodeDefinition return edgeNode: {}",
                                    eventPackage.mDeviceId, pipelineDefinition.getId(), edgeDefinition.getName());
                            edgeDefinitions.clear();
                            edgeDefinitions.add(edgeDefinition);
                            monitorHandle.accumulator(pipelineDefinition, nodeDefinition);
                        } else {
                            // 为空表示该用户没有匹配的分支
                            logger.warn("mDeviceId: {}, pipelineId: {}, SplitNodeDefinition return null", eventPackage.mDeviceId, pipelineDefinition.getId());
                            return OperatorResult.dissatisfyResult().setResultData(resultDatas);
                        }
                    } else if (nodeDefinition instanceof PushNodeDefinition) {
                        MessageData data = pushNodeOperator.executor(pipelineDefinition, nodeDefinition, eventPackage);
                        if (data != null) {
                            // 写文件,push 返回需要包含 数据，发送类型，发送时间
                            PushNodeDefinition pushNodeDefinition = (PushNodeDefinition) nodeDefinition;
                            exportMessage(data, pipelineDefinition, nodeDefinition, resultDatas);
                            exportEquity(pipelineDefinition, pushNodeDefinition, ID_TYPE_TDID, eventPackage.mDeviceId, resultDatas);
                            monitorHandle.accumulator(pipelineDefinition, nodeDefinition);
                            logger.info("mDeviceId: {}, pipelineId: {}, PushNodeOperator return pushId: {}",
                                    eventPackage.mDeviceId, pipelineDefinition.getId(), data.getId());
                        } else {
                            logger.warn("mDeviceId: {}, pipelineId: {}, PushNodeOperator return pushId: null",
                                    eventPackage.mDeviceId, pipelineDefinition.getId());
                            return OperatorResult.dissatisfyResult().setResultData(resultDatas);
                        }
                    } else if (nodeDefinition instanceof ShortMessageNodeDefinition) {
                        MessageData data = shortMessageNodeOperator.executor(pipelineDefinition, nodeDefinition, eventPackage);
                        if (data != null) {
                            // 写文件 短信 返回需要包含 数据，发送类型，发送时间
                            exportMessage(data, pipelineDefinition, nodeDefinition, resultDatas);
                            monitorHandle.accumulator(pipelineDefinition, nodeDefinition);
                            logger.info("mDeviceId: {}, pipelineId: {}, ShortMessageNodeOperator return mobileId: {}",
                                    eventPackage.mDeviceId, pipelineDefinition.getId(), data.getId());
                        } else {
                            logger.warn("mDeviceId: {}, pipelineId: {}, ShortMessageNodeOperator return mobileId: null",
                                    eventPackage.mDeviceId, pipelineDefinition.getId());
                            return OperatorResult.dissatisfyResult().setResultData(resultDatas);
                        }
                    } else if (nodeDefinition instanceof TriggerNodeDefinition) {
                        List<EdgeDefinition> definitions;
                        if (pipelineDiagram.getDebugParam() == null || isRunExecutor(pipelineDefinition, pipelineDiagram.getDebugParam().isSkipTrigger())) {
                            definitions = triggerNodeOperator.executor(pipelineDefinition, nodeDefinition, eventPackage);
                        } else {
                            definitions = triggerNodeOperator.debug(pipelineDefinition, nodeDefinition, eventPackage);
                        }
                        if (definitions == null) {
                            logger.info("mDeviceId: {}, pipelineId: {}, TriggerNodeDefinition retrun less_than_status, still waiting for",
                                    eventPackage.mDeviceId, pipelineDefinition.getId());
                            return OperatorResult.lessThanResultNodeId(eventPackage.additiveProfile.nextTriggerTime, processedNodeIds)
                                    .setLastBranchEdgeIds(genBranchEdgeIds(edgeDefinitions)).setResultData(resultDatas);
                        }
                        if (definitions.isEmpty()) {
                            logger.warn("mDeviceId: {}, pipelineId: {}, TriggerNodeDefinition return branch: null",
                                    eventPackage.mDeviceId, pipelineDefinition.getId());
                            return OperatorResult.dissatisfyResult().setResultData(resultDatas);
                        }
                        monitorHandle.accumulator(pipelineDefinition, nodeDefinition);
                        logger.info("mDeviceId: {}, pipelineId: {}, TriggerNodeDefinition return branch: {}",
                                eventPackage.mDeviceId, pipelineDefinition.getId(), definitions);
                        edgeDefinitions = definitions;
                    } else if (nodeDefinition instanceof HourMeterNodeDefinition) {
                        if (pipelineDiagram.getDebugParam() == null || isRunExecutor(pipelineDefinition, pipelineDiagram.getDebugParam().isSkipHourMeter())) {
                            OperatorResult isWait = hourMeterNodeOperator.executor(pipelineDefinition, nodeDefinition, eventPackage);
                            if (Objects.equals(isWait.getStatus(), OperatorResult.LESS_THAN_STATUS)) {
                                logger.info("mDeviceId: {}, pipelineId: {}, HourMeterNodeOperator retrun less_than_status, still waiting for",
                                        eventPackage.mDeviceId, pipelineDefinition.getId());
                                isWait.setLastProcessedNodeIds(processedNodeIds).setLastBranchEdgeIds(genBranchEdgeIds(edgeDefinitions));
                                return isWait.setResultData(resultDatas);
                            } else if (Objects.equals(isWait.getStatus(), OperatorResult.GREATER_THAN_STATUS)) {
                                logger.warn("mDeviceId: {}, pipelineId: {}, HourMeterNodeOperator retrun greater_than_status, break",
                                        eventPackage.mDeviceId, pipelineDefinition.getId());
                                return OperatorResult.dissatisfyResult().setResultData(resultDatas);
                            }
                            logger.info("mDeviceId: {}, pipelineId: {}, HourMeterNodeOperator time to complete",
                                    eventPackage.mDeviceId, pipelineDefinition.getId());
                        }
                        monitorHandle.accumulator(pipelineDefinition, nodeDefinition);
                        logger.info("mDeviceId: {}, pipelineId: {}, HourMeterNodeOperator debug skip", eventPackage.mDeviceId, pipelineDefinition.getId());
                    } else if (nodeDefinition instanceof FilterNodeDefinition) {
                        if (pipelineDiagram.getDebugParam() == null || isRunExecutor(pipelineDefinition, pipelineDiagram.getDebugParam().isSkipFilter())) {
                            Boolean isFilter = filterNodeOperator.executor(pipelineDefinition, nodeDefinition, eventPackage);
                            if (!isFilter) {
                                logger.warn("mDeviceId: {}, pipelineId: {}, FilterNodeOperator retrun false, be filtered",
                                        eventPackage.mDeviceId, pipelineDefinition.getId());
                                return OperatorResult.dissatisfyResult().setResultData(resultDatas);
                            }
                            logger.info("mDeviceId: {}, pipelineId: {}, FilterNodeOperator retrun true", eventPackage.mDeviceId, pipelineDefinition.getId());
                        }
                        monitorHandle.accumulator(pipelineDefinition, nodeDefinition);
                        logger.info("mDeviceId: {}, pipelineId: {}, FilterNodeOperator debug skip", eventPackage.mDeviceId, pipelineDefinition.getId());
                    } else if (nodeDefinition instanceof GenerateCrowdNodeDefinition) {
                        GenerateCrowd generateCrowd = generateCrowdNodeOperator.executor(pipelineDefinition, nodeDefinition, eventPackage);
                        if (generateCrowd != null) {
                            // 写人群
                            monitorHandle.accumulator(pipelineDefinition, nodeDefinition);
                            ExecutorResultDataContent<GenerateCrowd> dataContent = new ExecutorResultDataContent<>(DATA_TYPE_GENERATE_CROWD, generateCrowd);
                            resultDatas.add(new ExecutorResultData(SAVE_TYPE_HDFS, dataContent));
                            logger.info("mDeviceId: {}, pipelineId: {}, GenerateCrowdNodeOperator retrun eventPackage",
                                    eventPackage.mDeviceId, pipelineDefinition.getId());
                        } else {
                            logger.warn("mDeviceId: {}, pipelineId: {}, GenerateCrowdNodeOperator retrun null",
                                    eventPackage.mDeviceId, pipelineDefinition.getId());
                            return OperatorResult.dissatisfyResult().setResultData(resultDatas);
                        }
                    }
                    processedNodeIds.add(nodeDefinition.getId());
                }
            } catch (NodeOperatorException e) {
                logger.error("mDeviceId: {}, pipelineId : {}, execute node name: {}, has exception, " +
                        "exception: {}", eventPackage.mDeviceId, pipelineDefinition.getId(), nodeDefinition.getName(), e.getMessage());
                return OperatorResult.dissatisfyResult().setResultData(resultDatas);
            } catch (CrowdNotMatchException e) {
                logger.info(e.getMessage());
            }
        }
        return OperatorResult.completedResult().setLastProcessedNodeIds(processedNodeIds).
                setLastBranchEdgeIds(genBranchEdgeIds(edgeDefinitions)).setResultData(resultDatas);
    }

    /**
     * 是否执行真正的算子逻辑
     *
     * @param pipelineDef PipelineDefinition
     * @param skipNode    debug模式下参数，是否真正执行当前算子，true不执行，false执行
     * @return true: 执行，false: 不执行
     */
    private boolean isRunExecutor(PipelineDefinition pipelineDef, Boolean skipNode) {
        return skipNode == null || PipelineExecutor.PIPELINE_DEFINITION_STATUS_TESTING.equals(pipelineDef.getStatus()) && !skipNode;
    }

    private List<String> genBranchEdgeIds(List<EdgeDefinition> edgeDefinitions) {
        List<String> edgeIds = new ArrayList<>();
        edgeDefinitions.forEach(edge -> edgeIds.add(edge.getId()));
        return edgeIds;
    }

    /**
     * 校验人群ID是否为空，包含对eventPackage和AbstractNodeDefinition的校验
     *
     * @param eventPackage   EventPackage
     * @param nodeDefinition AbstractNodeDefinition
     * @return 如果不为空则返回true，否则返回false
     */
    private boolean validateCrowdId(EventPackage eventPackage, AbstractNodeDefinition nodeDefinition, PipelineDefinition pipelineDef, PipelineDiagram diagram) {
        if (eventPackage.additiveProfile.crowdId == null) {
            logger.error("mDeviceId: {}, eventPackage error, eventPackage crowdId is null", eventPackage.mDeviceId);
            return false;
        }
        if (PipelineExecutor.PIPELINE_DEFINITION_STATUS_APPLY_SUCC.equals(pipelineDef.getStatus())) {
            return validateRunCrowdId(nodeDefinition, pipelineDef);
        } else {
            return validateDebugCrowdId(eventPackage, pipelineDef, diagram);
        }
    }

    /**
     * 校验Debug的情况下的人群ID
     */
    private boolean validateDebugCrowdId(EventPackage eventPackage, PipelineDefinition pipelineDef, PipelineDiagram diagram) {
        if (diagram.getDebugParam() == null) {
            logger.warn("campaignId: {}, pipelineDefinitionId: {}, version: {}, debugParam is null",
                    pipelineDef.getCampaignId(), pipelineDef.getId(), pipelineDef.getVersion());
            return false;
        }
        if (diagram.getDebugParam().getDebugCrowdId() == null) {
            logger.warn("campaignId: {}, pipelineDefinitionId: {}, version: {}, debugParam crowdId is null",
                    pipelineDef.getCampaignId(), pipelineDef.getId(), pipelineDef.getVersion());
            return false;
        }
        if (!eventPackage.additiveProfile.crowdId.equals(diagram.getDebugParam().getDebugCrowdId())) {
            logger.warn("campaignId: {}, pipelineDefinitionId: {}, version: {}, mDeviceId: {}, debugParam crowdId: {}, " +
                            "eventPackage crowdId: {}, crowdId is not match", pipelineDef.getCampaignId(), pipelineDef.getId(),
                    pipelineDef.getVersion(), eventPackage.mDeviceId, diagram.getDebugParam().getDebugCrowdId(), eventPackage.additiveProfile.crowdId);
            return false;
        }
        return true;
    }

    /**
     * 校验正式上线情况下的人群ID, 此处只做非空判断, 匹配判断由算子去实现
     */
    private boolean validateRunCrowdId(AbstractNodeDefinition nodeDefinition, PipelineDefinition pipelineDef) {
        if (nodeDefinition instanceof EntranceNodeDefinition) {
            EntranceNodeDefinition entranceNode = (EntranceNodeDefinition) nodeDefinition;
            if (entranceNode.getCrowdId() == null) {
                logger.error("campaignId: {}, pipelineDefinitionId: {}, version: {}, entrance node definition crowdId is null",
                        pipelineDef.getCampaignId(), pipelineDef.getId(), pipelineDef.getVersion());
                return false;
            }
        } else {
            if (nodeDefinition.getCrowdIds() == null || nodeDefinition.getCrowdIds().isEmpty()) {
                logger.error("campaignId: {}, pipelineDefinitionId: {}, version: {}, node name: {}, node definition crowdIds is empty",
                        pipelineDef.getCampaignId(), pipelineDef.getId(), pipelineDef.getVersion(), nodeDefinition.getName());
                return false;
            }
        }
        return true;
    }

    private void exportMessage(MessageData data, PipelineDefinition pipelineDefinition, AbstractNodeDefinition nodeDefinition,
                               List<ExecutorResultData> resultDatas) {
        data.setCampaignId(pipelineDefinition.getCampaignId());
        data.setPipelineDefinitionId(pipelineDefinition.getId());
        data.setVersion(pipelineDefinition.getVersion());
        data.setNodeId(nodeDefinition.getId());
        ExecutorResultDataContent<MessageData> dataContent = new ExecutorResultDataContent<>(DATA_TYPE_MESSAGEDATA, data);
        resultDatas.add(new ExecutorResultData(SAVE_TYPE_ES, dataContent));
    }

    /**
     * 记录权益发放记录到ES
     */
    private void exportEquity(PipelineDefinition pipelineDefinition, PushNodeDefinition pushNode,
                              String idType, String userId, List<ExecutorResultData> resultDatas) {
        String currentTime = DateUtil.format(System.currentTimeMillis(), DateUtil.dtf_y4mmdd_hhmmss);
        if (pushNode.getEquitys() == null || pushNode.getEquitys().isEmpty()) {
            logger.info("当前pipelineDefinition[{}]的[{}]节点没有权益", pipelineDefinition, pushNode.getId());
            return;
        }
        pushNode.getEquitys().forEach((e1, e2) -> {
            String key = String.format("%d_%d_%s", pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), e1);
            EquityDistributionRecord data = new EquityDistributionRecord();
            data.setIdType(idType);
            data.setUserId(userId);
            data.setCampaignId(pipelineDefinition.getCampaignId());
            data.setPipelineDefinitionId(pipelineDefinition.getId());
            data.setVersion(pipelineDefinition.getVersion());
            data.setPipelineNodeId(pushNode.getId());
            data.setIssuanceTime(currentTime);
            data.setEquityName(e2);
            data.setEquityCode(e1);
            data.setEquityValue(redisUtils.leftPop(key));
            ExecutorResultDataContent<EquityDistributionRecord> dataContent = new ExecutorResultDataContent<>(DATA_TYPE_EQUITY, data);
            resultDatas.add(new ExecutorResultData(SAVE_TYPE_ES, dataContent));
            // 修改TD_MKT_EQUITY_RECORD中对应的权益的状态值为'已发放'
            pipelineUtil.updateEquityRecordStatus(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), e1, e2, 1);
        });
    }

    /**
     * 根据边节点判断，当前eventPackage执行的是否能够进入当前节点
     *
     * @param edgeDefinitions 当上一个节点是触发器或分流器时，返回该点能走的边
     * @param pipelineDiagram pipelineDiagram
     * @param nodeDefinition  nodeDefinition当前节点
     * @return 输入边节点是空返回true，输入边节点后的节点包含当前节点，返回true
     * 否则返回false
     */
    private boolean isExecuteThisNode(List<EdgeDefinition> edgeDefinitions, PipelineDiagram pipelineDiagram, AbstractNodeDefinition nodeDefinition) {
        if (edgeDefinitions != null && !edgeDefinitions.isEmpty()) {
            Set<String> branchNodeIds = new LinkedHashSet<>();
            for (EdgeDefinition edgeDefinition : edgeDefinitions) {
                AbstractNodeDefinition node = pipelineDiagram.findTargetNodeByEdgeDefinitionId(edgeDefinition.getId());
                branchNodeIds.addAll(PipelineStageExecutor.recursiveFromStart(pipelineDiagram, node));
            }
            for (String branchNodeId : branchNodeIds) {
                if (branchNodeId.equals(nodeDefinition.getId())) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

}
