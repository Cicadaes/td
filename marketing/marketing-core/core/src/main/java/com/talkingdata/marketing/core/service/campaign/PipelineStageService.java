package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.PipelineDiagram;
import com.talkingdata.marketing.core.entity.campaign.definition.node.*;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.PipelineStageDao;
import com.talkingdata.marketing.core.entity.campaign.PipelineStage;

import java.util.*;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_STAGE PipelineStageService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("pipelineStageService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PipelineStageService extends BaseService<PipelineStage, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(PipelineStageService.class);

    @Autowired
    private PipelineStageDao dao;

    @Override
    public PipelineStageDao getDao() {
        return dao;
    }

    /**
     * 删除记录，条件为：营销活动ID、活动流程ID、版本及租户ID
     * @param campaignId 营销活动ID
     * @param pipelineId 活动流程ID
     * @param version 版本
     * @param tenantId 租户ID
     * @throws Exception
     */
    public void deleteByCampaignIdAndPipelineIdAndVersion(Integer campaignId, Integer pipelineId, String version, String tenantId) throws Exception {
        getDao().deleteByCampaignIdAndPipelineIdAndVersion(campaignId, pipelineId, version, tenantId);
    }

    /**
     * 保存多条数据
     * @param pipelineStages 需要保存的stage
     * @return
     * @throws Exception
     */
    public Integer save(List<PipelineStage> pipelineStages) throws Exception {
        return getDao().insertBatch(pipelineStages);
    }

    /**
     * 生产stage
     * 思路：因为流程图有多个支流，在此使用startNodes-使用SET存储确认每个stage的开始点
     * @param pipelineDiagram 流程图数据
     * @throws Exception
     */
    public Boolean generateStage(final PipelineDiagram pipelineDiagram) throws Exception {
        List<PipelineStage> pipelineStages = new ArrayList<>();
        /**获取入口组件*/
        List<AbstractNodeDefinition> entranceNodes = pipelineDiagram.findAllEntranceNode();
        Set<AbstractNodeDefinition> startNode = new HashSet();
        /**初始化开始节点*/
        for (AbstractNodeDefinition entranceNode : entranceNodes) { startNode.add(entranceNode); }
        int stageNO = 1;
        while (!startNode.isEmpty()) {
            List<AbstractNodeDefinition> nodeDefinitionList = getStageNode(startNode, pipelineDiagram);
            PipelineStage pipelineStage = doGenerate(startNode, nodeDefinitionList, pipelineDiagram, stageNO++);
            pipelineStages.add(pipelineStage);
            startNode = getNextStartNode(pipelineStage, pipelineDiagram);
        }
        if (!pipelineStages.isEmpty()) {
            save(pipelineStages);
        }
        return true;
    }

    /**
     * stage诞生
     *
     * @param startNode
     * @param nodeDefinitionList
     * @param pipelineDiagram
     * @param stageNO
     * @return
     * @throws Exception
     */
    private PipelineStage doGenerate(Set<AbstractNodeDefinition> startNode, List<AbstractNodeDefinition> nodeDefinitionList, PipelineDiagram pipelineDiagram, int stageNO) throws Exception {
        PipelineDiagram instance = new PipelineDiagram();
        BeanUtils.copyProperties(pipelineDiagram, instance, new String[]{"nodeDefinitionList","edgeDefinitionList"});

        List<EdgeDefinition> edgeDefinitionList = new ArrayList<>();
        for (AbstractNodeDefinition outNode : nodeDefinitionList) {
            for (AbstractNodeDefinition intNode : nodeDefinitionList) {
                EdgeDefinition tmpEdge = pipelineDiagram.findEdgeByCondition(outNode.getId(), intNode.getId());
                if (tmpEdge != null) {
                    edgeDefinitionList.add(tmpEdge);
                }
            }
        }
        instance.setNodeDefinitionList(nodeDefinitionList);
        instance.setEdgeDefinitionList(edgeDefinitionList);
        List<AbstractNodeDefinition> startNodeDefinitions = new ArrayList<>();
        startNodeDefinitions.addAll(startNode);
        instance.setStartNodeDefinitionList(startNodeDefinitions);
        return generateStageInstanceByPipelineDiagram(instance, stageNO);
    }

    /**
     * 检索出当前Stage包含的点
     * @param startNode 当前Stage的起始点
     * @param pipelineDiagram 流程图数据
     * @return
     * @throws Exception
     */
    private List<AbstractNodeDefinition> getStageNode(Set<AbstractNodeDefinition> startNode, PipelineDiagram pipelineDiagram) throws Exception {
        List<AbstractNodeDefinition> nodeDefinitionList = new ArrayList<>();
        for (AbstractNodeDefinition node : startNode) {
            nodeDefinitionList.add(node);
            doRetrieve(pipelineDiagram, node, nodeDefinitionList);
        }
        return nodeDefinitionList;
    }

    /**
     * 检索点
     *    --检索时判断当前点是否是分割点，如果不是则递归检索当前点关联的点
     * @param pipelineDiagram 流程图数据
     * @param node 开始节点
     * @param nodeDefinitionList 检索到符合条件的点
     * @throws Exception
     */
    private void doRetrieve(PipelineDiagram pipelineDiagram, AbstractNodeDefinition node, List<AbstractNodeDefinition> nodeDefinitionList) throws Exception {
        List<AbstractNodeDefinition> nextNodes = pipelineDiagram.findNextNodeDefinition(node.getId());
        for (AbstractNodeDefinition nextNode : nextNodes) {
            nodeDefinitionList.add(nextNode);
            if (isSplitNode(nextNode)) {
                continue;
            } else {
                doRetrieve(pipelineDiagram, nextNode, nodeDefinitionList);
            }
        }
    }

    /**
     * 检索下一个stage的开始节点
     * @param pipelineStage 上一个stage
     * @param pipelineDiagram 流程图数据
     * @return
     * @throws Exception
     */
    private Set<AbstractNodeDefinition> getNextStartNode(PipelineStage pipelineStage, PipelineDiagram pipelineDiagram) throws Exception {
        Set<AbstractNodeDefinition> result = new HashSet();
        PipelineDiagram stagePipelineDiagram = JsonUtil.toObject(pipelineStage.getDiagram(), PipelineDiagram.class);
        for (AbstractNodeDefinition node : stagePipelineDiagram.findAllEndNode()) {
            List<AbstractNodeDefinition> nextNodes = pipelineDiagram.findNextNodeDefinition(node.getId());
            for (AbstractNodeDefinition nextNode : nextNodes) {
                if (isNotEndNode(nextNode)) {
                    result.add(nextNode);
                }
            }
        }
        return result;
    }

    /**
     * 判断非最后节点，是则返回true，否则返回false
     * @param nextNode
     * @return
     * @throws Exception
     */
    private boolean isNotEndNode(AbstractNodeDefinition nextNode) throws Exception {
        return !(nextNode instanceof EndNodeDefinition);
    }

    /**
     * 生产stage
     *    根据分割点切割流程，生成多个stage
     * @param pipelineDiagram
     * @throws Exception
     */
    @Deprecated
    public void generateStageOld(PipelineDiagram pipelineDiagram) throws Exception {
        List<PipelineStage> pipelineStages = new ArrayList<>();
        List<LinkedList<AbstractNodeDefinition>> nodeDefLinkList = pipelineDiagram.depthFirstSearch();
        for (LinkedList<AbstractNodeDefinition> nodeDefLink : nodeDefLinkList) {
            int start = 0;
            int end = 0;
            for (int i = 0; i < nodeDefLink.size(); i++) {
                end = i;
                if(isSplitNode(nodeDefLink.get(i))) {
                    PipelineDiagram instance = new PipelineDiagram();
                    BeanUtils.copyProperties(pipelineDiagram, instance, new String[]{"nodeDefinitionList","edgeDefinitionList"});
                    List<AbstractNodeDefinition> nodeDefinitionList = new ArrayList<>();
                    int j = start;
                    while (j <= end) {
                        AbstractNodeDefinition node = nodeDefLink.get(j++);
                        if (!(node instanceof EndNodeDefinition)) {
                            nodeDefinitionList.add(node);
                        }
                    }
                    List<EdgeDefinition> edgeDefinitionList = new ArrayList<>();
                    for (int n = 0; n < nodeDefinitionList.size() - 1; n++) {
                        edgeDefinitionList.add(pipelineDiagram.findEdgeByCondition(nodeDefinitionList.get(n).getId(), nodeDefinitionList.get(n + 1).getId()));
                    }
                    instance.setNodeDefinitionList(nodeDefinitionList);
                    instance.setEdgeDefinitionList(edgeDefinitionList);

                    PipelineStage stage = generateStageInstanceByPipelineDiagram(instance, 0);
                    pipelineStages.add(stage);
                    start = end + 1;
                }
            }
        }
        save(pipelineStages);
    }

    /**
     * 赋值stage实例
     * @param instance
     * @param stageNO
     * @return
     * @throws Exception
     */
    private PipelineStage generateStageInstanceByPipelineDiagram(PipelineDiagram instance, int stageNO) throws Exception {
        PipelineStage stage = new PipelineStage();
        stage.setCampaignId(instance.getCampaignId());
        stage.setPipelineDefinitionId(instance.getPipelineId());
        stage.setVersion(instance.getVersion());
        stage.setStageName("stage_" + stageNO);
        stage.setDiagram(instance.toJsonSring());
        stage.setTenantId(instance.getTenantId());
        stage.setCreateTime(new Date());
        stage.setUpdateTime(new Date());
        return stage;
    }

    /**
     * 当前节点是否是分割节点
     * @param nodeDefinition 节点
     * @return 是返回true，否则false
     */
    private boolean isSplitNode(AbstractNodeDefinition nodeDefinition) {
        if (nodeDefinition instanceof PushNodeDefinition
                || nodeDefinition instanceof HourMeterNodeDefinition
                || nodeDefinition instanceof ShortMessageNodeDefinition
                || nodeDefinition instanceof EndNodeDefinition) {
            return true;
        } else {
            return false;
        }
    }

}
