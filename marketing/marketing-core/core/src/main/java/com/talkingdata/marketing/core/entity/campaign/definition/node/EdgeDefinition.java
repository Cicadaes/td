package com.talkingdata.marketing.core.entity.campaign.definition.node;

import java.util.List;
import java.util.Map;

/**
 * 组件-边(连接2个点组件)
 *
 * @author armeng
 * @create 2017 -08-17-下午5:09
 * @since JDK 1.8
 */
public class EdgeDefinition {
    /**主键*/
    private String id;
    /**pipeline Def ID*/
    private Integer pipelineDefinitionId;
    /**名称*/
    private String name;
    /**逻辑关系*/
    private String expression;
    /**原始组件点*/
    private String sourceNodeId;
    /**目标组件点*/
    private String targetNodeId;
    /**
     * index 在分支名重复或者分支名没填的情况下，前端用于区分分支
     */
    private String index;

    private String x;

    private String y;

    private List<Map<String, String>> vertices;

    /**
     * Gets id.
     *
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Gets pipeline definition id.
     *
     * @return the pipeline definition id
     */
    public Integer getPipelineDefinitionId() {
        return pipelineDefinitionId;
    }

    /**
     * Sets pipeline definition id.
     *
     * @param pipelineDefinitionId the pipeline definition id
     */
    public void setPipelineDefinitionId(Integer pipelineDefinitionId) {
        this.pipelineDefinitionId = pipelineDefinitionId;
    }

    /**
     * Gets name.
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name.
     *
     * @param name the name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets expression.
     *
     * @return the expression
     */
    public String getExpression() {
        return expression;
    }

    /**
     * Sets expression.
     *
     * @param expression the expression
     */
    public void setExpression(String expression) {
        this.expression = expression;
    }

    /**
     * Gets source node id.
     *
     * @return the source node id
     */
    public String getSourceNodeId() {
        return sourceNodeId;
    }

    /**
     * Sets source node id.
     *
     * @param sourceNodeId the source node id
     */
    public void setSourceNodeId(String sourceNodeId) {
        this.sourceNodeId = sourceNodeId;
    }

    /**
     * Gets target node id.
     *
     * @return the target node id
     */
    public String getTargetNodeId() {
        return targetNodeId;
    }

    /**
     * Sets target node id.
     *
     * @param targetNodeId the target node id
     */
    public void setTargetNodeId(String targetNodeId) {
        this.targetNodeId = targetNodeId;
    }

    /**
     * Gets x.
     *
     * @return the x
     */
    public String getX() {
        return x;
    }

    /**
     * Sets x.
     *
     * @param x the x
     */
    public void setX(String x) {
        this.x = x;
    }

    /**
     * Gets y.
     *
     * @return the y
     */
    public String getY() {
        return y;
    }

    /**
     * Sets y.
     *
     * @param y the y
     */
    public void setY(String y) {
        this.y = y;
    }

    /**
     * Gets index.
     *
     * @return the index
     */
    public String getIndex() {
        return index;
    }

    /**
     * Sets index.
     *
     * @param index the index
     */
    public void setIndex(String index) {
        this.index = index;
    }

    /**
     * Gets vertices.
     *
     * @return the vertices
     */
    public List<Map<String, String>> getVertices() {
        return vertices;
    }

    /**
     * Sets vertices.
     *
     * @param vertices the vertices
     */
    public void setVertices(List<Map<String, String>> vertices) {
        this.vertices = vertices;
    }

    @Override
    public String toString() {
        return "EdgeDefinition{" +
                "id='" + id + '\'' +
                ", pipelineDefinitionId=" + pipelineDefinitionId +
                ", name='" + name + '\'' +
                ", expression='" + expression + '\'' +
                ", sourceNodeId='" + sourceNodeId + '\'' +
                ", targetNodeId='" + targetNodeId + '\'' +
                ", index='" + index + '\'' +
                ", x='" + x + '\'' +
                ", y='" + y + '\'' +
                ", vertices=" + vertices +
                '}';
    }
}
