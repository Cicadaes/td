package com.talkingdata.marketing.core.entity.campaign.definition;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talkingdata.marketing.core.entity.campaign.definition.node.EdgeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.EntranceNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.rule.PipelineEnterRuleDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.rule.PipelineForbiddenRuleDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.rule.PipelineTerminationRuleDefinition;
import com.talkingdata.marketing.core.util.JsonUtil;
import java.util.*;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * PIPELINE 数据
 * @author tao.yang
 * @create 2017-08-17-下午5:19
 * @since JDK 1.8
 * @author hongsheng
 */
public class PipelineDiagram {
    private static final Logger logger = LoggerFactory.getLogger(PipelineDiagram.class);
    /**PIPELINE ID*/
    private Integer pipelineId;
    /**营销活动ID*/
    private Integer campaignId;
    /**PIPELINE 名称*/
    private String name;
    /**PIPELINE 状态*/
    private Integer status;
    /**PIPELINE 版本*/
    private String version;
    /**PIPELINE 开始时间*/
    private Date startTime;
    /**PIPELINE 结束时间*/
    private Date endTime;
    /**PIPELINE 描述*/
    private String description;
    /**租户ID*/
    private String tenantId;
    private String creator;
    private String createBy;
    private Date createTime;
    private String updater;
    private String updateBy;
    private Date updateTime;
    /**全局提前终止规则*/
    private PipelineTerminationRuleDefinition pipelineTerminationRuleDefinition;
    /**全局进入规则*/
    private PipelineEnterRuleDefinition pipelineEnterRuleDefinition;
    /**全局禁止规则*/
    private PipelineForbiddenRuleDefinition pipelineForbiddenRuleDefinition;
    /**点组件数据*/
    private List<AbstractNodeDefinition> nodeDefinitionList;
    /**边组件数据*/
    private List<EdgeDefinition> edgeDefinitionList;
    /**
     * Pipeline测试的参数
     */
    private PipelineDebugParam debugParam;

    /**
     * 点元素数据-MAP
     * 用于内部查询使用
     */
    private transient Map<String, AbstractNodeDefinition> nodeStorage = new HashMap<>(16);
    /**
     * 边元素数据-MAP
     * 用于内部查询使用
     */
    private transient Map<String, EdgeDefinition> edgeStorage = new HashMap<>(16);
    /**
     * 开始节点
     */
    private List<AbstractNodeDefinition> startNodeDefinitionList;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    /**
     * 管理人群与节点
     */
    public void relateCrowdId() {
        List<AbstractNodeDefinition> entranceNodes = findAllEntranceNode();
        entranceNodes.forEach(e1 -> {
            if (e1 instanceof EntranceNodeDefinition) {
                EntranceNodeDefinition entranceNode = (EntranceNodeDefinition) e1;
                doRelate(entranceNode.getId(), entranceNode.getCrowdId());
            }
        });
    }

    /**
     * 递归关联
     *
     * @param nodeId
     * @param crowdId
     */
    private void doRelate(String nodeId, Integer crowdId) {
        List<AbstractNodeDefinition> nextNodeDefinition = findNextNodeDefinition(nodeId);
        if (!nextNodeDefinition.isEmpty()) {
            nextNodeDefinition.forEach(e2 -> {
                e2.getCrowdIds().add(crowdId);
                doRelate(e2.getId(), crowdId);
            });
        }
    }

    /**
     * 深度优先遍历PipelineDiagram中图数据
     * @return
     */
    public List<LinkedList<AbstractNodeDefinition>> depthFirstSearch() {
        return new DiagramGraph().parseDiagramLinked();
    }

    /**
     * PipelineDiagram的邻接模型类
     *    --使用深度优先遍历
     *    --遍历流程图，每个流程图生成一个链表
     *    --注意：因所有分支共有一个尾顶点，在此未对此顶点做去重处理，有利于业务切割
     */
    private class DiagramGraph {
        /**
         * 存储遍历后的数据
         */
        private List<LinkedList<AbstractNodeDefinition>> nodeDefList = new ArrayList<>();
        /**
         * 存储多分支顶点
         */
        private Deque<AbstractNodeDefinition> stack = new ArrayDeque<>();
        /**
         * 全部入口点
         */
        private List<AbstractNodeDefinition> entranceNodes = PipelineDiagram.this.findAllEntranceNode();

