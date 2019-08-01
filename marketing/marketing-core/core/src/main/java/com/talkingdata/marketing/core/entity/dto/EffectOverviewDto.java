package com.talkingdata.marketing.core.entity.dto;

/**
 * The type Effect overview dto.
 * @author xiaoming.kang
 */
public class EffectOverviewDto {
    private Integer targetConfigId;
    private String name;
    private Long value;
    private Long actualValue;
    private Long subActualValue;

    /**
     * Gets target config id.
     *
     * @return the target config id
     */
    public Integer getTargetConfigId() {
        return targetConfigId;
    }

    /**
     * Sets target config id.
     *
     * @param targetConfigId the target config id
     */
    public void setTargetConfigId(Integer targetConfigId) {
        this.targetConfigId = targetConfigId;
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
     * Gets value.
     *
     * @return the value
     */
    public Long getValue() {
        return value;
    }

    /**
     * Sets value.
     *
     * @param value the value
     */
    public void setValue(Long value) {
        this.value = value;
    }

    /**
     * Gets actual value.
     *
     * @return the actual value
     */
    public Long getActualValue() {
        return actualValue;
    }

    /**
     * Sets actual value.
     *
     * @param actualValue the actual value
     */
    public void setActualValue(Long actualValue) {
        this.actualValue = actualValue;
    }

    /**
     * Gets sub actual value.
     *
     * @return the sub actual value
     */
    public Long getSubActualValue() {
        return subActualValue;
    }

    /**
     * Sets sub actual value.
     *
     * @param subActualValue the sub actual value
     */
    public void setSubActualValue(Long subActualValue) {
        this.subActualValue = subActualValue;
    }
}
