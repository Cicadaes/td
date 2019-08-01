package com.talkingdata.marketing.core.entity.dto;

import org.apache.commons.lang.builder.ToStringBuilder;

import java.math.BigDecimal;

/**
 * The type Funnel convert overview event step item.
 * @author xiaoming.kang
 * @create 2017 -05-05-上午10:56
 * @since JDK 1.8
 */
public class FunnelConvertOverviewEventStepItem {

    private Integer stepOrder;

    /**
     * // TD_MKT_FUNNEL_STEP_CONDITION_DEFINITION value
     */
    private String eventName;

    /**
     * // TD_MKT_FUNNEL_STEP_CONDITION_DEFINITION key
     */
    private String eventId;

    private String stepName;

    private BigDecimal convertRate;

    private BigDecimal totalConvertRate;

    private Long val;

    /**
     * Gets step order.
     *
     * @return the step order
     */
    public Integer getStepOrder() {
        return stepOrder;
    }

    /**
     * Sets step order.
     *
     * @param stepOrder the step order
     */
    public void setStepOrder(Integer stepOrder) {
        this.stepOrder = stepOrder;
    }

    /**
     * Gets event name.
     *
     * @return the event name
     */
    public String getEventName() {
        return eventName;
    }

    /**
     * Sets event name.
     *
     * @param eventName the event name
     */
    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    /**
     * Gets event id.
     *
     * @return the event id
     */
    public String getEventId() {
        return eventId;
    }

    /**
     * Sets event id.
     *
     * @param eventId the event id
     */
    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    /**
     * Gets step name.
     *
     * @return the step name
     */
    public String getStepName() {
        return stepName;
    }

    /**
     * Sets step name.
     *
     * @param stepName the step name
     */
    public void setStepName(String stepName) {
        this.stepName = stepName;
    }

    /**
     * Gets convert rate.
     *
     * @return the convert rate
     */
    public BigDecimal getConvertRate() {
        return convertRate;
    }

    /**
     * Sets convert rate.
     *
     * @param convertRate the convert rate
     */
    public void setConvertRate(BigDecimal convertRate) {
        this.convertRate = convertRate;
    }

    /**
     * Gets total convert rate.
     *
     * @return the total convert rate
     */
    public BigDecimal getTotalConvertRate() {
        return totalConvertRate;
    }

    /**
     * Sets total convert rate.
     *
     * @param totalConvertRate the total convert rate
     */
    public void setTotalConvertRate(BigDecimal totalConvertRate) {
        this.totalConvertRate = totalConvertRate;
    }

    /**
     * Gets val.
     *
     * @return the val
     */
    public Long getVal() {
        return val;
    }

    /**
     * Sets val.
     *
     * @param val the val
     */
    public void setVal(Long val) {
        this.val = val;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("stepOrder", stepOrder)
                .append("eventName", eventName)
                .append("eventId", eventId)
                .append("funnelName", stepName)
                .append("convertRate", convertRate)
                .append("totalConvertRate", totalConvertRate)
                .append("val", val)
                .toString();
    }
}
