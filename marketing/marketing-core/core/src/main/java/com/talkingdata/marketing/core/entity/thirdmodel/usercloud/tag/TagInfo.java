package com.talkingdata.marketing.core.entity.thirdmodel.usercloud.tag;

/**
 * Created by zmy on 9/6/2017.
 * @author xiaoming.kang
 */
public class TagInfo {
    private Long id;
    private String name;
    /**
     * 编码,TB基本标签，TC复合标签'
     */
    private String code;

    /**
     * '标签表达式'
     */
    private String expression;

    /**
     * '标签表达式显示信息'
     */
    private String displayExpressionInfo;

    /**
     * '节点名称'
     */
    private String expressionNodeName;
    private String description;

    /**
     * '标签来源，1，自定义标签 2，第三方标签'
     */
    private Integer source;

    /**
     * '类型,TB简单标签 TC，复合标签  TH,人群标签'
     */
    private String type;

    /**
     * '状态，1，未生效 2，已生效 -1,已删除(禁用),3 回收站'
     */
    private Integer status;

    /**
     * '标签计算状态：0、未计算 1、计算中 2、计算完成 -1、计算异常 -2 超时 -3、重新计算'
     */
    private Integer calcStatus;

    /**
     * '标签数据时间'
     */
    private Long tagDataTime;

    /**
     * '预估人群数量'
     */
    private Long crowdCount;

    /**
     * '创建人账号'
     */
    private String createBy;

    /**
     * '创建人'
     */
    private String creator;

    /**
     * 修改人账号'
     */
    private String update_by;

    /**
     * '创建时间'
     */
    private Long createTime;

    /**
     * 修改时间'
     */
    private Long updateTime;

    /**
     * '标签开始计算时间'
     */
    private Long tagCalcTime;
    private String expressionDefine;

    /**
     * '产品ID'
     */
    private String productId;

    /**
     * 'Id类型，99：accountid,1:apptdid,2:h5tdid,3:webtdid'
     */
    private String touchPointType;

    /**
     * '租户id'
     */
    private String tenantId;

    /**
     * '标签bitmap脚本'
     */
    private String script;

    /**
     * '标签关联人群ID'
     */
    private Integer crowdId;
    private Long parentId;
    private String remark;

    /**
     * 1 有  0 无'
     */
    private Integer attributeEnumChildTag;

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
     * Gets expression.
     *
     * @return the expression
     */
    public String getExpression() {
        return expression;
    }

    /**
     * Sets expression.
     *
     * @param expression the expression
     */
    public void setExpression(String expression) {
        this.expression = expression;
    }

    /**
     * Gets display expression info.
     *
     * @return the display expression info
     */
    public String getDisplayExpressionInfo() {
        return displayExpressionInfo;
    }

    /**
     * Sets display expression info.
     *
     * @param displayExpressionInfo the display expression info
     */
    public void setDisplayExpressionInfo(String displayExpressionInfo) {
        this.displayExpressionInfo = displayExpressionInfo;
    }

    /**
     * Gets expression node name.
     *
     * @return the expression node name
     */
    public String getExpressionNodeName() {
        return expressionNodeName;
    }

    /**
     * Sets expression node name.
     *
     * @param expressionNodeName the expression node name
     */
    public void setExpressionNodeName(String expressionNodeName) {
        this.expressionNodeName = expressionNodeName;
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
     * Gets type.
     *
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * Sets type.
     *
     * @param type the type
     */
    public void setType(String type) {
        this.type = type;
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
     * Gets tag data time.
     *
     * @return the tag data time
     */
    public Long getTagDataTime() {
        return tagDataTime;
    }

    /**
     * Sets tag data time.
     *
     * @param tagDataTime the tag data time
     */
    public void setTagDataTime(Long tagDataTime) {
        this.tagDataTime = tagDataTime;
    }

    /**
     * Gets crowd count.
     *
     * @return the crowd count
     */
    public Long getCrowdCount() {
        return crowdCount;
    }

    /**
     * Sets crowd count.
     *
     * @param crowdCount the crowd count
     */
    public void setCrowdCount(Long crowdCount) {
        this.crowdCount = crowdCount;
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
    public String getUpdate_by() {
        return update_by;
    }

    /**
     * Sets update by.
     *
     * @param update_by the update by
     */
    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
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
     * Gets tag calc time.
     *
     * @return the tag calc time
     */
    public Long getTagCalcTime() {
        return tagCalcTime;
    }

    /**
     * Sets tag calc time.
     *
     * @param tagCalcTime the tag calc time
     */
    public void setTagCalcTime(Long tagCalcTime) {
        this.tagCalcTime = tagCalcTime;
    }

    /**
     * Gets expression define.
     *
     * @return the expression define
     */
    public String getExpressionDefine() {
        return expressionDefine;
    }

    /**
     * Sets expression define.
     *
     * @param expressionDefine the expression define
     */
    public void setExpressionDefine(String expressionDefine) {
        this.expressionDefine = expressionDefine;
    }

    /**
     * Gets product id.
     *
     * @return the product id
     */
    public String getProductId() {
        return productId;
    }

    /**
     * Sets product id.
     *
     * @param productId the product id
     */
    public void setProductId(String productId) {
        this.productId = productId;
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
     * Gets script.
     *
     * @return the script
     */
    public String getScript() {
        return script;
    }

    /**
     * Sets script.
     *
     * @param script the script
     */
    public void setScript(String script) {
        this.script = script;
    }

    /**
     * Gets crowd id.
     *
     * @return the crowd id
     */
    public Integer getCrowdId() {
        return crowdId;
    }

    /**
     * Sets crowd id.
     *
     * @param crowdId the crowd id
     */
    public void setCrowdId(Integer crowdId) {
        this.crowdId = crowdId;
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
     * Gets remark.
     *
     * @return the remark
     */
    public String getRemark() {
        return remark;
    }

    /**
     * Sets remark.
     *
     * @param remark the remark
     */
    public void setRemark(String remark) {
        this.remark = remark;
    }

    /**
     * Gets attribute enum child tag.
     *
     * @return the attribute enum child tag
     */
    public Integer getAttributeEnumChildTag() {
        return attributeEnumChildTag;
    }

    /**
     * Sets attribute enum child tag.
     *
     * @param attributeEnumChildTag the attribute enum child tag
     */
    public void setAttributeEnumChildTag(Integer attributeEnumChildTag) {
        this.attributeEnumChildTag = attributeEnumChildTag;
    }
}
