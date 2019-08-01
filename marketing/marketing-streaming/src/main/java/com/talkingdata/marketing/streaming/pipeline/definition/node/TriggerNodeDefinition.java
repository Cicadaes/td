package com.talkingdata.marketing.streaming.pipeline.definition.node;


import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;

import java.util.List;

/**
 * 组件-触发器
 *
 * @create 2017-08-16-下午6:59
 * @since JDK 1.8
 * @author sheng.hong
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

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public Integer getMonitorType() {
        return monitorType;
    }

    public void setMonitorType(Integer monitorType) {
        this.monitorType = monitorType;
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Long getEndTime() {
        return endTime;
    }

    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }

    public Integer getLessThanHour() {
        return lessThanHour;
    }

    public void setLessThanHour(Integer lessThanHour) {
        this.lessThanHour = lessThanHour;
    }

    public Integer getBranchType() {
        return branchType;
    }

    public void setBranchType(Integer branchType) {
        this.branchType = branchType;
    }

    public List<String> getMainExpression() {
        return mainExpression;
    }

    public void setMainExpression(List<String> mainExpression) {
        this.mainExpression = mainExpression;
    }

    public List<String> getAdditionExpression() {
        return additionExpression;
    }

    public void setAdditionExpression(List<String> additionExpression) {
        this.additionExpression = additionExpression;
    }

    public Integer getUnlimited() {
        return unlimited;
    }

    public void setUnlimited(Integer unlimited) {
        this.unlimited = unlimited;
    }

    public Integer getSameUserLessThanDays() {
        return sameUserLessThanDays;
    }

    public void setSameUserLessThanDays(Integer sameUserLessThanDays) {
        this.sameUserLessThanDays = sameUserLessThanDays;
    }

    public Integer getSameUserLessThanTimes() {
        return sameUserLessThanTimes;
    }

    public void setSameUserLessThanTimes(Integer sameUserLessThanTimes) {
        this.sameUserLessThanTimes = sameUserLessThanTimes;
    }

    public Integer getSameUserTarget() {
        return sameUserTarget;
    }

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
