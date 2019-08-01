package com.talkingdata.marketing.core.entity.campaign.definition.node;

import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.core.entity.dto.CustomParam;

import java.util.List;
import java.util.Map;

/**
 * 组件-push
 *
 * @author armeng
 * @create 2017 -08-16-下午6:36
 * @since JDK 1.8
 */
public class PushNodeDefinition extends AbstractNodeDefinition {
    /**组名*/
    private String groupName;
    /**投放组ID*/
    private Integer groupId;
    /**最大投放数(单位：次)*/
    private Integer maxDeliveryCount;
    /**最小频率(单位：天)*/
    private Integer frequency;
    /**投放时间类型（立即、定时、循环）*/
    private Integer triggerType;
    /**循环投放类型（每天、每月、每周）*/
    private Integer subTriggerType;
    /**循环投放时间表达式*/
    private String appointedTime;
    /**定时投放时间, 格式：yyyy-MM-dd HH:mm:ss*/
    private String cronExpression;
    /**离线数据保留时间*/
    private Integer timeToLive;
    /**增强通道ID*/
    private Integer enhancedChannelId;
    /**增强通道名称*/
    private String enhancedChannelName;
    /**true:透传  false:非透传*/
    private Boolean action;
    /**消息标题（应用推送 安卓）*/
    private String title;
    /**消息内容*/
    private String message;
    /**让本条消息不可删除（应用推送 安卓）*/
    private Boolean clearable;
    /**震动提示（应用推送 安卓）*/
    private Boolean vibrate;
    /**唤醒屏幕（应用推送 安卓）*/
    private Boolean wakeup;
    /**自定义参数*/
    private List<CustomParam> extendAttr;
    /**小米增强通道*/
    private Boolean xiaomi;
    /**华为增强通道*/
    private Boolean  huawei;
    /**声音默认为1  代表ios 和 Android都有声音*/
    private Integer sound;
    /**自定义声音*/
    private String soundName;
    /**数字角标*/
    private Integer badge;
    /**推送通道*/
    private String channel;
    /**Ios推送通道选择（测试、生产）*/
    private Integer prod;
    /**a, i 目标平台*/
    private String platform;
    /**App选择*/
    private String appid;
    /**权益(权益编码,权益名称)*/
    private Map<String, String> equitys;

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
     * Gets time to live.
     *
     * @return the time to live
     */
    public Integer getTimeToLive() {
        return timeToLive;
    }

    /**
     * Sets time to live.
     *
     * @param timeToLive the time to live
     */
    public void setTimeToLive(Integer timeToLive) {
        this.timeToLive = timeToLive;
    }

    /**
     * Gets enhanced channel id.
     *
     * @return the enhanced channel id
     */
    public Integer getEnhancedChannelId() {
        return enhancedChannelId;
    }

    /**
     * Sets enhanced channel id.
     *
     * @param enhancedChannelId the enhanced channel id
     */
    public void setEnhancedChannelId(Integer enhancedChannelId) {
        this.enhancedChannelId = enhancedChannelId;
    }

    /**
     * Gets enhanced channel name.
     *
     * @return the enhanced channel name
     */
    public String getEnhancedChannelName() {
        return enhancedChannelName;
    }

    /**
     * Sets enhanced channel name.
     *
     * @param enhancedChannelName the enhanced channel name
     */
    public void setEnhancedChannelName(String enhancedChannelName) {
        this.enhancedChannelName = enhancedChannelName;
    }

    /**
     * Gets action.
     *
     * @return the action
     */
    public Boolean getAction() {
        return action;
    }

    /**
     * Sets action.
     *
     * @param action the action
     */
    public void setAction(Boolean action) {
        this.action = action;
    }

    /**
     * Gets title.
     *
     * @return the title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets title.
     *
     * @param title the title
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Gets message.
     *
     * @return the message
     */
    public String getMessage() {
        return message;
    }

    /**
     * Sets message.
     *
     * @param message the message
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * Gets clearable.
     *
     * @return the clearable
     */
    public Boolean getClearable() {
        return clearable;
    }

    /**
     * Sets clearable.
     *
     * @param clearable the clearable
     */
    public void setClearable(Boolean clearable) {
        this.clearable = clearable;
    }

    /**
     * Gets vibrate.
     *
     * @return the vibrate
     */
    public Boolean getVibrate() {
        return vibrate;
    }

    /**
     * Sets vibrate.
     *
     * @param vibrate the vibrate
     */
    public void setVibrate(Boolean vibrate) {
        this.vibrate = vibrate;
    }

    /**
     * Gets wakeup.
     *
     * @return the wakeup
     */
    public Boolean getWakeup() {
        return wakeup;
    }

