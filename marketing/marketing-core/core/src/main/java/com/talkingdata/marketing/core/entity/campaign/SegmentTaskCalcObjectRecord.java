package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_SEGMENT_TASK_CALC_OBJECT_RECORD SegmentTaskCalcObjectRecordEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-01 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class SegmentTaskCalcObjectRecord extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private Integer campaignLaunchUnitId;
    private Integer segmentId;
    private Integer pipelineId;
    private String pipelineNodeId;
    private Integer type;
    private Integer channelDefinitionId;
    private Integer status;
    private String calcInfo;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date finishTime;
    private Integer retry;
    private String errorInfo;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date lastStatTime;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    private String attr1;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaignId -> campaign_id</li>
     * <li>campaignLaunchUnitId -> campaign_launch_unit_id</li>
     * <li>segmentId -> segment_id</li>
     * <li>pipelineId -> pipeline_id</li>
     * <li>pipelineNodeId -> pipeline_node_id</li>
     * <li>type -> type</li>
     * <li>channelDefinitionId -> channel_definition_id</li>
     * <li>status -> status</li>
     * <li>calcInfo -> calc_info</li>
     * <li>startTime -> start_time</li>
     * <li>finishTime -> finish_time</li>
     * <li>retry -> retry</li>
     * <li>errorInfo -> error_info</li>
     * <li>lastStatTime -> last_stat_time</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     * <li>attr1 -> attr1</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null){
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "campaignId": return "campaign_id";
            case "campaignLaunchUnitId": return "campaign_launch_unit_id";
            case "segmentId": return "segment_id";
            case "pipelineId": return "pipeline_id";
            case "pipelineNodeId": return "pipeline_node_id";
            case "type": return "type";
            case "channelDefinitionId": return "channel_definition_id";
            case "status": return "status";
            case "calcInfo": return "calc_info";
            case "startTime": return "start_time";
            case "finishTime": return "finish_time";
            case "retry": return "retry";
            case "errorInfo": return "error_info";
            case "lastStatTime": return "last_stat_time";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updateBy": return "update_by";
            case "updateTime": return "update_time";
            case "attr1": return "attr1";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaign_id -> campaignId</li>
     * <li>campaign_launch_unit_id -> campaignLaunchUnitId</li>
     * <li>segment_id -> segmentId</li>
     * <li>pipeline_id -> pipelineId</li>
     * <li>pipeline_node_id -> pipelineNodeId</li>
     * <li>type -> type</li>
     * <li>channel_definition_id -> channelDefinitionId</li>
     * <li>status -> status</li>
     * <li>calc_info -> calcInfo</li>
     * <li>start_time -> startTime</li>
     * <li>finish_time -> finishTime</li>
     * <li>retry -> retry</li>
     * <li>error_info -> errorInfo</li>
     * <li>last_stat_time -> lastStatTime</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     * <li>attr1 -> attr1</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null){
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "campaign_id": return "campaignId";
            case "campaign_launch_unit_id": return "campaignLaunchUnitId";
            case "segment_id": return "segmentId";
            case "pipeline_id": return "pipelineId";
            case "pipeline_node_id": return "pipelineNodeId";
            case "type": return "type";
            case "channel_definition_id": return "channelDefinitionId";
            case "status": return "status";
            case "calc_info": return "calcInfo";
            case "start_time": return "startTime";
            case "finish_time": return "finishTime";
            case "retry": return "retry";
            case "error_info": return "errorInfo";
            case "last_stat_time": return "lastStatTime";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            case "attr1": return "attr1";
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

    /** 投放单元ID **/
    public Integer getCampaignLaunchUnitId() {
        return this.campaignLaunchUnitId;
    }

    /** 投放单元ID **/
    public void setCampaignLaunchUnitId(Integer campaignLaunchUnitId) {
        this.campaignLaunchUnitId = campaignLaunchUnitId;
    }

    /** 投放ID **/
    public Integer getSegmentId() {
        return this.segmentId;
    }

    /** 投放ID **/
    public void setSegmentId(Integer segmentId) {
        this.segmentId = segmentId;
    }

    /**  **/
    public Integer getPipelineId() {
        return this.pipelineId;
    }

    /**  **/
    public void setPipelineId(Integer pipelineId) {
        this.pipelineId = pipelineId;
    }

    /**  **/
    public String getPipelineNodeId() {
        return this.pipelineNodeId;
    }

    /**  **/
    public void setPipelineNodeId(String pipelineNodeId) {
        this.pipelineNodeId = pipelineNodeId;
    }

    /** 1.发送前生成 2.发送完毕生成 **/
    public Integer getType() {
        return this.type;
    }

    /** 1.发送前生成 2.发送完毕生成 **/
    public void setType(Integer type) {
        this.type = type;
    }

    /** 渠道定义ID **/
    public Integer getChannelDefinitionId() {
        return this.channelDefinitionId;
    }

    /** 渠道定义ID **/
    public void setChannelDefinitionId(Integer channelDefinitionId) {
        this.channelDefinitionId = channelDefinitionId;
    }

    /** 状态-1、异常 0、未开始 1、进行中 2、已完成 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态-1、异常 0、未开始 1、进行中 2、已完成 **/
    public void setStatus(Integer status) {
        this.status = status;
    }

    /** 计算信息 **/
    public String getCalcInfo() {
        return this.calcInfo;
    }

    /** 计算信息 **/
    public void setCalcInfo(String calcInfo) {
        this.calcInfo = calcInfo;
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
    public Date getFinishTime() {
        return this.finishTime;
    }

    /** 结束时间 **/
    public void setFinishTime(Date finishTime) {
        this.finishTime = finishTime;
    }

    /**  **/
    public Integer getRetry() {
        return this.retry;
    }

    /**  **/
    public void setRetry(Integer retry) {
        this.retry = retry;
    }

    /** 错误信息 **/
    public String getErrorInfo() {
        return this.errorInfo;
    }

    /** 错误信息 **/
    public void setErrorInfo(String errorInfo) {
        this.errorInfo = errorInfo;
    }

    /** 最后一次统计时间 **/
    public Date getLastStatTime() {
        return this.lastStatTime;
    }

    /** 最后一次统计时间 **/
    public void setLastStatTime(Date lastStatTime) {
        this.lastStatTime = lastStatTime;
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

    /** 最后更新时间\r **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /** 最后更新时间\r **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    /** 扩展字段:记录pushId **/
    public String getAttr1() {
        return this.attr1;
    }

    /** 扩展字段:记录pushId **/
    public void setAttr1(String attr1) {
        this.attr1 = attr1;
    }

}
