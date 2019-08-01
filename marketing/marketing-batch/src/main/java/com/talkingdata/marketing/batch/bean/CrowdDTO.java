package com.talkingdata.marketing.batch.bean;

import java.util.Date;

/**
 * @author Created by tend on 2017/11/21.
 */
public class CrowdDTO {
    /**
     * 活动ID
     */
    private Integer campaignId;
    /**
     * pipelineID
     */
    private Integer pipelineId;
    /**
     * 人群ID
     */
    private Integer crowdId;
    /**
     * 用户管家人群ID
     */
    private Integer refId;
    /**
     * 计算类型(1-永不，2-实时，3-周期性)
     */
    private Integer calcType;
    /**
     * 周期数(天)
     */
    private Integer calcPeriod;
    /**
     * 最后一次计算时间
     */
    @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date calcTime;

    public Integer getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    public Integer getPipelineId() {
        return pipelineId;
    }

    public void setPipelineId(Integer pipelineId) {
        this.pipelineId = pipelineId;
    }

    public Integer getCrowdId() {
        return crowdId;
    }

    public void setCrowdId(Integer crowdId) {
        this.crowdId = crowdId;
    }

    public Integer getRefId() {
        return refId;
    }

    public void setRefId(Integer refId) {
        this.refId = refId;
    }

    public Integer getCalcPeriod() {
        return calcPeriod;
    }

    public void setCalcPeriod(Integer calcPeriod) {
        this.calcPeriod = calcPeriod;
    }

    public Date getCalcTime() {
        return calcTime;
    }

    public void setCalcTime(Date calcTime) {
        this.calcTime = calcTime;
    }

    public Integer getCalcType() {
        return calcType;
    }

    public void setCalcType(Integer calcType) {
        this.calcType = calcType;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("CrowdDTO{");
        sb.append("campaignId=").append(campaignId);
        sb.append(", pipelineId=").append(pipelineId);
        sb.append(", crowdId=").append(crowdId);
        sb.append(", refId=").append(refId);
        sb.append(", calcType=").append(calcType);
        sb.append(", calcPeriod=").append(calcPeriod);
        sb.append(", calcTime=").append(calcTime);
        sb.append('}');
        return sb.toString();
    }
}
