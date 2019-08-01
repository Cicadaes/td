package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_EQUITY_RECORD_HISTORY EquityRecordHistoryEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class EquityRecordHistory extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private Integer pipelineDefinitionId;
    private Integer equityConfigId;
    private String equityCode;
    private String equityValue;
    private Integer status;
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
     * <li>pipelineDefinitionId -> pipeline_definition_id</li>
     * <li>equityConfigId -> equity_config_id</li>
     * <li>equityCode -> equity_code</li>
     * <li>equityValue -> equity_value</li>
     * <li>status -> status</li>
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
            case "pipelineDefinitionId": return "pipeline_definition_id";
            case "equityConfigId": return "equity_config_id";
            case "equityCode": return "equity_code";
            case "equityValue": return "equity_value";
            case "status": return "status";
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
     * <li>pipeline_definition_id -> pipelineDefinitionId</li>
     * <li>equity_config_id -> equityConfigId</li>
     * <li>equity_code -> equityCode</li>
     * <li>equity_value -> equityValue</li>
     * <li>status -> status</li>
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
            case "pipeline_definition_id": return "pipelineDefinitionId";
            case "equity_config_id": return "equityConfigId";
            case "equity_code": return "equityCode";
            case "equity_value": return "equityValue";
            case "status": return "status";
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

    /** 营销活动ID **/
    public Integer getCampaignId() {
        return this.campaignId;
    }

    /** 营销活动ID **/
    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    /** 营销流程ID **/
    public Integer getPipelineDefinitionId() {
        return this.pipelineDefinitionId;
    }

    /** 营销流程ID **/
    public void setPipelineDefinitionId(Integer pipelineDefinitionId) {
        this.pipelineDefinitionId = pipelineDefinitionId;
    }

    /** 营销权益配置ID **/
    public Integer getEquityConfigId() {
        return this.equityConfigId;
    }

    /** 营销权益配置ID **/
    public void setEquityConfigId(Integer equityConfigId) {
        this.equityConfigId = equityConfigId;
    }

    /** 权益编码 **/
    public String getEquityCode() {
        return this.equityCode;
    }

    /** 权益编码 **/
    public void setEquityCode(String equityCode) {
        this.equityCode = equityCode;
    }

    /** 权益值 **/
    public String getEquityValue() {
        return this.equityValue;
    }

    /** 权益值 **/
    public void setEquityValue(String equityValue) {
        this.equityValue = equityValue;
    }

    /** 状态 0、未使用 1、已发放 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态 0、未使用 1、已发放 **/
    public void setStatus(Integer status) {
        this.status = status;
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
