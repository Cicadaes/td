package com.talkingdata.marketing.streaming.pipeline.definition.node;


import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;

import java.util.List;
import java.util.Map;

/**
 * 组件-push
 *
 * @create 2017-08-16-下午6:36
 * @since JDK 1.8
 * @author sheng.hong
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
    /**投放时间类型（立即-1、定时-2、循环-3）*/
    private Integer triggerType;
    /**循环投放类型（每天-1、每月-2、每周-3）*/
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

    public String getAppointedTime() {
        return appointedTime;
    }

    public void setAppointedTime(String appointedTime) {
        this.appointedTime = appointedTime;
    }

    public String getCronExpression() {
        return cronExpression;
    }

    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    public Integer getTimeToLive() {
        return timeToLive;
    }

    public void setTimeToLive(Integer timeToLive) {
        this.timeToLive = timeToLive;
    }

    public Integer getEnhancedChannelId() {
        return enhancedChannelId;
    }

    public void setEnhancedChannelId(Integer enhancedChannelId) {
        this.enhancedChannelId = enhancedChannelId;
    }

    public String getEnhancedChannelName() {
        return enhancedChannelName;
    }

    public void setEnhancedChannelName(String enhancedChannelName) {
        this.enhancedChannelName = enhancedChannelName;
    }

    public Boolean getAction() {
        return action;
    }

    public void setAction(Boolean action) {
        this.action = action;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getClearable() {
        return clearable;
    }

    public void setClearable(Boolean clearable) {
        this.clearable = clearable;
    }

    public Boolean getVibrate() {
        return vibrate;
    }

    public void setVibrate(Boolean vibrate) {
        this.vibrate = vibrate;
    }

    public Boolean getWakeup() {
        return wakeup;
    }

    public void setWakeup(Boolean wakeup) {
        this.wakeup = wakeup;
    }

    public List<CustomParam> getExtendAttr() {
        return extendAttr;
    }

    public void setExtendAttr(List<CustomParam> extendAttr) {
        this.extendAttr = extendAttr;
    }

    public Boolean getXiaomi() {
        return xiaomi;
    }

    public void setXiaomi(Boolean xiaomi) {
        this.xiaomi = xiaomi;
    }

    public Boolean getHuawei() {
        return huawei;
    }

    public void setHuawei(Boolean huawei) {
        this.huawei = huawei;
    }

    public Integer getSound() {
        return sound;
    }

    public void setSound(Integer sound) {
        this.sound = sound;
    }

    public String getSoundName() {
        return soundName;
    }

    public void setSoundName(String soundName) {
        this.soundName = soundName;
    }

    public Integer getBadge() {
        return badge;
    }

    public void setBadge(Integer badge) {
        this.badge = badge;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public Integer getProd() {
        return prod;
    }

    public void setProd(Integer prod) {
        this.prod = prod;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getAppid() {
        return appid;
    }

    public void setAppid(String appid) {
        this.appid = appid;
    }

    public Map<String, String> getEquitys() {
        return equitys;
    }

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
