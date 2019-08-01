package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_PIPELINE_INSTANCE PipelineInstanceEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-18 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class PipelineInstance extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private Integer pipelineDefinitionId;
    private String version;
    private Integer status;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date endTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date submitTime;
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
     * <li>status -> status</li>
     * <li>startTime -> start_time</li>
     * <li>endTime -> end_time</li>
     * <li>submitTime -> submit_time</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> updateBy</li>
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
            case "status": return "status";
            case "startTime": return "start_time";
            case "endTime": return "end_time";
            case "submitTime": return "submit_time";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updateBy": return "updateBy";
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
     * <li>status -> status</li>
     * <li>start_time -> startTime</li>
     * <li>end_time -> endTime</li>
     * <li>submit_time -> submitTime</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> updateBy</li>
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
            case "status": return "status";
            case "start_time": return "startTime";
            case "end_time": return "endTime";
            case "submit_time": return "submitTime";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "updateBy": return "updateBy";
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

    /** 营销流程id **/
    public Integer getCampaignId() {
        return this.campaignId;
    }

    /** 营销流程id **/
    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    /** 流程定义id **/
    public Integer getPipelineDefinitionId() {
        return this.pipelineDefinitionId;
    }

    /** 流程定义id **/
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

    /** 状态，0、未开始 1、进行中 2、已下线 3、已完成 4、提前终止 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态，0、未开始 1、进行中 2、已下线 3、已完成 4、提前终止 **/
    public void setStatus(Integer status) {
        this.status = status;
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

    /** 提交时间 **/
    public Date getSubmitTime() {
        return this.submitTime;
    }

    /** 提交时间 **/
    public void setSubmitTime(Date submitTime) {
        this.submitTime = submitTime;
    }

    /** 租户id **/
    public String getTenantId() {
        return this.tenantId;
    }

    /** 租户id **/
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
