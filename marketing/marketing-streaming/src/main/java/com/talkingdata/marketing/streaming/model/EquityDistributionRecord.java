package com.talkingdata.marketing.streaming.model;

/**
 * 权益发放记录
 *
 * @author hongsheng
 * @create 2017-12-07-下午2:11
 * @since JDK 1.8
 */
public class EquityDistributionRecord {
    /**
     * 类型(tdId,mobileId)
     */
    private String idType;
    /**
     * 用户唯一标识，如DeviceId
     */
    private String userId;
    /**
     * 营销活动ID
     */
    private Integer campaignId;
    /**
     * 营销流程定义ID
     */
    private Integer pipelineDefinitionId;
    /**
     * 版本
     */
    private String version;
    /**
     * 营销流程节点ID
     */
    private String pipelineNodeId;
    /**
     * 发放时间
     */
    private String issuanceTime;
    /**
     * 权益名称
     */
    private String equityName;
    /**
     * 权益编码
     */
    private String equityCode;
    /**
     * 权益值
     */
    private String equityValue;

    public EquityDistributionRecord() {}

    public EquityDistributionRecord(String idType, String userId, Integer campaignId, Integer pipelineDefinitionId, String version, String pipelineNodeId,
        String issuanceTime, String equityName, String equityCode, String equityValue) {
        this.idType = idType;
        this.userId = userId;
        this.campaignId = campaignId;
        this.pipelineDefinitionId = pipelineDefinitionId;
        this.version = version;
        this.pipelineNodeId = pipelineNodeId;
        this.issuanceTime = issuanceTime;
        this.equityName = equityName;
        this.equityCode = equityCode;
        this.equityValue = equityValue;
    }

    public String getIdType() {
        return idType;
    }

    public void setIdType(String idType) {
        this.idType = idType;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    public String getPipelineNodeId() {
        return pipelineNodeId;
    }

    public void setPipelineNodeId(String pipelineNodeId) {
        this.pipelineNodeId = pipelineNodeId;
    }

    public String getIssuanceTime() {
        return issuanceTime;
    }

    public void setIssuanceTime(String issuanceTime) {
        this.issuanceTime = issuanceTime;
    }

    public String getEquityName() {
        return equityName;
    }

    public void setEquityName(String equityName) {
        this.equityName = equityName;
    }

    public String getEquityCode() {
        return equityCode;
    }

    public void setEquityCode(String equityCode) {
        this.equityCode = equityCode;
    }

    public String getEquityValue() {
        return equityValue;
    }

    public void setEquityValue(String equityValue) {
        this.equityValue = equityValue;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("EquityDistributionRecord{");
        sb.append("idType='").append(idType).append('\'');
        sb.append(", userId='").append(userId).append('\'');
        sb.append(", campaignId=").append(campaignId);
        sb.append(", pipelineDefinitionId=").append(pipelineDefinitionId);
        sb.append(", version='").append(version).append('\'');
        sb.append(", pipelineNodeId='").append(pipelineNodeId).append('\'');
        sb.append(", issuanceTime='").append(issuanceTime).append('\'');
        sb.append(", equityName='").append(equityName).append('\'');
        sb.append(", equityCode='").append(equityCode).append('\'');
        sb.append(", equityValue='").append(equityValue).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
