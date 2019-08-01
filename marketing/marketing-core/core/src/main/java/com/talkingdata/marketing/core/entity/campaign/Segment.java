package com.talkingdata.marketing.core.entity.campaign;

import com.google.common.base.Objects;
import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_SEGMENT SegmentEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-01-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class Segment extends BaseEntity {

    /**
     * 主键
     */
    private Integer id;
    /**
     * 营销活动ID
     */
    private Integer campaignId;
    /**
     * 活动投放单元ID
     */
    private Integer campaignLaunchUnitId;
    /**
     *人群ID
     */
    private Integer crowdId;
    /**
     * 人群版本
     */
    private String crowdVersion;
    /**
     * 渠道定义ID
     */
    private Integer channelDefinitionId;
    /**
     * 名称
     */
    private String name;
    /**
     * 状态
     */
    private Integer status;
    /**
     * 人群更新类型，0、使用投放单元的人群版本(默认) 1、每次投放时使用最新的人群
     */
    private Integer crowdUpdateType;
    /**
     * 运行规则
     */
    private String cronExpression;
    /**
     *标题
     */
    private String title;
    /**
     *消息
     */
    private String message;
    /**
     *消息参数
     */
    private String messageParam;
    /**
     * 渠道参数
     */
    private String channelParam;
    /**
     * 投放备注
     */
    private String description;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date appointedTime;
    private Integer triggerType;
    private Integer subTriggerType;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date lastSendTime;
    private Integer sendTotalCount;
    private Integer lastSendCount;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaignId -> campaign_id</li>
     * <li>campaignLaunchUnitId -> campaign_launch_unit_id</li>
     * <li>crowdId -> crowd_id</li>
     * <li>crowdVersion -> crowd_version</li>
     * <li>channelDefinitionId -> channel_definition_id</li>
     * <li>name -> name</li>
     * <li>status -> status</li>
     * <li>crowdUpdateType -> crowd_update_type</li>
     * <li>cronExpression -> cron_expression</li>
     * <li>title -> title</li>
     * <li>message -> message</li>
     * <li>messageParam -> message_param</li>
     * <li>channelParam -> channel_param</li>
     * <li>description -> description</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     * <li>appointedTime -> appointed_time</li>
     * <li>triggerType -> trigger_type</li>
     * <li>subTriggerType -> sub_trigger_type</li>
     * <li>lastSendTime -> last_send_time</li>
     * <li>sendTotalCount -> send_total_count</li>
     * <li>lastSendCount -> last_send_count</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) {
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "campaignId": return "campaign_id";
            case "campaignLaunchUnitId": return "campaign_launch_unit_id";
            case "crowdId": return "crowd_id";
            case "crowdVersion": return "crowd_version";
            case "channelDefinitionId": return "channel_definition_id";
            case "name": return "name";
            case "status": return "status";
            case "crowdUpdateType": return "crowd_update_type";
            case "cronExpression": return "cron_expression";
            case "title": return "title";
            case "message": return "message";
            case "messageParam": return "message_param";
            case "channelParam": return "channel_param";
            case "description": return "description";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updateBy": return "update_by";
            case "updateTime": return "update_time";
            case "appointedTime": return "appointed_time";
            case "triggerType": return "trigger_type";
            case "subTriggerType": return "sub_trigger_type";
            case "lastSendTime": return "last_send_time";
            case "sendTotalCount": return "send_total_count";
            case "lastSendCount": return "last_send_count";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaign_id -> campaignId</li>
     * <li>campaign_launch_unit_id -> campaignLaunchUnitId</li>
     * <li>crowd_id -> crowdId</li>
     * <li>crowd_version -> crowdVersion</li>
     * <li>channel_definition_id -> channelDefinitionId</li>
     * <li>name -> name</li>
     * <li>status -> status</li>
     * <li>crowd_update_type -> crowdUpdateType</li>
     * <li>cron_expression -> cronExpression</li>
     * <li>title -> title</li>
     * <li>message -> message</li>
     * <li>message_param -> messageParam</li>
     * <li>channel_param -> channelParam</li>
     * <li>description -> description</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     * <li>appointed_time -> appointedTime</li>
     * <li>trigger_type -> triggerType</li>
     * <li>sub_trigger_type -> subTriggerType</li>
     * <li>last_send_time -> lastSendTime</li>
     * <li>send_total_count -> sendTotalCount</li>
     * <li>last_send_count -> lastSendCount</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) {
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "campaign_id": return "campaignId";
            case "campaign_launch_unit_id": return "campaignLaunchUnitId";
            case "crowd_id": return "crowdId";
            case "crowd_version": return "crowdVersion";
            case "channel_definition_id": return "channelDefinitionId";
            case "name": return "name";
            case "status": return "status";
            case "crowd_update_type": return "crowdUpdateType";
            case "cron_expression": return "cronExpression";
            case "title": return "title";
            case "message": return "message";
            case "message_param": return "messageParam";
            case "channel_param": return "channelParam";
            case "description": return "description";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            case "appointed_time": return "appointedTime";
            case "trigger_type": return "triggerType";
            case "sub_trigger_type": return "subTriggerType";
            case "last_send_time": return "lastSendTime";
            case "send_total_count": return "sendTotalCount";
            case "last_send_count": return "lastSendCount";
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

    /** 活动投放单元ID **/
    public Integer getCampaignLaunchUnitId() {
        return this.campaignLaunchUnitId;
    }

    /** 活动投放单元ID **/
    public void setCampaignLaunchUnitId(Integer campaignLaunchUnitId) {
        this.campaignLaunchUnitId = campaignLaunchUnitId;
    }

    /** 人群ID **/
    public Integer getCrowdId() {
        return this.crowdId;
    }

    /** 人群ID **/
    public void setCrowdId(Integer crowdId) {
        this.crowdId = crowdId;
    }

    /** 人群版本 **/
    public String getCrowdVersion() {
        return this.crowdVersion;
    }

    /** 人群版本 **/
    public void setCrowdVersion(String crowdVersion) {
        this.crowdVersion = crowdVersion;
    }

    /** 渠道定义ID **/
    public Integer getChannelDefinitionId() {
        return this.channelDefinitionId;
    }

    /** 渠道定义ID **/
    public void setChannelDefinitionId(Integer channelDefinitionId) {
        this.channelDefinitionId = channelDefinitionId;
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

    /** 人群更新类型，0、使用投放单元的人群版本(默认) 1、每次投放时使用最新的人群 **/
    public Integer getCrowdUpdateType() {
        return this.crowdUpdateType;
    }

    /** 人群更新类型，0、使用投放单元的人群版本(默认) 1、每次投放时使用最新的人群 **/
    public void setCrowdUpdateType(Integer crowdUpdateType) {
        this.crowdUpdateType = crowdUpdateType;
    }

    /** 运行规则 **/
    public String getCronExpression() {
        return this.cronExpression;
    }

    /** 运行规则 **/
    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    /** 标题 **/
    public String getTitle() {
        return this.title;
    }

    /** 标题 **/
    public void setTitle(String title) {
        this.title = title;
    }

    /** 消息 **/
    public String getMessage() {
        return this.message;
    }

    /** 消息 **/
    public void setMessage(String message) {
        this.message = message;
    }

    /** 消息参 **/
    public String getMessageParam() {
        return this.messageParam;
    }

    /** 消息参 **/
    public void setMessageParam(String messageParam) {
        this.messageParam = messageParam;
    }

    /** 渠道参数 **/
    public String getChannelParam() {
        return this.channelParam;
    }

    /** 渠道参数 **/
    public void setChannelParam(String channelParam) {
        this.channelParam = channelParam;
    }

    /**  投放备注 **/
    public String getDescription() {
        return this.description;
    }

    /**  投放备注 **/
    public void setDescription(String description) {
        this.description = description;
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

    /** 发送时间 **/
    public Date getAppointedTime() {
        return this.appointedTime;
    }

    /** 发送时间 **/
    public void setAppointedTime(Date appointedTime) {
        this.appointedTime = appointedTime;
    }

    /** 触发类型 1、立即发送 2、定时发送 3、循环发送 **/
    public Integer getTriggerType() {
        return this.triggerType;
    }

    /** 触发类型 1、立即发送 2、定时发送 3、循环发送 **/
    public void setTriggerType(Integer triggerType) {
        this.triggerType = triggerType;
    }

    /** 触发子类型, 仅当触发类型为3(循环发送)时才有该值 1、每分钟发送 2、每小时发送 3、每天发送 4、每周发送 5、每月发送 **/
    public Integer getSubTriggerType() {
        return this.subTriggerType;
    }

    /** 触发子类型, 仅当触发类型为3(循环发送)时才有该值 1、每分钟发送 2、每小时发送 3、每天发送 4、每周发送 5、每月发送 **/
    public void setSubTriggerType(Integer subTriggerType) {
        this.subTriggerType = subTriggerType;
    }

    /** 最近一次投放时间 **/
    public Date getLastSendTime() {
        return this.lastSendTime;
    }

    /** 最近一次投放时间 **/
    public void setLastSendTime(Date lastSendTime) {
        this.lastSendTime = lastSendTime;
    }

    /** 投放人群总量，循环投放为每次投放人群数量之和 **/
    public Integer getSendTotalCount() {
        return this.sendTotalCount;
    }

    /** 投放人群总量，循环投放为每次投放人群数量之和 **/
    public void setSendTotalCount(Integer sendTotalCount) {
        this.sendTotalCount = sendTotalCount;
    }

    /** 最近一次投放数量 **/
    public Integer getLastSendCount() {
        return this.lastSendCount;
    }

    /** 最近一次投放数量 **/
    public void setLastSendCount(Integer lastSendCount) {
        this.lastSendCount = lastSendCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Segment segment = (Segment) o;
        return Objects.equal(id, segment.id) &&
                Objects.equal(campaignId, segment.campaignId) &&
                Objects.equal(campaignLaunchUnitId, segment.campaignLaunchUnitId) &&
                Objects.equal(crowdId, segment.crowdId) &&
                Objects.equal(crowdVersion, segment.crowdVersion) &&
                Objects.equal(channelDefinitionId, segment.channelDefinitionId) &&
                Objects.equal(name, segment.name) &&
                Objects.equal(status, segment.status) &&
                Objects.equal(crowdUpdateType, segment.crowdUpdateType) &&
                Objects.equal(cronExpression, segment.cronExpression) &&
                Objects.equal(title, segment.title) &&
                Objects.equal(message, segment.message) &&
                Objects.equal(messageParam, segment.messageParam) &&
                Objects.equal(channelParam, segment.channelParam) &&
                Objects.equal(description, segment.description) &&
                Objects.equal(tenantId, segment.tenantId) &&
                Objects.equal(creator, segment.creator) &&
                Objects.equal(createBy, segment.createBy) &&
                Objects.equal(createTime, segment.createTime) &&
                Objects.equal(updater, segment.updater) &&
                Objects.equal(updateBy, segment.updateBy) &&
                Objects.equal(updateTime, segment.updateTime) &&
                Objects.equal(appointedTime, segment.appointedTime) &&
                Objects.equal(triggerType, segment.triggerType) &&
                Objects.equal(subTriggerType, segment.subTriggerType) &&
                Objects.equal(lastSendTime, segment.lastSendTime) &&
                Objects.equal(sendTotalCount, segment.sendTotalCount) &&
                Objects.equal(lastSendCount, segment.lastSendCount);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id, campaignId, campaignLaunchUnitId, crowdId, crowdVersion, channelDefinitionId, name, status, crowdUpdateType, cronExpression, title, message, messageParam, channelParam, description, tenantId, creator, createBy, createTime, updater, updateBy, updateTime, appointedTime, triggerType, subTriggerType, lastSendTime, sendTotalCount, lastSendCount);
    }
}
