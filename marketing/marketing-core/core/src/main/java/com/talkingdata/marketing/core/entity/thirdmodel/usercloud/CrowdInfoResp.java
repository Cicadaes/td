package com.talkingdata.marketing.core.entity.thirdmodel.usercloud;

/**
 * The type Crowd info resp.
 * @author xiaoming.kang
 */
public class CrowdInfoResp {
    private Integer id;
    private Long updateTime;
    private Long updateDataTime;
    private String name;
    private String description;
    private Integer crowdCount;
    private Integer calcStatus;
    private String code;
    private Integer status;
    private String touchPointType;
    private String tenantId;
    private Integer source;
    private String accountIdType;

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
     * Gets update time.
     *
     * @return the update time
     */
    public Long getUpdateTime() {
        return updateTime;
    }

    /**
     * Sets update time.
     *
     * @param updateTime the update time
     */
    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    /**
     * Gets update data time.
     *
     * @return the update data time
     */
    public Long getUpdateDataTime() {
        return updateDataTime;
    }

    /**
     * Sets update data time.
     *
     * @param updateDataTime the update data time
     */
    public void setUpdateDataTime(Long updateDataTime) {
        this.updateDataTime = updateDataTime;
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
     * Gets crowd count.
     *
     * @return the crowd count
     */
    public Integer getCrowdCount() {
        return crowdCount;
    }

    /**
     * Sets crowd count.
     *
     * @param crowdCount the crowd count
     */
    public void setCrowdCount(Integer crowdCount) {
        this.crowdCount = crowdCount;
    }

    /**
     * Gets calc status.
     *
     * @return the calc status
     */
    public Integer getCalcStatus() {
        return calcStatus;
    }

    /**
     * Sets calc status.
     *
     * @param calcStatus the calc status
     */
    public void setCalcStatus(Integer calcStatus) {
        this.calcStatus = calcStatus;
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
     * Gets status.
     *
     * @return the status
     */
    public Integer getStatus() {
        return status;
    }

    /**
     * Sets status.
     *
     * @param status the status
     */
    public void setStatus(Integer status) {
        this.status = status;
    }

    /**
     * Gets touch point type.
     *
     * @return the touch point type
     */
    public String getTouchPointType() {
        return touchPointType;
    }

    /**
     * Sets touch point type.
     *
     * @param touchPointType the touch point type
     */
    public void setTouchPointType(String touchPointType) {
        this.touchPointType = touchPointType;
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
     * Gets source.
     *
     * @return the source
     */
    public Integer getSource() {
        return source;
    }

    /**
     * Sets source.
     *
     * @param source the source
     */
    public void setSource(Integer source) {
        this.source = source;
    }

    /**
     * Gets account id type.
     *
     * @return the account id type
     */
    public String getAccountIdType() {
        return accountIdType;
    }

    /**
     * Sets account id type.
     *
     * @param accountIdType the account id type
     */
    public void setAccountIdType(String accountIdType) {
        this.accountIdType = accountIdType;
    }

    @Override
    public String toString() {
        return "CrowdInfoResp{" + "id=" + id + ", updateTime=" + updateTime + ", updateDataTime=" + updateDataTime + ", name='" + name + '\''
                + ", description='" + description + '\'' + ", crowdCount=" + crowdCount + ", calcStatus=" + calcStatus + ", code='" + code + '\''
                + ", status=" + status + ", touchPointType='" + touchPointType + '\'' + ", tenantId='" + tenantId + '\'' + ", source=" + source
                + ", accountIdType='" + accountIdType + '\'' + '}';
    }
}
