package com.talkingdata.marketing.core.entity.thirdmodel.config;

import java.util.Date;

/**
 * The type Dic.
 * @author xiaoming.kang
 */
public class Dic {
    private Long id;
    private Long dicId;
    private String dicItemKey;
    private String dicItemValue;
    private Long parentId;
    private String createBy;
    private String creator;
    private String updateBy;
    private Date createTime;
    private Date updateTime;
    private String dicItems;

    /**
     * Gets id.
     *
     * @return the id
     */
    public Long getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets dic id.
     *
     * @return the dic id
     */
    public Long getDicId() {
        return dicId;
    }

    /**
     * Sets dic id.
     *
     * @param dicId the dic id
     */
    public void setDicId(Long dicId) {
        this.dicId = dicId;
    }

    /**
     * Gets dic item key.
     *
     * @return the dic item key
     */
    public String getDicItemKey() {
        return dicItemKey;
    }

    /**
     * Sets dic item key.
     *
     * @param dicItemKey the dic item key
     */
    public void setDicItemKey(String dicItemKey) {
        this.dicItemKey = dicItemKey;
    }

    /**
     * Gets dic item value.
     *
     * @return the dic item value
     */
    public String getDicItemValue() {
        return dicItemValue;
    }

    /**
     * Sets dic item value.
     *
     * @param dicItemValue the dic item value
     */
    public void setDicItemValue(String dicItemValue) {
        this.dicItemValue = dicItemValue;
    }

    /**
     * Gets parent id.
     *
     * @return the parent id
     */
    public Long getParentId() {
        return parentId;
    }

    /**
     * Sets parent id.
     *
     * @param parentId the parent id
     */
    public void setParentId(Long parentId) {
        this.parentId = parentId;
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
     * Gets dic items.
     *
     * @return the dic items
     */
    public String getDicItems() {
        return dicItems;
    }

    /**
     * Sets dic items.
     *
     * @param dicItems the dic items
     */
    public void setDicItems(String dicItems) {
        this.dicItems = dicItems;
    }
}
