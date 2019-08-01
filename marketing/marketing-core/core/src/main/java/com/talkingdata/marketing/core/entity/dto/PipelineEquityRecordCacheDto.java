package com.talkingdata.marketing.core.entity.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * 权益记录缓存
 * @author xiaoming.kang
 * Created by tend on 2017/9/18.
 */
public class PipelineEquityRecordCacheDto {

    private Integer campaignId;
    private Integer pipelineDefinitionId;
    private String equityCode;
    private List<String> equityValueList;

    /**
     * Instantiates a new Pipeline equity record cache dto.
     *
     * @param campaignId           the campaign id
     * @param pipelineDefinitionId the pipeline definition id
     * @param equityCode           the equity code
     */
    public PipelineEquityRecordCacheDto(Integer campaignId, Integer pipelineDefinitionId, String equityCode) {
        this.campaignId = campaignId;
        this.pipelineDefinitionId = pipelineDefinitionId;
        this.equityCode = equityCode;
        this.equityValueList = new ArrayList<>();
    }

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
     * Gets equity code.
     *
     * @return the equity code
     */
    public String getEquityCode() {
        return equityCode;
    }

    /**
     * Sets equity code.
     *
     * @param equityCode the equity code
     */
    public void setEquityCode(String equityCode) {
        this.equityCode = equityCode;
    }

    /**
     * Gets equity value list.
     *
     * @return the equity value list
     */
    public List<String> getEquityValueList() {
        return equityValueList;
    }

    /**
     * Sets equity value list.
     *
     * @param equityValueList the equity value list
     */
    public void setEquityValueList(List<String> equityValueList) {
        this.equityValueList = equityValueList;
    }
}
