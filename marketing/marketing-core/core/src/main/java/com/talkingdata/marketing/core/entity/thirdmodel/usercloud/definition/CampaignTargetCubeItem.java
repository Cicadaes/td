package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * The type Campaign target cube item.
 * @author xiaoming.kang
 * @create 2017 -05-04-上午10:25
 * @since JDK 1.8
 */
public class CampaignTargetCubeItem {

    private Integer cubeId;

    private String cubeCode;

    private String cubeName;

    private String cubeDesc;

    private Integer modelId;

    private String modelCode;

    private String creator;

    private String createBy;

    private String updateBy;

    private Long createTime;

    private Long updateTime;

    private String tenantId;

    private String dataAppId;

    private String cubeSparkSql;

    /**
     * Gets cube id.
     *
     * @return the cube id
     */
    public Integer getCubeId() {
        return cubeId;
    }

    /**
     * Sets cube id.
     *
     * @param cubeId the cube id
     */
    public void setCubeId(Integer cubeId) {
        this.cubeId = cubeId;
    }

    /**
     * Gets cube code.
     *
     * @return the cube code
     */
    public String getCubeCode() {
        return cubeCode;
    }

    /**
     * Sets cube code.
     *
     * @param cubeCode the cube code
     */
    public void setCubeCode(String cubeCode) {
        this.cubeCode = cubeCode;
    }

    /**
     * Gets cube name.
     *
     * @return the cube name
     */
    public String getCubeName() {
        return cubeName;
    }

    /**
     * Sets cube name.
     *
     * @param cubeName the cube name
     */
    public void setCubeName(String cubeName) {
        this.cubeName = cubeName;
    }

    /**
     * Gets cube desc.
     *
     * @return the cube desc
     */
    public String getCubeDesc() {
        return cubeDesc;
    }

    /**
     * Sets cube desc.
     *
     * @param cubeDesc the cube desc
     */
    public void setCubeDesc(String cubeDesc) {
        this.cubeDesc = cubeDesc;
    }

    /**
     * Gets model id.
     *
     * @return the model id
     */
    public Integer getModelId() {
        return modelId;
    }

    /**
     * Sets model id.
     *
     * @param modelId the model id
     */
    public void setModelId(Integer modelId) {
        this.modelId = modelId;
    }

    /**
     * Gets model code.
     *
     * @return the model code
     */
    public String getModelCode() {
        return modelCode;
    }

    /**
     * Sets model code.
     *
     * @param modelCode the model code
     */
    public void setModelCode(String modelCode) {
        this.modelCode = modelCode;
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
     * Gets data app id.
     *
     * @return the data app id
     */
    public String getDataAppId() {
        return dataAppId;
    }

    /**
     * Sets data app id.
     *
     * @param dataAppId the data app id
     */
    public void setDataAppId(String dataAppId) {
        this.dataAppId = dataAppId;
    }

    /**
     * Gets cube spark sql.
     *
     * @return the cube spark sql
     */
    public String getCubeSparkSql() {
        return cubeSparkSql;
    }

    /**
     * Sets cube spark sql.
     *
     * @param cubeSparkSql the cube spark sql
     */
    public void setCubeSparkSql(String cubeSparkSql) {
        this.cubeSparkSql = cubeSparkSql;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("cubeId", cubeId)
                .append("cubeCode", cubeCode)
                .append("cubeName", cubeName)
                .append("cubeDesc", cubeDesc)
                .append("modelId", modelId)
                .append("modelCode", modelCode)
                .append("creator", creator)
                .append("createBy", createBy)
                .append("updateBy", updateBy)
                .append("createTime", createTime)
                .append("updateTime", updateTime)
                .append("tenantId", tenantId)
                .append("dataAppId", dataAppId)
                .append("cubeSparkSql", cubeSparkSql)
                .toString();
    }
}
