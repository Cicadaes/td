package com.talkingdata.marketing.batch.bean;

/**
 * @author Created by tend on 2017/11/10.
 */
public class MessageData {
    private Integer campaignId;
    private Integer pipelineDefinitionId;
    private String version;
    private String nodeId;
    private String id;
    private Integer sentType;
    private String time;

    public MessageData() {
    }

    public MessageData(Integer campaignId, Integer pipelineDefinitionId, String version, String nodeId, String id, Integer sentType, String time) {
        this.campaignId = campaignId;
        this.pipelineDefinitionId = pipelineDefinitionId;
        this.version = version;
        this.nodeId = nodeId;
        this.id = id;
        this.sentType = sentType;
        this.time = time;
    }

    public Integer getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    public Integer getPipelineDefinitionId() {
        return pipelineDefinitionId;
    }

    public void setPipelineDefinitionId(Integer pipelineDefinitionId) {
        this.pipelineDefinitionId = pipelineDefinitionId;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getNodeId() {
        return nodeId;
    }

    public void setNodeId(String nodeId) {
        this.nodeId = nodeId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getSentType() {
        return sentType;
    }

    public void setSentType(Integer sentType) {
        this.sentType = sentType;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    @Override
    public String toString() {
        return "MessageData{" +
                "campaignId=" + campaignId +
                ", pipelineDefinitionId=" + pipelineDefinitionId +
                ", version='" + version + '\'' +
                ", nodeId='" + nodeId + '\'' +
                ", id='" + id + '\'' +
                ", sentType=" + sentType +
                ", time=" + time +
                '}';
    }
}
