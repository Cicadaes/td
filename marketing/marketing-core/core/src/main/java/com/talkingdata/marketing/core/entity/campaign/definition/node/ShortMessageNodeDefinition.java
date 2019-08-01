package com.talkingdata.marketing.core.entity.campaign.definition.node;


import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;


/**
 * 组件-短信
 *
 * @author armeng
 * @create 2017 -08-16-下午6:51
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

    /**
     * Gets group name.
     *
     * @return the group name
     */
    public String getGroupName() {
        return groupName;
    }

    /**
     * Sets group name.
     *
     * @param groupName the group name
     */
    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    /**
     * Gets max delivery count.
     *
     * @return the max delivery count
     */
    public Integer getMaxDeliveryCount() {
        return maxDeliveryCount;
    }

    /**
     * Sets max delivery count.
     *
     * @param maxDeliveryCount the max delivery count
     */
    public void setMaxDeliveryCount(Integer maxDeliveryCount) {
        this.maxDeliveryCount = maxDeliveryCount;
    }

    /**
     * Gets frequency.
     *
     * @return the frequency
     */
    public Integer getFrequency() {
        return frequency;
    }

    /**
     * Sets frequency.
     *
     * @param frequency the frequency
     */
    public void setFrequency(Integer frequency) {
        this.frequency = frequency;
    }

    /**
     * Gets trigger type.
     *
     * @return the trigger type
     */
    public Integer getTriggerType() {
        return triggerType;
    }

    /**
     * Sets trigger type.
     *
     * @param triggerType the trigger type
     */
    public void setTriggerType(Integer triggerType) {
        this.triggerType = triggerType;
    }

    /**
     * Gets sub trigger type.
     *
     * @return the sub trigger type
     */
    public Integer getSubTriggerType() {
        return subTriggerType;
    }

    /**
     * Sets sub trigger type.
     *
     * @param subTriggerType the sub trigger type
     */
    public void setSubTriggerType(Integer subTriggerType) {
        this.subTriggerType = subTriggerType;
    }

    /**
     * Gets cron expression.
     *
     * @return the cron expression
     */
    public String getCronExpression() {
        return cronExpression;
    }

    /**
     * Sets cron expression.
     *
     * @param cronExpression the cron expression
     */
    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    /**
     * Gets appointed time.
     *
     * @return the appointed time
     */
    public String getAppointedTime() {
        return appointedTime;
    }

    /**
     * Sets appointed time.
     *
     * @param appointedTime the appointed time
     */
    public void setAppointedTime(String appointedTime) {
        this.appointedTime = appointedTime;
    }

    /**
     * Gets channel code.
     *
     * @return the channel code
     */
    public String getChannelCode() {
        return channelCode;
    }

    /**
     * Sets channel code.
     *
     * @param channelCode the channel code
     */
    public void setChannelCode(String channelCode) {
        this.channelCode = channelCode;
    }

    /**
     * Gets content.
     *
     * @return the content
     */
    public String getContent() {
        return content;
    }

    /**
     * Sets content.
     *
     * @param content the content
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * Gets attachment id.
     *
     * @return the attachment id
     */
    public Integer getAttachmentId() {
        return attachmentId;
    }

    /**
     * Sets attachment id.
     *
     * @param attachmentId the attachment id
     */
    public void setAttachmentId(Integer attachmentId) {
        this.attachmentId = attachmentId;
    }

    /**
     * Gets short code.
     *
     * @return the short code
     */
    public String getShortCode() {
        return shortCode;
    }

    /**
     * Sets short code.
     *
     * @param shortCode the short code
     */
    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }

    /**
     * Gets link address.
     *
     * @return the link address
     */
    public String getLinkAddress() {
        return linkAddress;
    }

    /**
     * Sets link address.
     *
     * @param linkAddress the link address
     */
    public void setLinkAddress(String linkAddress) {
        this.linkAddress = linkAddress;
    }

    /**
     * Gets attachment name.
     *
     * @return the attachment name
     */
    public String getAttachmentName() {
        return attachmentName;
    }

    /**
     * Sets attachment name.
     *
     * @param attachmentName the attachment name
     */
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
        sb.append(", triggerType='").append(triggerType).append('\'');
        sb.append(", subTriggerType='").append(subTriggerType).append('\'');
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
