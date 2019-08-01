package com.talkingdata.marketing.core.entity.thirdmodel.channel;

import java.util.Map;
import java.util.UUID;

/**
 * The type Reach segment.
 * @author xiaoming.kang
 */
public class ReachSegment {
    private String id = UUID.randomUUID().toString();
    /**渠道类型 1、PUSH 2、SMS 3、EDM 4、Wechat 5、Ad
	*/
    private Integer channelType;
    /**触发类型 1、立即发送 2、定时发送 3、循环发送
	*/
    private Integer triggerType;
    /**触发子类型, 仅当触发类型为3(循环发送)时才有该值 1、每分钟发送 2、每小时发送 3、每天发送 4、每周发送 5、每月发送
	*/
    private Integer subTriggerType;
    /**Crontab 表达式，仅当触发类型为3(循环发送)时才有该值
	*/
    private String cronExpression;
    /**指定时间字符串，仅当触发类型为2(定时发送)时才有该值，格式为：YYYY-MM-dd hh24:mi:ss
	*/
    private String appointedTime;
    /**推送文件路径，暂时为HDFS路径，路径必须以HDFS://
	*/
    private String reachSegmentFilePath;
    /**短信通道内容/EDM通道内容
	*/
    private Map<String, Object> data;

    /**
     * Gets id.
     *
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * Sets id.
     *
     * @param id the id
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Gets channel type.
     *
     * @return the channel type
     */
    public Integer getChannelType() {
        return channelType;
    }

    /**
     * Sets channel type.
     *
     * @param channelType the channel type
     */
    public void setChannelType(Integer channelType) {
        this.channelType = channelType;
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
     * Gets reach segment file path.
     *
     * @return the reach segment file path
     */
    public String getReachSegmentFilePath() {
        return reachSegmentFilePath;
    }

    /**
     * Sets reach segment file path.
     *
     * @param reachSegmentFilePath the reach segment file path
     */
    public void setReachSegmentFilePath(String reachSegmentFilePath) {
        this.reachSegmentFilePath = reachSegmentFilePath;
    }

    /**
     * Gets data.
     *
     * @return the data
     */
    public Map<String, Object> getData() {
        return data;
    }

    /**
     * Sets data.
     *
     * @param data the data
     */
    public void setData(Map<String, Object> data) {
        this.data = data;
    }
}
