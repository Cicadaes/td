package com.talkingdata.marketing.streaming.pipeline.definition.node;

import java.util.List;
import java.util.Map;

/**
 * 组件-边(连接2个点组件)
 * @author sheng.hong
 * @create 2017-08-17-下午5:09
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getPipelineDefinitionId() {
        return pipelineDefinitionId;
    }

    public void setPipelineDefinitionId(Integer pipelineDefinitionId) {
        this.pipelineDefinitionId = pipelineDefinitionId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    public String getSourceNodeId() {
        return sourceNodeId;
    }

    public void setSourceNodeId(String sourceNodeId) {
        this.sourceNodeId = sourceNodeId;
    }

    public String getTargetNodeId() {
        return targetNodeId;
    }

    public void setTargetNodeId(String targetNodeId) {
        this.targetNodeId = targetNodeId;
    }

    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public List<Map<String, String>> getVertices() {
        return vertices;
    }

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

