package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.definition;

import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * The type Funnel event.
 * @author xiaoming.kang
 *
 * @create 2017 -05-04-上午11:44
 * @since JDK 1.8
 */
public class FunnelEvent {

    private Integer id;

    private String attributeValue;

    private String attributeValueAlias;

    private String accountIdType;

    private String phyTableCode;

    private String phyTableColumn;

    private String metaObjectCode;

    private String attributeCode;

    private String tenantId;

    private String createBy;

    private String creator;

    private String updateBy;

    private Long createTime;

    private Long updateTime;

    private String attributeName;

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
     * Gets attribute value.
     *
     * @return the attribute value
     */
    public String getAttributeValue() {
        return attributeValue;
    }

    /**
     * Sets attribute value.
     *
     * @param attributeValue the attribute value
     */
    public void setAttributeValue(String attributeValue) {
        this.attributeValue = attributeValue;
    }

    /**
     * Gets attribute value alias.
     *
     * @return the attribute value alias
     */
    public String getAttributeValueAlias() {
        return attributeValueAlias;
    }

    /**
     * Sets attribute value alias.
     *
     * @param attributeValueAlias the attribute value alias
     */
    public void setAttributeValueAlias(String attributeValueAlias) {
        this.attributeValueAlias = attributeValueAlias;
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

    /**
     * Gets phy table code.
     *
     * @return the phy table code
     */
    public String getPhyTableCode() {
        return phyTableCode;
    }

    /**
     * Sets phy table code.
     *
     * @param phyTableCode the phy table code
     */
    public void setPhyTableCode(String phyTableCode) {
        this.phyTableCode = phyTableCode;
    }

    /**
     * Gets phy table column.
     *
     * @return the phy table column
     */
    public String getPhyTableColumn() {
        return phyTableColumn;
    }

    /**
     * Sets phy table column.
     *
     * @param phyTableColumn the phy table column
     */
    public void setPhyTableColumn(String phyTableColumn) {
        this.phyTableColumn = phyTableColumn;
    }

    /**
     * Gets meta object code.
     *
     * @return the meta object code
     */
    public String getMetaObjectCode() {
        return metaObjectCode;
    }

    /**
     * Sets meta object code.
     *
     * @param metaObjectCode the meta object code
     */
    public void setMetaObjectCode(String metaObjectCode) {
        this.metaObjectCode = metaObjectCode;
    }

    /**
     * Gets attribute code.
     *
     * @return the attribute code
     */
    public String getAttributeCode() {
        return attributeCode;
    }

    /**
     * Sets attribute code.
     *
     * @param attributeCode the attribute code
     */
    public void setAttributeCode(String attributeCode) {
        this.attributeCode = attributeCode;
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
     * Gets attribute name.
     *
     * @return the attribute name
     */
    public String getAttributeName() {
        return attributeName;
    }

    /**
     * Sets attribute name.
     *
     * @param attributeName the attribute name
     */
    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("id", id)
                .append("attributeValue", attributeValue)
                .append("attributeValueAlias", attributeValueAlias)
                .append("accountIdType", accountIdType)
                .append("phyTableCode", phyTableCode)
                .append("phyTableColumn", phyTableColumn)
                .append("metaObjectCode", metaObjectCode)
                .append("attributeCode", attributeCode)
                .append("tenantId", tenantId)
                .append("createBy", createBy)
                .append("creator", creator)
                .append("updateBy", updateBy)
                .append("createTime", createTime)
                .append("updateTime", updateTime)
                .append("attributeName", attributeName)
                .toString();
    }
}
