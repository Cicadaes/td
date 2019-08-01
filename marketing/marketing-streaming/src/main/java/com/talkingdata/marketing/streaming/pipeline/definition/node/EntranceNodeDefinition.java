package com.talkingdata.marketing.streaming.pipeline.definition.node;


import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.PipelineRuleDefinition;

/**
 * 组件-入口
 *
 * @create 2017-08-16-下午6:27
 * @author sheng.hong
 * @since JDK 1.8
 */
public class EntranceNodeDefinition extends AbstractNodeDefinition {
    /**人群类型*/
    private Integer crowdType;
    /**人群ID*/
    private Integer crowdId;
    /**人群名称*/
    private String crowdName;
    /**人群版本*/
    private String crowdVersion;
    /**人群描述*/
    private String crowdDescription;
    /**人群计算策略(频率)*/
    private Integer calcType;
    /**天数*/
    private Integer period;
    /**规则定义-保存进入和禁止*/
    private PipelineRuleDefinition ruleDefinition;
    /**无限制，该值为true时，lessThanTimes和lessThanDays无值*/
    private Boolean unlimited;
    /**少于XX次，即用户进入次数不超过XX次*/
    private Integer lessThanTimes;
    /**少于XX天，即用户XX天内不进行入*/
    private Integer lessThanDays;
    /**禁止规则*/
    private String forbiddenExpression;
    /**自动更新人群，true-是，false-否*/
    private Boolean autoUpdateCrowd;
    private Integer refId;

    public Boolean getUnlimited() {
        return unlimited;
    }

    public void setUnlimited(Boolean unlimited) {
        this.unlimited = unlimited;
    }

    public Integer getCrowdType() {
        return crowdType;
    }

    public void setCrowdType(Integer crowdType) {
        this.crowdType = crowdType;
    }

    public Integer getCrowdId() {
        return crowdId;
    }

    public void setCrowdId(Integer crowdId) {
        this.crowdId = crowdId;
    }

    public String getCrowdName() {
        return crowdName;
    }

    public void setCrowdName(String crowdName) {
        this.crowdName = crowdName;
    }

    public String getCrowdVersion() {
        return crowdVersion;
    }

    public void setCrowdVersion(String crowdVersion) {
        this.crowdVersion = crowdVersion;
    }

    public String getCrowdDescription() {
        return crowdDescription;
    }

    public void setCrowdDescription(String crowdDescription) {
        this.crowdDescription = crowdDescription;
    }

    public Integer getCalcType() {
        return calcType;
    }

    public void setCalcType(Integer calcType) {
        this.calcType = calcType;
    }

    public Integer getPeriod() {
        return period;
    }

    public void setPeriod(Integer period) {
        this.period = period;
    }

    public PipelineRuleDefinition getRuleDefinition() {
        return ruleDefinition;
    }

    public void setRuleDefinition(PipelineRuleDefinition ruleDefinition) {
        this.ruleDefinition = ruleDefinition;
    }

    public Integer getLessThanTimes() {
        return lessThanTimes;
    }

    public void setLessThanTimes(Integer lessThanTimes) {
        this.lessThanTimes = lessThanTimes;
    }

    public Integer getLessThanDays() {
        return lessThanDays;
    }

    public void setLessThanDays(Integer lessThanDays) {
        this.lessThanDays = lessThanDays;
    }

    public String getForbiddenExpression() {
        return forbiddenExpression;
    }

    public void setForbiddenExpression(String forbiddenExpression) {
        this.forbiddenExpression = forbiddenExpression;
    }

    public Boolean getAutoUpdateCrowd() {
        return autoUpdateCrowd;
    }

    public void setAutoUpdateCrowd(Boolean autoUpdateCrowd) {
        this.autoUpdateCrowd = autoUpdateCrowd;
    }

    public Integer getRefId() {
        return refId;
    }

    public void setRefId(Integer refId) {
        this.refId = refId;
    }

    @Override
    public String toString() {
        return "EntranceNodeDefinition{" +
                "crowdType=" + crowdType +
                ", crowdId=" + crowdId +
                ", crowdName='" + crowdName + '\'' +
                ", crowdVersion='" + crowdVersion + '\'' +
                ", crowdDescription='" + crowdDescription + '\'' +
                ", calcType=" + calcType +
                ", period=" + period +
                ", ruleDefinition=" + ruleDefinition +
                ", unlimited=" + unlimited +
                ", lessThanTimes=" + lessThanTimes +
                ", lessThanDays=" + lessThanDays +
                ", forbiddenExpression='" + forbiddenExpression + '\'' +
                ", autoUpdateCrowd=" + autoUpdateCrowd +
                ", refId=" + refId +
                '}';
    }
}
