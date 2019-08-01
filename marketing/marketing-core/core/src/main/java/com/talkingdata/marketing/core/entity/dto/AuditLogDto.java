package com.talkingdata.marketing.core.entity.dto;

import com.talkingdata.marketing.core.constant.ParamConstants;

/**
 * Created by armeng on 2018/01/18.
 *
 * @author xiaoming.kang
 */
public class AuditLogDto {

    private String systemCode = ParamConstants.SYSTEM_CODE;
    private Long createTime = System.currentTimeMillis();
    /**
     * //dmpuser@talkingdata.com
     */
    private String actorUmId;
    private String actorName;
    /**
     * create query delete  update?c
     */
    private String operationType;
    /**
     * //crowd  campaign
     */
    private String targetType;
    /**
     * //id
     */
    private String targetId;
    /**
     * //success   error
     */
    private String result;
    /**
     * json串.
     */
    private String description;
    private String tenantId;
    private String projectId;
    private String beforeValue;
    private String afterValue;
    private String exception;
    private String returnValue;

    /**
     * Instantiates a new Audit log dto.
     */
    public AuditLogDto() {

    }

    /**
     * Gets system code.
     *
     * @return the system code
     */
    public String getSystemCode() {
        return this.systemCode;
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
     * Gets create time.
     *
     * @return the create time
     */
    public Long getCreateTime() {
        return createTime;
    }

    /**
     * Sets create time.
     *
     * @param createTime the create time
     */
    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    /**
     * Gets actor um id.
     *
     * @return the actor um id
     */
    public String getActorUmId() {
        return this.actorUmId;
    }

    /**
     * Sets actor um id.
     *
     * @param actorUmId the actor um id
     */
    public void setActorUmId(String actorUmId) {
        this.actorUmId = actorUmId;
    }

    /**
     * Gets actor name.
     *
     * @return the actor name
     */
    public String getActorName() {
        return this.actorName;
    }

    /**
     * Sets actor name.
     *
     * @param actorName the actor name
     */
    public void setActorName(String actorName) {
        this.actorName = actorName;
    }

    /**
     * Gets operation type.
     *
     * @return the operation type
     */
    public String getOperationType() {
        return this.operationType;
    }

    /**
     * Sets operation type.
     *
     * @param operationType the operation type
     */
    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    /**
     * Gets target type.
     *
     * @return the target type
     */
    public String getTargetType() {
        return this.targetType;
    }

    /**
     * Sets target type.
     *
     * @param targetType the target type
     */
    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    /**
     * Gets target id.
     *
     * @return the target id
     */
    public String getTargetId() {
        return this.targetId;
    }

    /**
     * Sets target id.
     *
     * @param targetId the target id
     */
    public void setTargetId(String targetId) {
        this.targetId = targetId;
    }

    /**
     * Gets result.
     *
     * @return the result
     */
    public String getResult() {
        return this.result;
    }

    /**
     * Sets result.
     *
     * @param result the result
     */
    public void setResult(String result) {
        this.result = result;
    }

    /**
     * Gets description.
     *
     * @return the description
     */
    public String getDescription() {
        return this.description;
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
     * Gets project id.
     *
     * @return the project id
     */
    public String getProjectId() {
        return projectId;
    }

    /**
     * Sets project id.
     *
     * @param projectId the project id
     */
    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    /**
     * Gets before value.
     *
     * @return the before value
     */
    public String getBeforeValue() {
        return beforeValue;
    }

    /**
     * Sets before value.
     *
     * @param beforeValue the before value
     */
    public void setBeforeValue(String beforeValue) {
        this.beforeValue = beforeValue;
    }

    /**
     * Gets after value.
     *
     * @return the after value
     */
    public String getAfterValue() {
        return afterValue;
    }

    /**
     * Sets after value.
     *
     * @param afterValue the after value
     */
    public void setAfterValue(String afterValue) {
        this.afterValue = afterValue;
    }

    /**
     * Gets exception.
     *
     * @return the exception
     */
    public String getException() {
        return exception;
    }

    /**
     * Sets exception.
     *
     * @param exception the exception
     */
    public void setException(String exception) {
        this.exception = exception;
    }

    /**
     * Gets return value.
     *
     * @return the return value
     */
    public String getReturnValue() {
        return returnValue;
    }

    /**
     * Sets return value.
     *
     * @param returnValue the return value
     */
    public void setReturnValue(String returnValue) {
        this.returnValue = returnValue;
    }

}
