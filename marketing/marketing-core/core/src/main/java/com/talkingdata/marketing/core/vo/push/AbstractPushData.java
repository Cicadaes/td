package com.talkingdata.marketing.core.vo.push;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.talkingdata.marketing.core.constant.ChannelConstants;
import com.talkingdata.marketing.core.util.JsonUtil;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author xiaoming.kang
 * @date 2018/01/03
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "channelType",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = AppPushData.class, name = "1"),
        @JsonSubTypes.Type(value = SmsPushData.class, name = "2"),
        @JsonSubTypes.Type(value = EDMPushData.class, name = "3"),
        @JsonSubTypes.Type(value = WechatPushData.class, name = "4"),
})
public abstract class AbstractPushData {


    /**
     * ID编码,使用UUID生成
     */
    private String id;

    //private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    /**
     * 名称
     */
    private String name;
    /**
     * 活动ID
     */
    private Integer campaignId;
    /**
     * 投放单元ID
     */
    private Integer campaignLaunchUnitId;
    /**
     * 人群版本
     */
    private String crowdVersion;
    /**
     * 人群ID
     */
    private Integer crowdId;
    /**
     * 人群类型
     */
    private Integer crowdType;
    /**
     * 渠道类型 1、PUSH 2、SMS 3、EDM 4、Wechat 5、Ad
     * @see com.talkingdata.marketing.core.constant.ChannelConstants
     *
     */
    private Integer channelType;
    /**
     * 渠道编码  部分情况下才有.
     */
    private String channelCode;
    /**
     * 触发类型 1、立即发送 2、定时发送 3、循环发送
     * @see com.talkingdata.marketing.core.constant.TriggerConstants.TriggerTypeConstants
     */
    private Integer triggerType;
    /**
     * 触发子类型, 仅当触发类型为3(循环发送)时才有该值 1、每分钟发送 2、每小时发送 3、每天发送 4、每周发送 5、每月发送
     * @see com.talkingdata.marketing.core.constant.TriggerConstants.SubTriggerTypeConstants
     */
    private Integer subTriggerType;
    /**
     * Crontab 表达式，仅当触发类型为3(循环发送)时才有该值
     */
    private String cronExpression;
    /**
     * 指定时间字符串，仅当触发类型为2(定时发送)时才有该值，格式为：YYYY-MM-dd hh24:mi:ss
     */
    private Long appointedTime;
    /**
     * 子人群版本
     */
    private Integer subCrowdId;
    /**
     * 子人群类型
     */
    private Integer subCrowdType;
    /**
     * 子人群名称
     */
    private String subCrowdName;
    /**
     * 子人群版本
     */
    private String subCrowdVersion;
    /**
     * 投放前自动刷新人群配置
     */
    private Integer crowdUpdateType;
    /**
     * 状态
     */
    private Integer status;
    private String uploadUUID;
    private String reachFilePath;

    /**
     * The entry point of application.
     *
     * @param args the input arguments
     * @throws IOException the io exception
     */
    public static void main(String[] args) throws IOException {
        String a =
            "{\"name\":\"asd\",\"triggerType\":\"2\",\"channelCode\":\"smschannel1\",\"fromName\":\"kangxiaoming\","
                    + "\"content\":\"这个是内容\",\"appointedTime\":1516204800000,\"campaignLaunchUnitId\":668,"
                    + "\"campaignId\":\"363\",\"crowdId\":899,\"crowdType\":3,\"crowdVersion\":\"1515491332023\","
                    + "\"status\":1,\"sign\":\"签名\",\"channelNumber\":\"144\",\"crowdUpdateType\":0,\"channelType\":2}";

        ObjectMapper om = new ObjectMapper();
        AbstractPushData pushDa = om.readValue(a, AbstractPushData.class);

        System.out.println(pushDa.getClass().getName());

    }

    /**
     * Build push data abstract push data.
     *
     * @param segment the segment
     * @return the abstract push data
     */
    public static AbstractPushData buildPushData(String segment) throws IOException {
        AbstractPushData data = JsonUtil.toObject(segment, AbstractPushData.class);
        return data;
    }

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
     * Gets name.
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name.
     *
     * @param name the name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets campaign id.
     *
     * @return the campaign id
     */
    public Integer getCampaignId() {
        return campaignId;
    }

    /**
     * Sets campaign id.
     *
     * @param campaignId the campaign id
     */
    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    /**
     * Gets campaign launch unit id.
     *
     * @return the campaign launch unit id
     */
    public Integer getCampaignLaunchUnitId() {
        return campaignLaunchUnitId;
    }

