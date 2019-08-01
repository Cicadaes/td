package com.talkingdata.marketing.streaming.pipeline.definition.node;

import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;

/**
 * 组件-计时器
 *
 * @create 2017-08-16-下午6:15
 * @author sheng.hong
 * @since JDK 1.8
 */
public class HourMeterNodeDefinition extends AbstractNodeDefinition {
    /**
     * 类型
     */
    private Integer hourMeterType;
    /**
     * 定时表达式
     */
    private String timeSchedulingExpression;
    /**
     * 规则表达式
     */
    private String expression;
    /**
     * 等待直到满足以下条件停止计时毫秒值
     */
    private Long stopTimeMillis;

    public Integer getHourMeterType() {
        return hourMeterType;
    }

    public void setHourMeterType(Integer hourMeterType) {
        this.hourMeterType = hourMeterType;
    }

    public String getTimeSchedulingExpression() {
        return timeSchedulingExpression;
    }

    public void setTimeSchedulingExpression(String timeSchedulingExpression) {
        this.timeSchedulingExpression = timeSchedulingExpression;
    }

    public Long getStopTimeMillis() {
        return stopTimeMillis;
    }

    public void setStopTimeMillis(Long stopTimeMillis) {
        this.stopTimeMillis = stopTimeMillis;
    }

    public String getExpression() {
        return expression;
    }

    public void setExpression(String expression) {
        this.expression = expression;
    }

    @Override
    public String toString() {
        return "HourMeterNodeDefinition{" +
                "hourMeterType=" + hourMeterType +
                ", timeSchedulingExpression='" + timeSchedulingExpression + '\'' +
                ", expression='" + expression + '\'' +
                ", stopTimeMillis=" + stopTimeMillis +
                '}';
    }
}