        /**
         * 遍历每个Diagram
         * @return
         */
        public List<LinkedList<AbstractNodeDefinition>> parseDiagramLinked() {
            this.depthFirstSearch();
            return nodeDefList;
        }

        /**
         * 遍历全部入口点，每一个入口点即一个流程，每一个流程使用深度优先遍历，遍历结果以链表结构保存
         */
        private void depthFirstSearch () {
            for (AbstractNodeDefinition nodeDef : this.entranceNodes) {
                LinkedList<AbstractNodeDefinition> result = new LinkedList<>();
                this.doDepthFirstSearch(result, nodeDef);
                nodeDefList.add(result);
            }
        }

        /**
         * 深度优先遍历算法
         *  --添加入口定点到链表，作为头
         *  --遍历获取下一个顶添加到链表中
         * @param result 结果
         * @param nodeDef 入口顶点
         */
        private void doDepthFirstSearch(LinkedList<AbstractNodeDefinition> result, AbstractNodeDefinition nodeDef) {
            result.add(nodeDef);
            AbstractNodeDefinition nextNode = this.findNextNode(nodeDef);
            while(nextNode != null) {
                result.add(nextNode);
                nextNode = this.findNextNode(nodeDef);
            }
        }

        /**
         * 检查下个定点(最重要)
         *   --获取当前顶点的下一个顶点，难点在于当遍历到一条支流的尾顶点后怎么获取下一个顶点？在此使用Queue保存有多个
         *     分支的顶点，下次直接从stack获取。
         * @param nodeDef
         * @return
         */
        private AbstractNodeDefinition findNextNode(AbstractNodeDefinition nodeDef) {
            AbstractNodeDefinition nextNode = null;
            List<AbstractNodeDefinition> nextNodeDefs = PipelineDiagram.this.findNextNodeDefinition(nodeDef.getId());
            if (nextNodeDefs.isEmpty()) {
                nextNode = this.stack.poll();
            } else if (nextNodeDefs.size() == 1) {
                nextNode = nextNodeDefs.get(0);
            } else {
                this.stack.addAll(nextNodeDefs);
                nextNode = this.stack.poll();
            }
            return nextNode;
        }
    }

    /**
     * 转为JSON串
     * @return
     */
    public String toJsonSring() throws PipelineDiagramException {
        try {
            return JsonUtil.toJson(this);
        } catch (Exception e) {
            e.printStackTrace();
            throw new PipelineDiagramException("转换失败");
        }
    }

    /**
     * 解析JSON串
     * @param jsonString
     * @return
     */
    public PipelineDiagram toObject(String jsonString) throws PipelineDiagramException {
        try {
            return JsonUtil.toObject(jsonString, this.getClass());
        } catch (Exception e) {
            e.printStackTrace();
            throw new PipelineDiagramException("解析失败");
        }
    }

    /**
     * 检查游离点元素(未和任何其他组件相连)
     * @return
     */
    public List<AbstractNodeDefinition> findFreeNodeDefinition() {
        List<String> edgeIds = listEdgeId();
        List<String> nodeIds = listNodeId();

        nodeIds.removeAll(edgeIds);
        List<AbstractNodeDefinition> result = new ArrayList<>();
        if (!nodeIds.isEmpty()) {
            for (String id : nodeIds) {
                result.add(nodeStorage.get(id));
            }
        }
        return result;
    }

    /**
     * 检查游离边元素(未和任何其他组件相连)
     * @return
     */
    public List<EdgeDefinition> findFreeEdgeDefinition() {
        List<EdgeDefinition> edges = new ArrayList<>();
        for (EdgeDefinition edgeDefinition : edgeDefinitionList) {
            if (StringUtils.isEmpty(edgeDefinition.getSourceNodeId()) || StringUtils.isEmpty(edgeDefinition.getTargetNodeId())) {
                edges.add(edgeDefinition);
            }
        }
        return edges;
    }

    /**
     * 获取全部点元素ID
     * @return
     */
    private List<String> listNodeId() {
        List<String> nodeIds = new ArrayList<>();
        for (AbstractNodeDefinition nodeDefinition :nodeDefinitionList) {
            nodeIds.add(nodeDefinition.getId());
        }
        return nodeIds;
    }