    /**
     * Sets campaign launch unit id.
     *
     * @param campaignLaunchUnitId the campaign launch unit id
     */
    public void setCampaignLaunchUnitId(Integer campaignLaunchUnitId) {
        this.campaignLaunchUnitId = campaignLaunchUnitId;
    }

    /**
     * Gets crowd version.
     *
     * @return the crowd version
     */
    public String getCrowdVersion() {
        return crowdVersion;
    }

    /**
     * Sets crowd version.
     *
     * @param crowdVersion the crowd version
     */
    public void setCrowdVersion(String crowdVersion) {
        this.crowdVersion = crowdVersion;
    }

    /**
     * Gets crowd type.
     *
     * @return the crowd type
     */
    public Integer getCrowdType() {
        return crowdType;
    }

    /**
     * Sets crowd type.
     *
     * @param crowdType the crowd type
     */
    public void setCrowdType(Integer crowdType) {
        this.crowdType = crowdType;
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
    public Long getAppointedTime() {
        return appointedTime;
    }

    /**
     * Sets appointed time.
     *
     * @param appointedTime the appointed time
     */
    public void setAppointedTime(Long appointedTime) {
        this.appointedTime = appointedTime;
    }

    /**
     * Gets crowd id.
     *
     * @return the crowd id
     */
    public Integer getCrowdId() {
        return crowdId;
    }

    /**
     * Sets crowd id.
     *
     * @param crowdId the crowd id
     */
    public void setCrowdId(Integer crowdId) {
        this.crowdId = crowdId;
    }

    /**
     * Gets sub crowd id.
     *
     * @return the sub crowd id
     */
    public Integer getSubCrowdId() {
        return subCrowdId;
    }

    /**
     * Sets sub crowd id.
     *
     * @param subCrowdId the sub crowd id
     */
    public void setSubCrowdId(Integer subCrowdId) {
        this.subCrowdId = subCrowdId;
    }

    /**
     * Gets sub crowd type.
     *
     * @return the sub crowd type
     */
    public Integer getSubCrowdType() {
        return subCrowdType;
    }

    /**
     * Sets sub crowd type.
     *
     * @param subCrowdType the sub crowd type
     */
    public void setSubCrowdType(Integer subCrowdType) {
        this.subCrowdType = subCrowdType;
    }

    /**
     * Gets sub crowd version.
     *
     * @return the sub crowd version
     */
    public String getSubCrowdVersion() {
        return subCrowdVersion;
    }

    /**
     * Sets sub crowd version.
     *
     * @param subCrowdVersion the sub crowd version
     */
    public void setSubCrowdVersion(String subCrowdVersion) {
        this.subCrowdVersion = subCrowdVersion;
    }

    /**
     * Gets crowd update type.
     *
     * @return the crowd update type
     */
    public Integer getCrowdUpdateType() {
        return crowdUpdateType;
    }

    /**
     * Sets crowd update type.
     *
     * @param crowdUpdateType the crowd update type
     */
    public void setCrowdUpdateType(Integer crowdUpdateType) {
        this.crowdUpdateType = crowdUpdateType;
    }

    /**
     * Gets status.
     *
     * @return the status
     */
    public Integer getStatus() {
        return status;
    }

    /**
     * Sets status.
     *
     * @param status the status
     */
    public void setStatus(Integer status) {
        this.status = status;
    }

    /**
     * Gets upload uuid.
     *
     * @return the upload uuid
     */
    public String getUploadUUID() {
        return uploadUUID;
    }

    /**
     * Sets upload uuid.
     *
     * @param uploadUUID the upload uuid
     */
    public void setUploadUUID(String uploadUUID) {
        this.uploadUUID = uploadUUID;
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
     * Gets sub crowd name.
     *
     * @return the sub crowd name
     */
    public String getSubCrowdName() {
        return subCrowdName;
    }

    /**
     * Sets sub crowd name.
     *
     * @param subCrowdName the sub crowd name
     */
    public void setSubCrowdName(String subCrowdName) {
        this.subCrowdName = subCrowdName;
    }

    /**
     * Gets reach file path.
     *
     * @return the reach file path
     */
    public String getReachFilePath() {
        return reachFilePath;
    }

    /**
     * Sets reach file path.
     *
     * @param reachFilePath the reach file path
     */
    public void setReachFilePath(String reachFilePath) {
        this.reachFilePath = reachFilePath;
    }

}
