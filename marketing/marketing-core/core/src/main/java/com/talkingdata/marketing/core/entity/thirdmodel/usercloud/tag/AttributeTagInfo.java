package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.tag;

/**
 * Created by zmy on 9/6/2017.
 * @author xiaoming.kang
 */
public class AttributeTagInfo {
    /**
     * //'租户id'
     */
    private String tenantId;
    private String accountIdType;
    private String metaObjectCode;
    private String attributeCode;
    private String attributeValue;
    private String attributeName;
    private String attributeValueAlias;

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
}
