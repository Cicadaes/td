package com.talkingdata.marketing.core.page.dto;

import java.util.Date;

/**
 * Created by zmy on 10/16/2017.
 * @author xiaoming.kang
 */
public class EquityConfigDto {
    private Integer id;
    private Integer campaignId;
    private String code;
    private String name;
    private Integer total;
    private String attachmentName;
    private Integer attachmentId;
    private String tenantId;
    private String creator;
    private Date createTime;
    private String updater;
    private String updaterBy;
    private Date updateTime;
    private String createBy;
    /**剩余量*/
    private Integer remain;

    /**
     * Gets id.
     *
     * @return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(Integer id) {
        this.id = id;
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
     * Gets code.
     *
     * @return the code
     */
    public String getCode() {
        return code;
    }

    /**
     * Sets code.
     *
     * @param code the code
     */
    public void setCode(String code) {
        this.code = code;
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
     * Gets total.
     *
     * @return the total
     */
    public Integer getTotal() {
        return total;
    }

    /**
     * Sets total.
     *
     * @param total the total
     */
    public void setTotal(Integer total) {
        this.total = total;
    }

    /**
     * Gets attachment name.
     *
     * @return the attachment name
     */
    public String getAttachmentName() {
        return attachmentName;
    }

    /**
     * Sets attachment name.
     *
     * @param attachmentName the attachment name
     */
    public void setAttachmentName(String attachmentName) {
        this.attachmentName = attachmentName;
    }

    /**
     * Gets attachment id.
     *
     * @return the attachment id
     */
    public Integer getAttachmentId() {
        return attachmentId;
    }

    /**
     * Sets attachment id.
     *
     * @param attachmentId the attachment id
     */
    public void setAttachmentId(Integer attachmentId) {
        this.attachmentId = attachmentId;
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
     * Gets updater by.
     *
     * @return the updater by
     */
    public String getUpdaterBy() {
        return updaterBy;
    }

    /**
     * Sets updater by.
     *
     * @param updaterBy the updater by
     */
    public void setUpdaterBy(String updaterBy) {
        this.updaterBy = updaterBy;
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
     * Gets remain.
     *
     * @return the remain
     */
    public Integer getRemain() {
        return remain;
    }

    /**
     * Sets remain.
     *
     * @param remain the remain
     */
    public void setRemain(Integer remain) {
        this.remain = remain;
    }
}
