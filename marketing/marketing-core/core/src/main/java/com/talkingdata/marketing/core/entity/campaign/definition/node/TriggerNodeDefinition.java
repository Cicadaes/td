package com.talkingdata.marketing.core.entity.campaign.definition.node;


import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;

import java.util.List;

/**
 * 组件-触发器
 *
 * @author armeng
 * @create 2017 -08-16-下午6:59
 * @since JDK 1.8
 */
public class TriggerNodeDefinition extends AbstractNodeDefinition {
    /**监测类型*/
    private Integer monitorType;
    /**监视开始时间*/
    private Long startTime;
    /**监视结束时间*/
    private Long endTime;
    /**XX时内，即距到达上一节点XX小时内*/
    private Integer lessThanHour;
    /**分支类型*/
    private Integer branchType;
    /**主表达式*/
    private List<String> mainExpression;
    /**附件表达式*/
    private List<String> additionExpression;
    /**无限制*/
    private Integer unlimited;
    /**同一用户XX天内不被重复触发*/
    private Integer sameUserLessThanDays;
    /**同一用户同一分支重复触发次数不超过XX次*/
    private Integer sameUserLessThanTimes;
    /**同一用户达到更大的指标值可再次触发或同一用户达到更小的指标值可再次触发*/
    private Integer sameUserTarget;
    /**事件 指标*/
    private String targetType;

    /**
     * Gets target type.
     *
     * @return the target type
     */
    public String getTargetType() {
        return targetType;
    }

    /**
     * Sets target type.
     *
     * @param targetType the target type
     */
    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    /**
     * Gets monitor type.
     *
     * @return the monitor type
     */
    public Integer getMonitorType() {
        return monitorType;
    }

    /**
     * Sets monitor type.
     *
     * @param monitorType the monitor type
     */
    public void setMonitorType(Integer monitorType) {
        this.monitorType = monitorType;
    }

    /**
     * Gets start time.
     *
     * @return the start time
     */
    public Long getStartTime() {
        return startTime;
    }

    /**
     * Sets start time.
     *
     * @param startTime the start time
     */
    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    /**
     * Gets end time.
     *
     * @return the end time
     */
    public Long getEndTime() {
        return endTime;
    }

    /**
     * Sets end time.
     *
     * @param endTime the end time
     */
    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }

    /**
     * Gets less than hour.
     *
     * @return the less than hour
     */
    public Integer getLessThanHour() {
        return lessThanHour;
    }

    /**
     * Sets less than hour.
     *
     * @param lessThanHour the less than hour
     */
    public void setLessThanHour(Integer lessThanHour) {
        this.lessThanHour = lessThanHour;
    }

    /**
     * Gets branch type.
     *
     * @return the branch type
     */
    public Integer getBranchType() {
        return branchType;
    }

    /**
     * Sets branch type.
     *
     * @param branchType the branch type
     */
    public void setBranchType(Integer branchType) {
        this.branchType = branchType;
    }

    /**
     * Gets main expression.
     *
     * @return the main expression
     */
    public List<String> getMainExpression() {
        return mainExpression;
    }

    /**
     * Sets main expression.
     *
     * @param mainExpression the main expression
     */
    public void setMainExpression(List<String> mainExpression) {
        this.mainExpression = mainExpression;
    }

    /**
     * Gets addition expression.
     *
     * @return the addition expression
     */
    public List<String> getAdditionExpression() {
        return additionExpression;
    }

    /**
     * Sets addition expression.
     *
     * @param additionExpression the addition expression
     */
    public void setAdditionExpression(List<String> additionExpression) {
        this.additionExpression = additionExpression;
    }

    /**
     * Gets unlimited.
     *
     * @return the unlimited
     */
    public Integer getUnlimited() {
        return unlimited;
    }

    /**
     * Sets unlimited.
     *
     * @param unlimited the unlimited
     */
    public void setUnlimited(Integer unlimited) {
        this.unlimited = unlimited;
    }

    /**
     * Gets same user less than days.
     *
     * @return the same user less than days
     */
    public Integer getSameUserLessThanDays() {
        return sameUserLessThanDays;
    }

    /**
     * Sets same user less than days.
     *
     * @param sameUserLessThanDays the same user less than days
     */
    public void setSameUserLessThanDays(Integer sameUserLessThanDays) {
        this.sameUserLessThanDays = sameUserLessThanDays;
    }

    /**
     * Gets same user less than times.
     *
     * @return the same user less than times
     */
    public Integer getSameUserLessThanTimes() {
        return sameUserLessThanTimes;
    }

    /**
     * Sets same user less than times.
     *
     * @param sameUserLessThanTimes the same user less than times
     */
    public void setSameUserLessThanTimes(Integer sameUserLessThanTimes) {
        this.sameUserLessThanTimes = sameUserLessThanTimes;
    }

    /**
     * Gets same user target.
     *
     * @return the same user target
     */
    public Integer getSameUserTarget() {
        return sameUserTarget;
    }

    /**
     * Sets same user target.
     *
     * @param sameUserTarget the same user target
     */
    public void setSameUserTarget(Integer sameUserTarget) {
        this.sameUserTarget = sameUserTarget;
    }

    @Override
    public String toString() {
        return "TriggerNodeDefinition{" +
                "monitorType=" + monitorType +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", lessThanHour=" + lessThanHour +
                ", branchType=" + branchType +
                ", mainExpression=" + mainExpression +
                ", additionExpression=" + additionExpression +
                ", unlimited=" + unlimited +
                ", sameUserLessThanDays=" + sameUserLessThanDays +
                ", sameUserLessThanTimes=" + sameUserLessThanTimes +
                ", sameUserTarget=" + sameUserTarget +
                ", targetType='" + targetType + '\'' +
                '}';
    }
}