    /**
     * 获取全部边元素ID
     * @return
     */
    private List<String> listEdgeId() {
        List<String> edgeIds = new ArrayList<>();
        for (EdgeDefinition edgeDefinition : edgeDefinitionList) {
            if (StringUtils.isNotEmpty(edgeDefinition.getSourceNodeId())) {
                edgeIds.add(edgeDefinition.getSourceNodeId());
            }
            if (StringUtils.isNotEmpty(edgeDefinition.getTargetNodeId())) {
                edgeIds.add(edgeDefinition.getTargetNodeId());
            }
        }
        return edgeIds;
    }

    /**
     * 检索开始点元素
     * @return
     */
    public List<AbstractNodeDefinition> findAllEntranceNode() {
        List<AbstractNodeDefinition> result = new ArrayList<>();
        for (AbstractNodeDefinition node : nodeDefinitionList) {
            if (!hasPreNode(node.getId())) {
                result.add(node);
            }
        }
        return result;
    }

    /**
     * 检索结束点元素
     * @return
     */
    public List<AbstractNodeDefinition> findAllEndNode() {
        List<AbstractNodeDefinition> result = new ArrayList<>();
        for (AbstractNodeDefinition node : nodeDefinitionList) {
            if (!hasNextNode(node.getId())) {
                result.add(node);
            }
        }
        return result;
    }

    /**
     * 检索一个边的源点元素
     * @param edgeDefinitionId
     * @return
     */
    public AbstractNodeDefinition findSourceNodeByEdgeDefinitionId(String edgeDefinitionId) {
        EdgeDefinition edgeDefinition = findEdgeById(edgeDefinitionId);
        return edgeDefinition == null ? null : nodeStorage.get(edgeDefinition.getSourceNodeId());
    }

    /**
     * 检索一个边的目标点元素
     * @param edgeDefinitionId
     * @return
     */
    public AbstractNodeDefinition findTargetNodeByEdgeDefinitionId(String edgeDefinitionId) {
        EdgeDefinition edgeDefinition = findEdgeById(edgeDefinitionId);
        return edgeDefinition == null ? null : nodeStorage.get(edgeDefinition.getTargetNodeId());
    }

    /**
     * 使用ID检索点元素
     * @param id
     * @return
     */
    public AbstractNodeDefinition findNodeById(String id) {
        return nodeStorage.get(id);
    }

    /**
     * 使用ID检索边元素
     * @param id
     * @return
     */
    public EdgeDefinition findEdgeById(String id) {
        return edgeStorage.get(id);
    }

    /**
     * 使用条件检索边元素
     * @param sourceNodeId 开始组件点
     * @param targetNodeId 结束组件点
     * @return
     * @throws PipelineDiagramException
     */
    public EdgeDefinition findEdgeByCondition(String sourceNodeId, String targetNodeId) throws PipelineDiagramException {
        if (StringUtils.isBlank(sourceNodeId) || StringUtils.isBlank(targetNodeId)) {
            throw new PipelineDiagramException("invalid param");
        }
        for (EdgeDefinition edgeDef : edgeDefinitionList) {
            if (sourceNodeId.equals(edgeDef.getSourceNodeId())
                    && targetNodeId.equals(edgeDef.getTargetNodeId())) {
                return edgeDef;
            }
        }
        return null;
    }

    /**
     * 检索下一层点元素
     * @param nodeDefinitionId
     * @return
     */
    public List<AbstractNodeDefinition> findNextNodeDefinition(String nodeDefinitionId) {
        List<AbstractNodeDefinition> result = new ArrayList<>();
        List<EdgeDefinition> edgeDefinitions = findBySourceNodeId(nodeDefinitionId);
        if (!edgeDefinitions.isEmpty()) {
            for (EdgeDefinition edgeDefinition : edgeDefinitions) {
                AbstractNodeDefinition nodeDefinition = nodeStorage.get(edgeDefinition.getTargetNodeId());
                if (nodeDefinition != null) {
                    result.add(nodeDefinition);
                }
            }
        }
        return result;
    }

