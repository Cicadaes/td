package com.talkingdata.marketing.core.page.dto;

import java.util.Date;

/**
 * Created by zmy on 10/16/2017.
 * @author xiaoming.kang
 */
public class PipelineEquityConfigDefinitionDto {
    private Integer id;
    private Integer pipelineDefinitionId;
    private Integer equityConfigId;
    private String name;
    private String code;
    private Integer count;
    private Float precent;
    private String tenantId;
    private String creator;
    private String createBy;
    private Date createTime;
    private String updater;
    private String updateBy;
    private Date updateTime;
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
     * Gets equity config id.
     *
     * @return the equity config id
     */
    public Integer getEquityConfigId() {
        return equityConfigId;
    }

    /**
     * Sets equity config id.
     *
     * @param equityConfigId the equity config id
     */
    public void setEquityConfigId(Integer equityConfigId) {
        this.equityConfigId = equityConfigId;
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
     * Gets count.
     *
     * @return the count
     */
    public Integer getCount() {
        return count;
    }

    /**
     * Sets count.
     *
     * @param count the count
     */
    public void setCount(Integer count) {
        this.count = count;
    }

    /**
     * Gets precent.
     *
     * @return the precent
     */
    public Float getPrecent() {
        return precent;
    }

    /**
     * Sets precent.
     *
     * @param precent the precent
     */
    public void setPrecent(Float precent) {
        this.precent = precent;
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
