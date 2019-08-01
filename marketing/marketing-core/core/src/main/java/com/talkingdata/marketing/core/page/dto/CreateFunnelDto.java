package com.talkingdata.marketing.core.page.dto;

import com.talkingdata.marketing.core.entity.admin.extend.FunnelStepDefinitionExt;
import java.util.Date;
import java.util.List;

/**
 * The type Create funnel dto.
 * @author xiaoming.kang
 * @create 2017 -05-02-下午2:19
 * @since JDK 1.8
 */
public class CreateFunnelDto {
    private Integer campaignFunnelConfigId;

    private Integer funnelDefinitionId;

    private Integer campaignId;

    private Integer defaultFlag;

    private String funnelName;

    private List<FunnelStepDefinitionExt> funnelStepDefinitionExts;

    private String tenantId;

    private String creator;

    private String createBy;

    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    private String updater;

    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")

    private Date updateTime;

    /**
     * Gets campaign funnel config id.
     *
     * @return the campaign funnel config id
     */
    public Integer getCampaignFunnelConfigId() {
        return campaignFunnelConfigId;
    }

    /**
     * Sets campaign funnel config id.
     *
     * @param campaignFunnelConfigId the campaign funnel config id
     */
    public void setCampaignFunnelConfigId(Integer campaignFunnelConfigId) {
        this.campaignFunnelConfigId = campaignFunnelConfigId;
    }

    /**
     * Gets funnel definition id.
     *
     * @return the funnel definition id
     */
    public Integer getFunnelDefinitionId() {
        return funnelDefinitionId;
    }

    /**
     * Sets funnel definition id.
     *
     * @param funnelDefinitionId the funnel definition id
     */
    public void setFunnelDefinitionId(Integer funnelDefinitionId) {
        this.funnelDefinitionId = funnelDefinitionId;
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
     * Gets default flag.
     *
     * @return the default flag
     */
    public Integer getDefaultFlag() {
        return defaultFlag;
    }

    /**
     * Sets default flag.
     *
     * @param defaultFlag the default flag
     */
    public void setDefaultFlag(Integer defaultFlag) {
        this.defaultFlag = defaultFlag;
    }

    /**
     * Gets funnel name.
     *
     * @return the funnel name
     */
    public String getFunnelName() {
        return funnelName;
    }

    /**
     * Sets funnel name.
     *
     * @param funnelName the funnel name
     */
    public void setFunnelName(String funnelName) {
        this.funnelName = funnelName;
    }

    /**
     * Gets funnel step definition exts.
     *
     * @return the funnel step definition exts
     */
    public List<FunnelStepDefinitionExt> getFunnelStepDefinitionExts() {
        return funnelStepDefinitionExts;
    }

    /**
     * Sets funnel step definition exts.
     *
     * @param funnelStepDefinitionExts the funnel step definition exts
     */
    public void setFunnelStepDefinitionExts(List<FunnelStepDefinitionExt> funnelStepDefinitionExts) {
        this.funnelStepDefinitionExts = funnelStepDefinitionExts;
    }

    /**
     * Gets tenant id.
     *
     * @return the tenant id
     */
    public String getTenantId() {
        return tenantId;
    }

    /**
     * Sets tenant id.
     *
     * @param tenantId the tenant id
     */
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    /**
     * Gets creator.
     *
     * @return the creator
     */
    public String getCreator() {
        return creator;
    }

    /**
     * Sets creator.
     *
     * @param creator the creator
     */
    public void setCreator(String creator) {
        this.creator = creator;
    }

    /**
     * Gets create by.
     *
     * @return the create by
     */
    public String getCreateBy() {
        return createBy;
    }

    /**
     * Sets create by.
     *
     * @param createBy the create by
     */
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    /**
     * Gets create time.
     *
     * @return the create time
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * Sets create time.
     *
     * @param createTime the create time
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * Gets updater.
     *
     * @return the updater
     */
    public String getUpdater() {
        return updater;
    }

    /**
     * Sets updater.
     *
     * @param updater the updater
     */
    public void setUpdater(String updater) {
        this.updater = updater;
    }

    /**
     * Gets update by.
     *
     * @return the update by
     */
    public String getUpdateBy() {
        return updateBy;
    }

    /**
     * Sets update by.
     *
     * @param updateBy the update by
     */
    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    /**
     * Gets update time.
     *
     * @return the update time
     */
    public Date getUpdateTime() {
        return updateTime;
    }

    /**
     * Sets update time.
     *
     * @param updateTime the update time
     */
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}