    /**
     * Sets wakeup.
     *
     * @param wakeup the wakeup
     */
    public void setWakeup(Boolean wakeup) {
        this.wakeup = wakeup;
    }

    /**
     * Gets extend attr.
     *
     * @return the extend attr
     */
    public List<CustomParam> getExtendAttr() {
        return extendAttr;
    }

    /**
     * Sets extend attr.
     *
     * @param extendAttr the extend attr
     */
    public void setExtendAttr(List<CustomParam> extendAttr) {
        this.extendAttr = extendAttr;
    }

    /**
     * Gets xiaomi.
     *
     * @return the xiaomi
     */
    public Boolean getXiaomi() {
        return xiaomi;
    }

    /**
     * Sets xiaomi.
     *
     * @param xiaomi the xiaomi
     */
    public void setXiaomi(Boolean xiaomi) {
        this.xiaomi = xiaomi;
    }

    /**
     * Gets huawei.
     *
     * @return the huawei
     */
    public Boolean getHuawei() {
        return huawei;
    }

    /**
     * Sets huawei.
     *
     * @param huawei the huawei
     */
    public void setHuawei(Boolean huawei) {
        this.huawei = huawei;
    }

    /**
     * Gets sound.
     *
     * @return the sound
     */
    public Integer getSound() {
        return sound;
    }

    /**
     * Sets sound.
     *
     * @param sound the sound
     */
    public void setSound(Integer sound) {
        this.sound = sound;
    }

    /**
     * Gets sound name.
     *
     * @return the sound name
     */
    public String getSoundName() {
        return soundName;
    }

    /**
     * Sets sound name.
     *
     * @param soundName the sound name
     */
    public void setSoundName(String soundName) {
        this.soundName = soundName;
    }

    /**
     * Gets badge.
     *
     * @return the badge
     */
    public Integer getBadge() {
        return badge;
    }

    /**
     * Sets badge.
     *
     * @param badge the badge
     */
    public void setBadge(Integer badge) {
        this.badge = badge;
    }

    /**
     * Gets channel.
     *
     * @return the channel
     */
    public String getChannel() {
        return channel;
    }

    /**
     * Sets channel.
     *
     * @param channel the channel
     */
    public void setChannel(String channel) {
        this.channel = channel;
    }

    /**
     * Gets prod.
     *
     * @return the prod
     */
    public Integer getProd() {
        return prod;
    }

    /**
     * Sets prod.
     *
     * @param prod the prod
     */
    public void setProd(Integer prod) {
        this.prod = prod;
    }

    /**
     * Gets platform.
     *
     * @return the platform
     */
    public String getPlatform() {
        return platform;
    }

    /**
     * Sets platform.
     *
     * @param platform the platform
     */
    public void setPlatform(String platform) {
        this.platform = platform;
    }

    /**
     * Gets appid.
     *
     * @return the appid
     */
    public String getAppid() {
        return appid;
    }

    /**
     * Sets appid.
     *
     * @param appid the appid
     */
    public void setAppid(String appid) {
        this.appid = appid;
    }

    /**
     * Gets equitys.
     *
     * @return the equitys
     */
    public Map<String, String> getEquitys() {
        return equitys;
    }

    /**
     * Sets equitys.
     *
     * @param equitys the equitys
     */
    public void setEquitys(Map<String, String> equitys) {
        this.equitys = equitys;
    }

    @Override
    public String toString() {
        return "PushNodeDefinition{" +
                "groupName='" + groupName + '\'' +
                ", groupId=" + groupId +
                ", maxDeliveryCount=" + maxDeliveryCount +
                ", frequency=" + frequency +
                ", triggerType=" + triggerType +
                ", subTriggerType=" + subTriggerType +
                ", appointedTime='" + appointedTime + '\'' +
                ", cronExpression='" + cronExpression + '\'' +
                ", timeToLive=" + timeToLive +
                ", enhancedChannelId=" + enhancedChannelId +
                ", enhancedChannelName='" + enhancedChannelName + '\'' +
                ", action=" + action +
                ", title='" + title + '\'' +
                ", message='" + message + '\'' +
                ", clearable=" + clearable +
                ", vibrate=" + vibrate +
                ", wakeup=" + wakeup +
                ", extendAttr=" + extendAttr +
                ", xiaomi=" + xiaomi +
                ", huawei=" + huawei +
                ", sound=" + sound +
                ", soundName='" + soundName + '\'' +
                ", badge=" + badge +
                ", channel='" + channel + '\'' +
                ", prod=" + prod +
                ", platform='" + platform + '\'' +
                ", appid='" + appid + '\'' +
                ", equitys=" + equitys +
                '}';
    }
}