    /**
     * 检索上一层点元素
     * @param nodeDefinitionId
     * @return
     */
    public List<AbstractNodeDefinition> findPreNodeDefinition(String nodeDefinitionId) {
        List<AbstractNodeDefinition> result = new ArrayList<>();
        List<EdgeDefinition> edgeDefinitions = findByTargetNodeId(nodeDefinitionId);
        if (!edgeDefinitions.isEmpty()) {
            for (EdgeDefinition edgeDefinition : edgeDefinitions) {
                result.add(nodeStorage.get(edgeDefinition.getSourceNodeId()));
            }
        }
        return result;
    }

    /**
     * 是否有下一层点元素
     * @param nodeId
     * @return
     */
    public boolean hasNextNode(String nodeId) {
        List<EdgeDefinition> result = findBySourceNodeId(nodeId);
        return result.isEmpty() ? false : true;
    }

    /**
     * 是否有上一层点元素
     * @param nodeId
     * @return
     */
    public boolean hasPreNode(String nodeId) {
        List<EdgeDefinition> result = findByTargetNodeId(nodeId);
        return result.isEmpty() ? false : true;
    }

    /**
     * 检索源点对应的边元素
     * @param sourceNodeId
     * @return
     */
    public List<EdgeDefinition> findBySourceNodeId(String sourceNodeId) {
        List<EdgeDefinition> result = new ArrayList<>();
        for (EdgeDefinition edgeDefinition : edgeDefinitionList) {
            if (sourceNodeId.equals(edgeDefinition.getSourceNodeId())) {
                result.add(edgeDefinition);
            }
        }
        return result;
    }

    /**
     * 检索目标点对应的边元素
     * @param targetNodeId
     * @return
     */
    public List<EdgeDefinition> findByTargetNodeId(String targetNodeId) {
        List<EdgeDefinition> result = new ArrayList<>();
        for (EdgeDefinition edgeDefinition : edgeDefinitionList) {
            if (targetNodeId.equals(edgeDefinition.getTargetNodeId())) {
                result.add(edgeDefinition);
            }
        }
        return result;
    }

    /**
     * 增加点元素
     * @param nodeDefinition 要增加的点元素
     */
    public void addNode(AbstractNodeDefinition nodeDefinition) throws PipelineDiagramException {
        if (nodeDefinition == null || StringUtils.isBlank(nodeDefinition.getId())) {
            throw new PipelineDiagramException("invalid param");
        }
        if (nodeStorage.get(nodeDefinition.getId()) != null) {
            throw new PipelineDiagramException("node definition id is exist");
        }
        nodeDefinitionList.add(nodeDefinition);
        nodeStorage.put(nodeDefinition.getId(), nodeDefinition);
    }

    /**
     * 增加边元素
     * @param edgeDefinition 要增加的边元素
     */
    public void addEdge(EdgeDefinition edgeDefinition) throws PipelineDiagramException {
        if (edgeDefinition == null || StringUtils.isBlank(edgeDefinition.getId())) {
            throw new PipelineDiagramException("invalid param");
        }
        if (edgeStorage.get(edgeDefinition.getId()) != null) {
            throw new PipelineDiagramException("edge definition id is exist");
        }
        edgeDefinitionList.add(edgeDefinition);
        edgeStorage.put(edgeDefinition.getId(), edgeDefinition);
    }

    /**
     * 移除点元素
     * @param nodeDefinitionId 要移除的点元素的ID
     */
    public void removeNode(String nodeDefinitionId) {
        nodeDefinitionList.remove(nodeStorage.get(nodeDefinitionId));
        nodeStorage.remove(nodeDefinitionId);
    }

    /**
     * 移除边元素
     * @param edgeDefinitionId 要移除的边元素的ID
     */
    public void removeEdge(String edgeDefinitionId) {
        edgeDefinitionList.remove(edgeStorage.get(edgeDefinitionId));
        edgeStorage.remove(edgeDefinitionId);
    }

    /**
     * 初始化nodeStorage
     */
    private void initNodeStorage() {
        if (this.nodeDefinitionList == null) {
            return;
        }
        for (AbstractNodeDefinition nodeDefinition : this.nodeDefinitionList) {
            nodeStorage.put(nodeDefinition.getId(), nodeDefinition);
        }
    }

