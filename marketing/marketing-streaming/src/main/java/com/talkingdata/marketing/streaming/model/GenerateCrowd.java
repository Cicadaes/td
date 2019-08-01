package com.talkingdata.marketing.streaming.model;

/**
 * @author tingwen.liu
 * @create 2018-03-14
 * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
 */
public class GenerateCrowd {

    private Integer campaignId;
    private Integer pipelineId;
    private Integer offset;

    public GenerateCrowd(Integer campaignId, Integer pipelineId, Integer offset) {
        this.campaignId = campaignId;
        this.pipelineId = pipelineId;
        this.offset = offset;
    }

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

    public Integer getOffset() {
        return offset;
    }

    public void setOffset(Integer offset) {
        this.offset = offset;
    }
}
