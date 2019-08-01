package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_CAMPAIGN_TARGET_CONFIG CampaignTargetConfigEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CampaignTargetConfig extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private Integer targetDefinitionId;
    private String targetDefinitionCode;
    private String name;
    private Long value;
    private Integer metricType;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaignId -> campaign_id</li>
     * <li>targetDefinitionId -> target_definition_id</li>
     * <li>targetDefinitionCode -> target_definition_code</li>
     * <li>name -> name</li>
     * <li>value -> value</li>
     * <li>metricType -> metric_type</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) {
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "campaignId": return "campaign_id";
            case "targetDefinitionId": return "target_definition_id";
            case "targetDefinitionCode": return "target_definition_code";
            case "name": return "name";
            case "value": return "value";
            case "metricType": return "metric_type";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updateBy": return "update_by";
            case "updateTime": return "update_time";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaign_id -> campaignId</li>
     * <li>target_definition_id -> targetDefinitionId</li>
     * <li>target_definition_code -> targetDefinitionCode</li>
     * <li>name -> name</li>
     * <li>value -> value</li>
     * <li>metric_type -> metricType</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) {
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "campaign_id": return "campaignId";
            case "target_definition_id": return "targetDefinitionId";
            case "target_definition_code": return "targetDefinitionCode";
            case "name": return "name";
            case "value": return "value";
            case "metric_type": return "metricType";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            default: return null;
        }
    }
    
    /** 主键 **/
    public Integer getId() {
        return this.id;
    }

    /** 主键 **/
    public void setId(Integer id) {
        this.id = id;
    }

    /** 活动ID **/
    public Integer getCampaignId() {
        return this.campaignId;
    }

    /** 活动ID **/
    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    /** 目标定义ID **/
    public Integer getTargetDefinitionId() {
        return this.targetDefinitionId;
    }

    /** 目标定义ID **/
    public void setTargetDefinitionId(Integer targetDefinitionId) {
        this.targetDefinitionId = targetDefinitionId;
    }

    /** 目标定义CODE **/
    public String getTargetDefinitionCode() {
        return this.targetDefinitionCode;
    }

    /** 目标定义CODE **/
    public void setTargetDefinitionCode(String targetDefinitionCode) {
        this.targetDefinitionCode = targetDefinitionCode;
    }

    /** 名称 **/
    public String getName() {
        return this.name;
    }

    /** 名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /**  **/
    public Long getValue() {
        return this.value;
    }

    /**  **/
    public void setValue(Long value) {
        this.value = value;
    }

    /**  **/
    public Integer getMetricType() {
        return this.metricType;
    }

    /**  **/
    public void setMetricType(Integer metricType) {
        this.metricType = metricType;
    }

    /** 租户ID **/
    public String getTenantId() {
        return this.tenantId;
    }

    /** 租户ID **/
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    /** 创建人 **/
    public String getCreator() {
        return this.creator;
    }

    /** 创建人 **/
    public void setCreator(String creator) {
        this.creator = creator;
    }

    /** 创建人账号 **/
    public String getCreateBy() {
        return this.createBy;
    }

    /** 创建人账号 **/
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    /** 创建时间 **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 创建时间 **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /** 更新人 **/
    public String getUpdater() {
        return this.updater;
    }

    /** 更新人 **/
    public void setUpdater(String updater) {
        this.updater = updater;
    }

    /** 更新人账号 **/
    public String getUpdateBy() {
        return this.updateBy;
    }

    /** 更新人账号 **/
    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    /** 最后更新时间 **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /** 最后更新时间 **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

}