    /**
     * 初始化edgeStorage
     */
    private void initEdgeStorage() {
        if (this.edgeDefinitionList == null) {
            return;
        }
        for (EdgeDefinition edgeDefinition : this.edgeDefinitionList) {
            edgeStorage.put(edgeDefinition.getId(), edgeDefinition);
        }
    }

    public Integer getPipelineId() {
        return pipelineId;
    }

    public void setPipelineId(Integer pipelineId) {
        this.pipelineId = pipelineId;
    }

    public Integer getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdater() {
        return updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public PipelineTerminationRuleDefinition getPipelineTerminationRuleDefinition() {
        return pipelineTerminationRuleDefinition;
    }

    public void setPipelineTerminationRuleDefinition(PipelineTerminationRuleDefinition pipelineTerminationRuleDefinition) {
        this.pipelineTerminationRuleDefinition = pipelineTerminationRuleDefinition;
    }

    public PipelineEnterRuleDefinition getPipelineEnterRuleDefinition() {
        return pipelineEnterRuleDefinition;
    }

    public void setPipelineEnterRuleDefinition(PipelineEnterRuleDefinition pipelineEnterRuleDefinition) {
        this.pipelineEnterRuleDefinition = pipelineEnterRuleDefinition;
    }

    public PipelineForbiddenRuleDefinition getPipelineForbiddenRuleDefinition() {
        return pipelineForbiddenRuleDefinition;
    }

    public void setPipelineForbiddenRuleDefinition(PipelineForbiddenRuleDefinition pipelineForbiddenRuleDefinition) {
        this.pipelineForbiddenRuleDefinition = pipelineForbiddenRuleDefinition;
    }

    public List<AbstractNodeDefinition> getNodeDefinitionList() {
        return nodeDefinitionList;
    }

    public void setNodeDefinitionList(List<AbstractNodeDefinition> nodeDefinitionList) {
        this.nodeDefinitionList = nodeDefinitionList;
        initNodeStorage();
    }

    public List<EdgeDefinition> getEdgeDefinitionList() {
        return edgeDefinitionList;
    }

    public void setEdgeDefinitionList(List<EdgeDefinition> edgeDefinitionList) {
        this.edgeDefinitionList = edgeDefinitionList;
        initEdgeStorage();
    }

    public List<AbstractNodeDefinition> getStartNodeDefinitionList() {
        return startNodeDefinitionList;
    }

    public void setStartNodeDefinitionList(List<AbstractNodeDefinition> startNodeDefinitionList) {
        this.startNodeDefinitionList = startNodeDefinitionList;
    }

    public PipelineDebugParam getDebugParam() {
        return debugParam;
    }

    public void setDebugParam(PipelineDebugParam debugParam) {
        this.debugParam = debugParam;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("PipelineDiagram{");
        sb.append("pipelineId=").append(pipelineId);
        sb.append(", campaignId=").append(campaignId);
        sb.append(", name='").append(name).append('\'');
        sb.append(", status=").append(status);
        sb.append(", version='").append(version).append('\'');
        sb.append(", startTime=").append(startTime);
        sb.append(", endTime=").append(endTime);
        sb.append(", description='").append(description).append('\'');
        sb.append(", tenantId='").append(tenantId).append('\'');
        sb.append(", creator='").append(creator).append('\'');
        sb.append(", createBy='").append(createBy).append('\'');
        sb.append(", createTime=").append(createTime);
        sb.append(", updater='").append(updater).append('\'');
        sb.append(", updateBy='").append(updateBy).append('\'');
        sb.append(", updateTime=").append(updateTime);
        sb.append(", pipelineTerminationRuleDefinition=").append(pipelineTerminationRuleDefinition);
        sb.append(", pipelineEnterRuleDefinition=").append(pipelineEnterRuleDefinition);
        sb.append(", pipelineForbiddenRuleDefinition=").append(pipelineForbiddenRuleDefinition);
        sb.append(", nodeDefinitionList=").append(nodeDefinitionList);
        sb.append(", edgeDefinitionList=").append(edgeDefinitionList);
        sb.append(", nodeStorage=").append(nodeStorage);
        sb.append(", edgeStorage=").append(edgeStorage);
        sb.append('}');
        return sb.toString();
    }
}
