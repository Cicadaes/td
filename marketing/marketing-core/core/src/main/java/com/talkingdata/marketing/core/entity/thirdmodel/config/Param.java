package com.talkingdata.marketing.core.entity.thirdmodel.config;

import java.util.Date;

/**
 * The type Param.
 * @author xiaoming.kang
 */
public class Param {
    private Long id;
    private String paramKey;
    private String paramValue;
    private String description;
    private String systemCode;
    private String createBy;
    private String creator;
    private String updateBy;
    private Date createTime;
    private Date updateTime;
    private Boolean isPassword;
    private String oldPassword;
    private String newPassword;

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
     * Gets param key.
     *
     * @return the param key
     */
    public String getParamKey() {
        return paramKey;
    }

    /**
     * Sets param key.
     *
     * @param paramKey the param key
     */
    public void setParamKey(String paramKey) {
        this.paramKey = paramKey;
    }

    /**
     * Gets param value.
     *
     * @return the param value
     */
    public String getParamValue() {
        return paramValue;
    }

    /**
     * Sets param value.
     *
     * @param paramValue the param value
     */
    public void setParamValue(String paramValue) {
        this.paramValue = paramValue;
    }

    /**
     * Gets description.
     *
     * @return the description
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets description.
     *
     * @param description the description
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * Gets system code.
     *
     * @return the system code
     */
    public String getSystemCode() {
        return systemCode;
    }

    /**
     * Sets system code.
     *
     * @param systemCode the system code
     */
    public void setSystemCode(String systemCode) {
        this.systemCode = systemCode;
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
     * Gets password.
     *
     * @return the password
     */
    public Boolean getPassword() {
        return isPassword;
    }

    /**
     * Sets password.
     *
     * @param password the password
     */
    public void setPassword(Boolean password) {
        isPassword = password;
    }

    /**
     * Gets old password.
     *
     * @return the old password
     */
    public String getOldPassword() {
        return oldPassword;
    }

    /**
     * Sets old password.
     *
     * @param oldPassword the old password
     */
    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    /**
     * Gets new password.
     *
     * @return the new password
     */
    public String getNewPassword() {
        return newPassword;
    }

    /**
     * Sets new password.
     *
     * @param newPassword the new password
     */
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
