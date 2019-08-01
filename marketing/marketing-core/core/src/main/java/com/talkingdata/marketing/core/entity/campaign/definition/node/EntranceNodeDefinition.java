package com.talkingdata.marketing.core.entity.campaign.definition.node;

import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.PipelineRuleDefinition;

/**
 * 组件-入口
 *
 * @author armeng
 * @create 2017 -08-16-下午6:27
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

    /**
     * Gets unlimited.
     *
     * @return the unlimited
     */
    public Boolean getUnlimited() {
        return unlimited;
    }

    /**
     * Sets unlimited.
     *
     * @param unlimited the unlimited
     */
    public void setUnlimited(Boolean unlimited) {
        this.unlimited = unlimited;
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
     * Gets crowd name.
     *
     * @return the crowd name
     */
    public String getCrowdName() {
        return crowdName;
    }

    /**
     * Sets crowd name.
     *
     * @param crowdName the crowd name
     */
    public void setCrowdName(String crowdName) {
        this.crowdName = crowdName;
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
     * Gets crowd description.
     *
     * @return the crowd description
     */
    public String getCrowdDescription() {
        return crowdDescription;
    }

    /**
     * Sets crowd description.
     *
     * @param crowdDescription the crowd description
     */
    public void setCrowdDescription(String crowdDescription) {
        this.crowdDescription = crowdDescription;
    }

    /**
     * Gets calc type.
     *
     * @return the calc type
     */
    public Integer getCalcType() {
        return calcType;
    }

    /**
     * Sets calc type.
     *
     * @param calcType the calc type
     */
    public void setCalcType(Integer calcType) {
        this.calcType = calcType;
    }

    /**
     * Gets period.
     *
     * @return the period
     */
    public Integer getPeriod() {
        return period;
    }

    /**
     * Sets period.
     *
     * @param period the period
     */
    public void setPeriod(Integer period) {
        this.period = period;
    }

    /**
     * Gets rule definition.
     *
     * @return the rule definition
     */
    public PipelineRuleDefinition getRuleDefinition() {
        return ruleDefinition;
    }

    /**
     * Sets rule definition.
     *
     * @param ruleDefinition the rule definition
     */
    public void setRuleDefinition(PipelineRuleDefinition ruleDefinition) {
        this.ruleDefinition = ruleDefinition;
    }

    /**
     * Gets less than times.
     *
     * @return the less than times
     */
    public Integer getLessThanTimes() {
        return lessThanTimes;
    }

    /**
     * Sets less than times.
     *
     * @param lessThanTimes the less than times
     */
    public void setLessThanTimes(Integer lessThanTimes) {
        this.lessThanTimes = lessThanTimes;
    }

    /**
     * Gets less than days.
     *
     * @return the less than days
     */
    public Integer getLessThanDays() {
        return lessThanDays;
    }

    /**
     * Sets less than days.
     *
     * @param lessThanDays the less than days
     */
    public void setLessThanDays(Integer lessThanDays) {
        this.lessThanDays = lessThanDays;
    }

    /**
     * Gets forbidden expression.
     *
     * @return the forbidden expression
     */
    public String getForbiddenExpression() {
        return forbiddenExpression;
    }

    /**
     * Sets forbidden expression.
     *
     * @param forbiddenExpression the forbidden expression
     */
    public void setForbiddenExpression(String forbiddenExpression) {
        this.forbiddenExpression = forbiddenExpression;
    }

    /**
     * Gets auto update crowd.
     *
     * @return the auto update crowd
     */
    public Boolean getAutoUpdateCrowd() {
        return autoUpdateCrowd;
    }

    /**
     * Sets auto update crowd.
     *
     * @param autoUpdateCrowd the auto update crowd
     */
    public void setAutoUpdateCrowd(Boolean autoUpdateCrowd) {
        this.autoUpdateCrowd = autoUpdateCrowd;
    }

    /**
     * Gets ref id.
     *
     * @return the ref id
     */
    public Integer getRefId() {
        return refId;
    }

    /**
     * Sets ref id.
     *
     * @param refId the ref id
     */
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
