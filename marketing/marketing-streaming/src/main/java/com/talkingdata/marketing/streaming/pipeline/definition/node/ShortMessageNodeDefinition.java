package com.talkingdata.marketing.streaming.pipeline.definition.node;


import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;

/**
 * 组件-短信
 *@author sheng.hong
 * @create 2017-08-16-下午6:51
 * @since JDK 1.8
 */
public class ShortMessageNodeDefinition extends AbstractNodeDefinition {
    /**组名*/
    private String groupName;
    /**投放组ID*/
    private Integer groupId;
    /**最大投放数(单位：次)*/
    private Integer maxDeliveryCount;
    /**最小频率(单位：天)*/
    private Integer frequency;
    /**投放时间类型（立即-1、定时-2、循环-3）*/
    private Integer triggerType;
    /**循环投放类型（每天-1、每月-2、每周-3）*/
    private Integer subTriggerType;
    /**循环投放时间表达式*/
    private String cronExpression;
    /**定时投放时间, 格式：yyyy-MM-dd HH:mm:ss*/
    private String appointedTime;
    /**渠道标识*/
    private String channelCode;
    /**短信内容*/
    private String content;
    /**黑名单附件名称*/
    private String attachmentName;
    /**黑名单附件ID*/
    private Integer attachmentId;
    /**通道号码(短号)*/
    private String shortCode;
    /**短信链接地址*/
    private String linkAddress;

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public Integer getMaxDeliveryCount() {
        return maxDeliveryCount;
    }

    public void setMaxDeliveryCount(Integer maxDeliveryCount) {
        this.maxDeliveryCount = maxDeliveryCount;
    }

    public Integer getFrequency() {
        return frequency;
    }

    public void setFrequency(Integer frequency) {
        this.frequency = frequency;
    }

    public Integer getTriggerType() {
        return triggerType;
    }

    public void setTriggerType(Integer triggerType) {
        this.triggerType = triggerType;
    }

    public Integer getSubTriggerType() {
        return subTriggerType;
    }

    public void setSubTriggerType(Integer subTriggerType) {
        this.subTriggerType = subTriggerType;
    }

    public String getCronExpression() {
        return cronExpression;
    }

    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    public String getAppointedTime() {
        return appointedTime;
    }

    public void setAppointedTime(String appointedTime) {
        this.appointedTime = appointedTime;
    }

    public String getChannelCode() {
        return channelCode;
    }

    public void setChannelCode(String channelCode) {
        this.channelCode = channelCode;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getAttachmentId() {
        return attachmentId;
    }

    public void setAttachmentId(Integer attachmentId) {
        this.attachmentId = attachmentId;
    }

    public String getShortCode() {
        return shortCode;
    }

    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }

    public String getLinkAddress() {
        return linkAddress;
    }

    public void setLinkAddress(String linkAddress) {
        this.linkAddress = linkAddress;
    }

    public String getAttachmentName() {
        return attachmentName;
    }

    public void setAttachmentName(String attachmentName) {
        this.attachmentName = attachmentName;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("ShortMessageNodeDefinition{");
        sb.append("groupName='").append(groupName).append('\'');
        sb.append(", groupId=").append(groupId);
        sb.append(", maxDeliveryCount=").append(maxDeliveryCount);
        sb.append(", frequency=").append(frequency);
        sb.append(", triggerType=").append(triggerType);
        sb.append(", subTriggerType=").append(subTriggerType);
        sb.append(", cronExpression='").append(cronExpression).append('\'');
        sb.append(", appointedTime='").append(appointedTime).append('\'');
        sb.append(", channelCode='").append(channelCode).append('\'');
        sb.append(", content='").append(content).append('\'');
        sb.append(", attachmentName='").append(attachmentName).append('\'');
        sb.append(", attachmentId=").append(attachmentId);
        sb.append(", shortCode='").append(shortCode).append('\'');
        sb.append(", linkAddress='").append(linkAddress).append('\'');
        sb.append(", AbstractNodeDefinition=").append(super.toString());
        sb.append('}');
        return sb.toString();
    }
}
