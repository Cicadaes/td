package com.talkingdata.marketing.core.entity.dto;

/**
 * The type Calc object result.
 * @author xiaoming.kang
 */
public class CalcObjectResult {
    private Integer calcObjectId;
    private String metricKey;
    private Integer sumValue;
    private String date;

    /**
     * Gets calc object id.
     *
     * @return the calc object id
     */
    public Integer getCalcObjectId() {
        return calcObjectId;
    }

    /**
     * Sets calc object id.
     *
     * @param calcObjectId the calc object id
     */
    public void setCalcObjectId(Integer calcObjectId) {
        this.calcObjectId = calcObjectId;
    }

    /**
     * Gets metric key.
     *
     * @return the metric key
     */
    public String getMetricKey() {
        return metricKey;
    }

    /**
     * Sets metric key.
     *
     * @param metricKey the metric key
     */
    public void setMetricKey(String metricKey) {
        this.metricKey = metricKey;
    }

    /**
     * Gets sum value.
     *
     * @return the sum value
     */
    public Integer getSumValue() {
        return sumValue;
    }

    /**
     * Sets sum value.
     *
     * @param sumValue the sum value
     */
    public void setSumValue(Integer sumValue) {
        this.sumValue = sumValue;
    }

    /**
     * Gets date.
     *
     * @return the date
     */
    public String getDate() {
        return date;
    }

    /**
     * Sets date.
     *
     * @param date the date
     */
    public void setDate(String date) {
        this.date = date;
    }
}
