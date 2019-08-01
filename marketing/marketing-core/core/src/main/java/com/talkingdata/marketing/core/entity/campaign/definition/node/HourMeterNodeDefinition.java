package com.talkingdata.marketing.core.entity.campaign.definition.node;

import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;

/**
 * 组件-计时器
 *
 * @author armeng
 * @create 2017 -08-16-下午6:15
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

    /**
     * Gets hour meter type.
     *
     * @return the hour meter type
     */
    public Integer getHourMeterType() {
        return hourMeterType;
    }

    /**
     * Sets hour meter type.
     *
     * @param hourMeterType the hour meter type
     */
    public void setHourMeterType(Integer hourMeterType) {
        this.hourMeterType = hourMeterType;
    }

    /**
     * Gets time scheduling expression.
     *
     * @return the time scheduling expression
     */
    public String getTimeSchedulingExpression() {
        return timeSchedulingExpression;
    }

    /**
     * Sets time scheduling expression.
     *
     * @param timeSchedulingExpression the time scheduling expression
     */
    public void setTimeSchedulingExpression(String timeSchedulingExpression) {
        this.timeSchedulingExpression = timeSchedulingExpression;
    }

    /**
     * Gets stop time millis.
     *
     * @return the stop time millis
     */
    public Long getStopTimeMillis() {
        return stopTimeMillis;
    }

    /**
     * Sets stop time millis.
     *
     * @param stopTimeMillis the stop time millis
     */
    public void setStopTimeMillis(Long stopTimeMillis) {
        this.stopTimeMillis = stopTimeMillis;
    }

    /**
     * Gets expression.
     *
     * @return the expression
     */
    public String getExpression() {
        return expression;
    }

    /**
     * Sets expression.
     *
     * @param expression the expression
     */
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
