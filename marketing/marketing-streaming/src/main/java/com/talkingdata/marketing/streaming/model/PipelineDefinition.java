package com.talkingdata.marketing.streaming.model;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_PIPELINE_DEFINITION PipelineDefinitionEntity<br>
 * @author sheng.hong
 * <b>日期：</b> 2017-09-01 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class PipelineDefinition {

    private Integer id;
    private Integer campaignId;
    private String name;
    private Integer status;
    private String version;
    private String diagram;

    private Date startTime;

    private Date endTime;
    private String tenantId;
    private String description;
    private String creator;
    private String createBy;

    private Date createTime;
    private String updater;
    private String updateBy;

    private Date updateTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaignId -> campaign_id</li>
     * <li>name -> name</li>
     * <li>status -> status</li>
     * <li>version -> version</li>
     * <li>diagram -> diagram</li>
     * <li>startTime -> start_time</li>
     * <li>endTime -> end_time</li>
     * <li>tenantId -> tenant_id</li>
     * <li>description -> description</li>
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
            case "name": return "name";
            case "status": return "status";
            case "version": return "version";
            case "diagram": return "diagram";
            case "startTime": return "start_time";
            case "endTime": return "end_time";
            case "tenantId": return "tenant_id";
            case "description": return "description";
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
     * <li>name -> name</li>
     * <li>status -> status</li>
     * <li>version -> version</li>
     * <li>diagram -> diagram</li>
     * <li>start_time -> startTime</li>
     * <li>end_time -> endTime</li>
     * <li>tenant_id -> tenantId</li>
     * <li>description -> description</li>
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
            case "name": return "name";
            case "status": return "status";
            case "version": return "version";
            case "diagram": return "diagram";
            case "start_time": return "startTime";
            case "end_time": return "endTime";
            case "tenant_id": return "tenantId";
            case "description": return "description";
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

    /** 名称 **/
    public String getName() {
        return this.name;
    }

    /** 名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /** 状态 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态 **/
    public void setStatus(Integer status) {
        this.status = status;
    }

    /** 版本 **/
    public String getVersion() {
        return this.version;
    }

    /** 版本 **/
    public void setVersion(String version) {
        this.version = version;
    }

    /** 图数据JSON格式 @see DiagramDefinition **/
    public String getDiagram() {
        return this.diagram;
    }

    /** 图数据JSON格式 @see DiagramDefinition **/
    public void setDiagram(String diagram) {
        this.diagram = diagram;
    }

    /** 开始时间 **/
    public Date getStartTime() {
        return this.startTime;
    }

    /** 开始时间 **/
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    /** 结束时间 **/
    public Date getEndTime() {
        return this.endTime;
    }

    /** 结束时间 **/
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    /** 租户 **/
    public String getTenantId() {
        return this.tenantId;
    }

    /** 租户 **/
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    /** 描述 **/
    public String getDescription() {
        return this.description;
    }

    /** 描述 **/
    public void setDescription(String description) {
        this.description = description;
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

    @Override
    public String toString() {
        return "PipelineDefinition{" +
                "id=" + id +
                ", campaignId=" + campaignId +
                ", name='" + name + '\'' +
                ", status=" + status +
                ", version='" + version + '\'' +
                ", diagram='" + diagram + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", tenantId='" + tenantId + '\'' +
                ", description='" + description + '\'' +
                ", creator='" + creator + '\'' +
                ", createBy='" + createBy + '\'' +
                ", createTime=" + createTime +
                ", updater='" + updater + '\'' +
                ", updateBy='" + updateBy + '\'' +
                ", updateTime=" + updateTime +
                '}';
    }
}
