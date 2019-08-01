package com.talkingdata.marketing.streaming.model;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_PIPELINE_STAGE PipelineStageEntity<br>
 * @author sheng.hong
 * <b>日期：</b> 2017-09-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class PipelineStage extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private Integer pipelineDefinitionId;
    private String version;
    private String stageName;
    private String diagram;
    private String triggerType;
    private String cronExpression;
    private Integer interval;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date executeTimes;
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
     * <li>version -> version</li>
     * <li>stageName -> stage_name</li>
     * <li>diagram -> diagram</li>
     * <li>triggerType -> trigger_type</li>
     * <li>cronExpression -> cron_expression</li>
     * <li>interval -> interval</li>
     * <li>executeTimes -> execute_times</li>
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
            case "version": return "version";
            case "stageName": return "stage_name";
            case "diagram": return "diagram";
            case "triggerType": return "trigger_type";
            case "cronExpression": return "cron_expression";
            case "interval": return "interval";
            case "executeTimes": return "execute_times";
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
     * <li>version -> version</li>
     * <li>stage_name -> stageName</li>
     * <li>diagram -> diagram</li>
     * <li>trigger_type -> triggerType</li>
     * <li>cron_expression -> cronExpression</li>
     * <li>interval -> interval</li>
     * <li>execute_times -> executeTimes</li>
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
            case "version": return "version";
            case "stage_name": return "stageName";
            case "diagram": return "diagram";
            case "trigger_type": return "triggerType";
            case "cron_expression": return "cronExpression";
            case "interval": return "interval";
            case "execute_times": return "executeTimes";
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

    /** pipeline定义ID **/
    public Integer getPipelineDefinitionId() {
        return this.pipelineDefinitionId;
    }

    /** pipeline定义ID **/
    public void setPipelineDefinitionId(Integer pipelineDefinitionId) {
        this.pipelineDefinitionId = pipelineDefinitionId;
    }

    /** 版本 **/
    public String getVersion() {
        return this.version;
    }

    /** 版本 **/
    public void setVersion(String version) {
        this.version = version;
    }

    /** 阶段名 **/
    public String getStageName() {
        return this.stageName;
    }

    /** 阶段名 **/
    public void setStageName(String stageName) {
        this.stageName = stageName;
    }

    /** 图数据JSON格式 @see PipelineDiagram **/
    public String getDiagram() {
        return this.diagram;
    }

    /** 图数据JSON格式 @see PipelineDiagram **/
    public void setDiagram(String diagram) {
        this.diagram = diagram;
    }

    /** C : cron表达式 S: simple运行方式 **/
    public String getTriggerType() {
        return this.triggerType;
    }

    /** C : cron表达式 S: simple运行方式 **/
    public void setTriggerType(String triggerType) {
        this.triggerType = triggerType;
    }

    /** Corn表达式 **/
    public String getCronExpression() {
        return this.cronExpression;
    }

    /** Corn表达式 **/
    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    /** 执行间隔 **/
    public Integer getInterval() {
        return this.interval;
    }

    /** 执行间隔 **/
    public void setInterval(Integer interval) {
        this.interval = interval;
    }

    /** 执行时间 **/
    public Date getExecuteTimes() {
        return this.executeTimes;
    }

    /** 执行时间 **/
    public void setExecuteTimes(Date executeTimes) {
        this.executeTimes = executeTimes;
    }

    /** 租户 **/
    public String getTenantId() {
        return this.tenantId;
    }

    /** 租户 **/
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

    /** 更新时间 **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /** 更新时间 **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

}
