package com.talkingdata.marketing.core.page.campaign;

import com.talkingdata.enterprise.base.page.BasePage;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_SEGMENT SegmentPage<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-01-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class SegmentPage extends BasePage {

    private String id;
    private String idOperator = "=";
    private String campaignId;
    private String campaignIdOperator = "=";
    private String campaignLaunchUnitId;
    private String campaignLaunchUnitIdOperator = "=";
    private String crowdId;
    private String crowdIdOperator = "=";
    private String crowdVersion;
    private String crowdVersionOperator = "=";
    private String channelDefinitionId;
    private String channelDefinitionIdOperator = "=";
    private String name;
    private String nameOperator = "=";
    private String status;
    private String statusOperator = "=";
    private String crowdUpdateType;
    private String crowdUpdateTypeOperator = "=";
    private String cronExpression;
    private String cronExpressionOperator = "=";
    private String title;
    private String titleOperator = "=";
    private String message;
    private String messageOperator = "=";
    private String messageParam;
    private String messageParamOperator = "=";
    private String channelParam;
    private String channelParamOperator = "=";
    private String description;
    private String descriptionOperator = "=";
    private String tenantId;
    private String tenantIdOperator = "=";
    private String creator;
    private String creatorOperator = "=";
    private String createBy;
    private String createByOperator = "=";
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String createTime1;
    private String createTime2;
    private String createTimeOperator = "=";
    private String updater;
    private String updaterOperator = "=";
    private String updateBy;
    private String updateByOperator = "=";
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    private String updateTime1;
    private String updateTime2;
    private String updateTimeOperator = "=";
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date appointedTime;
    private String appointedTime1;
    private String appointedTime2;
    private String appointedTimeOperator = "=";
    private String triggerType;
    private String triggerTypeOperator = "=";
    private String subTriggerType;
    private String subTriggerTypeOperator = "=";
    private String lastSendTime;
    private String lastSendTime1;
    private String lastSendTime2;
    private String lastSendTimeOperator = "=";
    private String sendTotalCount;
    private String sendTotalCountOperator = "=";
    private String lastSendCount;
    private String lastSendCountOperator = "=";

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdOperator() {
        return this.idOperator;
    }

    public void setIdOperator(String idOperator) {
        this.idOperator = idOperator;
    }

    public String getCampaignId() {
        return this.campaignId;
    }

    public void setCampaignId(String campaignId) {
        this.campaignId = campaignId;
    }

    public String getCampaignIdOperator() {
        return this.campaignIdOperator;
    }

    public void setCampaignIdOperator(String campaignIdOperator) {
        this.campaignIdOperator = campaignIdOperator;
    }

    public String getCampaignLaunchUnitId() {
        return this.campaignLaunchUnitId;
    }

    public void setCampaignLaunchUnitId(String campaignLaunchUnitId) {
        this.campaignLaunchUnitId = campaignLaunchUnitId;
    }

    public String getCampaignLaunchUnitIdOperator() {
        return this.campaignLaunchUnitIdOperator;
    }

    public void setCampaignLaunchUnitIdOperator(String campaignLaunchUnitIdOperator) {
        this.campaignLaunchUnitIdOperator = campaignLaunchUnitIdOperator;
    }

    public String getCrowdId() {
        return this.crowdId;
    }

    public void setCrowdId(String crowdId) {
        this.crowdId = crowdId;
    }

    public String getCrowdIdOperator() {
        return this.crowdIdOperator;
    }

    public void setCrowdIdOperator(String crowdIdOperator) {
        this.crowdIdOperator = crowdIdOperator;
    }

    public String getCrowdVersion() {
        return this.crowdVersion;
    }

    public void setCrowdVersion(String crowdVersion) {
        this.crowdVersion = crowdVersion;
    }

    public String getCrowdVersionOperator() {
        return this.crowdVersionOperator;
    }

    public void setCrowdVersionOperator(String crowdVersionOperator) {
        this.crowdVersionOperator = crowdVersionOperator;
    }

    public String getChannelDefinitionId() {
        return this.channelDefinitionId;
    }

    public void setChannelDefinitionId(String channelDefinitionId) {
        this.channelDefinitionId = channelDefinitionId;
    }

    public String getChannelDefinitionIdOperator() {
        return this.channelDefinitionIdOperator;
    }

    public void setChannelDefinitionIdOperator(String channelDefinitionIdOperator) {
        this.channelDefinitionIdOperator = channelDefinitionIdOperator;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameOperator() {
        return this.nameOperator;
    }

    public void setNameOperator(String nameOperator) {
        this.nameOperator = nameOperator;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusOperator() {
        return this.statusOperator;
    }

    public void setStatusOperator(String statusOperator) {
        this.statusOperator = statusOperator;
    }

    public String getCrowdUpdateType() {
        return this.crowdUpdateType;
    }

    public void setCrowdUpdateType(String crowdUpdateType) {
        this.crowdUpdateType = crowdUpdateType;
    }

    public String getCrowdUpdateTypeOperator() {
        return this.crowdUpdateTypeOperator;
    }

    public void setCrowdUpdateTypeOperator(String crowdUpdateTypeOperator) {
        this.crowdUpdateTypeOperator = crowdUpdateTypeOperator;
    }

    public String getCronExpression() {
        return this.cronExpression;
    }

    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    public String getCronExpressionOperator() {
        return this.cronExpressionOperator;
    }

    public void setCronExpressionOperator(String cronExpressionOperator) {
        this.cronExpressionOperator = cronExpressionOperator;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitleOperator() {
        return this.titleOperator;
    }

    public void setTitleOperator(String titleOperator) {
        this.titleOperator = titleOperator;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessageOperator() {
        return this.messageOperator;
    }

    public void setMessageOperator(String messageOperator) {
        this.messageOperator = messageOperator;
    }

    public String getMessageParam() {
        return this.messageParam;
    }

    public void setMessageParam(String messageParam) {
        this.messageParam = messageParam;
    }

    public String getMessageParamOperator() {
        return this.messageParamOperator;
    }

    public void setMessageParamOperator(String messageParamOperator) {
        this.messageParamOperator = messageParamOperator;
    }

    public String getChannelParam() {
        return this.channelParam;
    }

    public void setChannelParam(String channelParam) {
        this.channelParam = channelParam;
    }

    public String getChannelParamOperator() {
        return this.channelParamOperator;
    }

    public void setChannelParamOperator(String channelParamOperator) {
        this.channelParamOperator = channelParamOperator;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescriptionOperator() {
        return this.descriptionOperator;
    }

    public void setDescriptionOperator(String descriptionOperator) {
        this.descriptionOperator = descriptionOperator;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTenantIdOperator() {
        return this.tenantIdOperator;
    }

    public void setTenantIdOperator(String tenantIdOperator) {
        this.tenantIdOperator = tenantIdOperator;
    }

    public String getCreator() {
        return this.creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreatorOperator() {
        return this.creatorOperator;
    }

    public void setCreatorOperator(String creatorOperator) {
        this.creatorOperator = creatorOperator;
    }

    public String getCreateBy() {
        return this.createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public String getCreateByOperator() {
        return this.createByOperator;
    }

    public void setCreateByOperator(String createByOperator) {
        this.createByOperator = createByOperator;
    }

    public Date getCreateTime() {
        return this.createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getCreateTime1() {
        return this.createTime1;
    }

    public void setCreateTime1(String createTime1) {
        this.createTime1 = createTime1;
    }

    public String getCreateTime2() {
        return this.createTime2;
    }

    public void setCreateTime2(String createTime2) {
        this.createTime2 = createTime2;
    }

    public String getCreateTimeOperator() {
        return this.createTimeOperator;
    }

    public void setCreateTimeOperator(String createTimeOperator) {
        this.createTimeOperator = createTimeOperator;
    }

    public String getUpdater() {
        return this.updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater;
    }

    public String getUpdaterOperator() {
        return this.updaterOperator;
    }

    public void setUpdaterOperator(String updaterOperator) {
        this.updaterOperator = updaterOperator;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public String getUpdateByOperator() {
        return this.updateByOperator;
    }

    public void setUpdateByOperator(String updateByOperator) {
        this.updateByOperator = updateByOperator;
    }

    public Date getUpdateTime() {
        return this.updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getUpdateTime1() {
        return this.updateTime1;
    }

    public void setUpdateTime1(String updateTime1) {
        this.updateTime1 = updateTime1;
    }

    public String getUpdateTime2() {
        return this.updateTime2;
    }

    public void setUpdateTime2(String updateTime2) {
        this.updateTime2 = updateTime2;
    }

    public String getUpdateTimeOperator() {
        return this.updateTimeOperator;
    }

    public void setUpdateTimeOperator(String updateTimeOperator) {
        this.updateTimeOperator = updateTimeOperator;
    }

    public Date getAppointedTime() {
        return this.appointedTime;
    }

    public void setAppointedTime(Date appointedTime) {
        this.appointedTime = appointedTime;
    }

    public String getAppointedTime1() {
        return this.appointedTime1;
    }

    public void setAppointedTime1(String appointedTime1) {
        this.appointedTime1 = appointedTime1;
    }

    public String getAppointedTime2() {
        return this.appointedTime2;
    }

    public void setAppointedTime2(String appointedTime2) {
        this.appointedTime2 = appointedTime2;
    }

    public String getAppointedTimeOperator() {
        return this.appointedTimeOperator;
    }

    public void setAppointedTimeOperator(String appointedTimeOperator) {
        this.appointedTimeOperator = appointedTimeOperator;
    }

    public String getTriggerType() {
        return this.triggerType;
    }

    public void setTriggerType(String triggerType) {
        this.triggerType = triggerType;
    }

    public String getTriggerTypeOperator() {
        return this.triggerTypeOperator;
    }

    public void setTriggerTypeOperator(String triggerTypeOperator) {
        this.triggerTypeOperator = triggerTypeOperator;
    }

    public String getSubTriggerType() {
        return this.subTriggerType;
    }

    public void setSubTriggerType(String subTriggerType) {
        this.subTriggerType = subTriggerType;
    }

    public String getSubTriggerTypeOperator() {
        return this.subTriggerTypeOperator;
    }

    public void setSubTriggerTypeOperator(String subTriggerTypeOperator) {
        this.subTriggerTypeOperator = subTriggerTypeOperator;
    }

    public String getLastSendTime() {
        return this.lastSendTime;
    }

    public void setLastSendTime(String lastSendTime) {
        this.lastSendTime = lastSendTime;
    }

    public String getLastSendTime1() {
        return this.lastSendTime1;
    }

    public void setLastSendTime1(String lastSendTime1) {
        this.lastSendTime1 = lastSendTime1;
    }

    public String getLastSendTime2() {
        return this.lastSendTime2;
    }

    public void setLastSendTime2(String lastSendTime2) {
        this.lastSendTime2 = lastSendTime2;
    }

    public String getLastSendTimeOperator() {
        return this.lastSendTimeOperator;
    }

    public void setLastSendTimeOperator(String lastSendTimeOperator) {
        this.lastSendTimeOperator = lastSendTimeOperator;
    }

    public String getSendTotalCount() {
        return this.sendTotalCount;
    }

    public void setSendTotalCount(String sendTotalCount) {
        this.sendTotalCount = sendTotalCount;
    }

    public String getSendTotalCountOperator() {
        return this.sendTotalCountOperator;
    }

    public void setSendTotalCountOperator(String sendTotalCountOperator) {
        this.sendTotalCountOperator = sendTotalCountOperator;
    }

    public String getLastSendCount() {
        return this.lastSendCount;
    }

    public void setLastSendCount(String lastSendCount) {
        this.lastSendCount = lastSendCount;
    }

    public String getLastSendCountOperator() {
        return this.lastSendCountOperator;
    }

    public void setLastSendCountOperator(String lastSendCountOperator) {
        this.lastSendCountOperator = lastSendCountOperator;
    }

}
