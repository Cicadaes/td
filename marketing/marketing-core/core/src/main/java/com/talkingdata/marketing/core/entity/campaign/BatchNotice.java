package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_BATCH_NOTICE BatchNoticeEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-12-18 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class BatchNotice extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private Integer pipelineId;
    private String version;
    private String pipelineNodeId;
    private Integer noticeType;
    private Integer triggerType;
    private String cronExpression;
    private Integer status;
    private Integer calcStatus;
    private String idType;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date endTime;
    private String noticeMessage;
    private String errorInfo;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date noticeTime;
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
     * <li>pipelineId -> pipeline_id</li>
     * <li>version -> version</li>
     * <li>pipelineNodeId -> pipeline_node_id</li>
     * <li>noticeType -> notice_type</li>
     * <li>triggerType -> trigger_type</li>
     * <li>cronExpression -> cron_expression</li>
     * <li>status -> status</li>
     * <li>calcStatus -> calc_status</li>
     * <li>idType -> id_type</li>
     * <li>startTime -> start_time</li>
     * <li>endTime -> end_time</li>
     * <li>noticeMessage -> notice_message</li>
     * <li>errorInfo -> error_info</li>
     * <li>noticeTime -> notice_time</li>
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
            case "pipelineId": return "pipeline_id";
            case "version": return "version";
            case "pipelineNodeId": return "pipeline_node_id";
            case "noticeType": return "notice_type";
            case "triggerType": return "trigger_type";
            case "cronExpression": return "cron_expression";
            case "status": return "status";
            case "calcStatus": return "calc_status";
            case "idType": return "id_type";
            case "startTime": return "start_time";
            case "endTime": return "end_time";
            case "noticeMessage": return "notice_message";
            case "errorInfo": return "error_info";
            case "noticeTime": return "notice_time";
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
     * <li>pipeline_id -> pipelineId</li>
     * <li>version -> version</li>
     * <li>pipeline_node_id -> pipelineNodeId</li>
     * <li>notice_type -> noticeType</li>
     * <li>trigger_type -> triggerType</li>
     * <li>cron_expression -> cronExpression</li>
     * <li>status -> status</li>
     * <li>calc_status -> calcStatus</li>
     * <li>id_type -> idType</li>
     * <li>start_time -> startTime</li>
     * <li>end_time -> endTime</li>
     * <li>notice_message -> noticeMessage</li>
     * <li>error_info -> errorInfo</li>
     * <li>notice_time -> noticeTime</li>
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
            case "pipeline_id": return "pipelineId";
            case "version": return "version";
            case "pipeline_node_id": return "pipelineNodeId";
            case "notice_type": return "noticeType";
            case "trigger_type": return "triggerType";
            case "cron_expression": return "cronExpression";
            case "status": return "status";
            case "calc_status": return "calcStatus";
            case "id_type": return "idType";
            case "start_time": return "startTime";
            case "end_time": return "endTime";
            case "notice_message": return "noticeMessage";
            case "error_info": return "errorInfo";
            case "notice_time": return "noticeTime";
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
    
    /** 主键ID **/
    public Integer getId() {
        return this.id;
    }

    /** 主键ID **/
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

    /** 活动流程ID **/
    public Integer getPipelineId() {
        return this.pipelineId;
    }

    /** 活动流程ID **/
    public void setPipelineId(Integer pipelineId) {
        this.pipelineId = pipelineId;
    }

    /** 活动流程版本 **/
    public String getVersion() {
        return this.version;
    }

    /** 活动流程版本 **/
    public void setVersion(String version) {
        this.version = version;
    }

    /** 活动流程节点ID **/
    public String getPipelineNodeId() {
        return this.pipelineNodeId;
    }

    /** 活动流程节点ID **/
    public void setPipelineNodeId(String pipelineNodeId) {
        this.pipelineNodeId = pipelineNodeId;
    }

    /** 通知类型(1-push,2-短信,3-广告,4-微信) **/
    public Integer getNoticeType() {
        return this.noticeType;
    }

    /** 通知类型(1-push,2-短信,3-广告,4-微信) **/
    public void setNoticeType(Integer noticeType) {
        this.noticeType = noticeType;
    }

    /** 触发类型(1-立即,2-定时,3-循环) **/
    public Integer getTriggerType() {
        return this.triggerType;
    }

    /** 触发类型(1-立即,2-定时,3-循环) **/
    public void setTriggerType(Integer triggerType) {
        this.triggerType = triggerType;
    }

    /** 循环投放表达式 **/
    public String getCronExpression() {
        return this.cronExpression;
    }

    /** 循环投放表达式 **/
    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    /** 状态(0-未开始，1-进行中，5-暂停，6-已下线，7-已完成) **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态(0-未开始，1-进行中，5-暂停，6-已下线，7-已完成) **/
    public void setStatus(Integer status) {
        this.status = status;
    }

    /** 计算状态(-1-失败，0-未开始，1-计算中，2-已完成) **/
    public Integer getCalcStatus() {
        return this.calcStatus;
    }

    /** 计算状态(-1-失败，0-未开始，1-计算中，2-已完成) **/
    public void setCalcStatus(Integer calcStatus) {
        this.calcStatus = calcStatus;
    }

    /** 类型(tdId,mobileId) **/
    public String getIdType() {
        return this.idType;
    }

    /** 类型(tdId,mobileId) **/
    public void setIdType(String idType) {
        this.idType = idType;
    }

    /** 投放区间开始时间 **/
    public Date getStartTime() {
        return this.startTime;
    }

    /** 投放区间开始时间 **/
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    /** 投放区间结束时间 **/
    public Date getEndTime() {
        return this.endTime;
    }

    /** 投放区间结束时间 **/
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    /** 具体通知内容 **/
    public String getNoticeMessage() {
        return this.noticeMessage;
    }

    /** 具体通知内容 **/
    public void setNoticeMessage(String noticeMessage) {
        this.noticeMessage = noticeMessage;
    }

    /** 错误日志信息 **/
    public String getErrorInfo() {
        return this.errorInfo;
    }

    /** 错误日志信息 **/
    public void setErrorInfo(String errorInfo) {
        this.errorInfo = errorInfo;
    }

    /** 通知时间 **/
    public Date getNoticeTime() {
        return this.noticeTime;
    }

    /** 通知时间 **/
    public void setNoticeTime(Date noticeTime) {
        this.noticeTime = noticeTime;
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

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("BatchNotice{");
        sb.append("id=").append(id);
        sb.append(", campaignId=").append(campaignId);
        sb.append(", pipelineId=").append(pipelineId);
        sb.append(", version='").append(version).append('\'');
        sb.append(", pipelineNodeId='").append(pipelineNodeId).append('\'');
        sb.append(", noticeType=").append(noticeType);
        sb.append(", triggerType=").append(triggerType);
        sb.append(", cronExpression='").append(cronExpression).append('\'');
        sb.append(", status=").append(status);
        sb.append(", calcStatus=").append(calcStatus);
        sb.append(", idType='").append(idType).append('\'');
        sb.append(", startTime=").append(startTime);
        sb.append(", endTime=").append(endTime);
        sb.append(", noticeMessage='").append(noticeMessage).append('\'');
        sb.append(", errorInfo='").append(errorInfo).append('\'');
        sb.append(", noticeTime=").append(noticeTime);
        sb.append(", tenantId='").append(tenantId).append('\'');
        sb.append(", creator='").append(creator).append('\'');
        sb.append(", createBy='").append(createBy).append('\'');
        sb.append(", createTime=").append(createTime);
        sb.append(", updater='").append(updater).append('\'');
        sb.append(", updateBy='").append(updateBy).append('\'');
        sb.append(", updateTime=").append(updateTime);
        sb.append('}');
        return sb.toString();
    }
}
