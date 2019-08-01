package com.talkingdata.marketing.core.entity.dto;

/**
 * The type Effect campaign target cube.
 * @author xiaoming.kang
 */
public class EffectCampaignTargetCube {
    private Integer campaignId;
    private Integer targetId;
    private Long val;

    /**
     * Gets campaign id.
     *
     * @return the campaign id
     */
    public Integer getCampaignId() {
        return campaignId;
    }

    /**
     * Sets campaign id.
     *
     * @param campaignId the campaign id
     */
    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    /**
     * Gets target id.
     *
     * @return the target id
     */
    public Integer getTargetId() {
        return targetId;
    }

    /**
     * Sets target id.
     *
     * @param targetId the target id
     */
    public void setTargetId(Integer targetId) {
        this.targetId = targetId;
    }

    /**
     * Gets val.
     *
     * @return the val
     */
    public Long getVal() {
        return val;
    }

    /**
     * Sets val.
     *
     * @param val the val
     */
    public void setVal(Long val) {
        this.val = val;
    }
}
