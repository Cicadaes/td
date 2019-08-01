package com.talkingdata.marketing.core.entity.dto;

/**
 * The type Effect item dto.
 * @author xiaoming.kang
 */
public class EffectItemDto {
    private Integer targetConfigId;
    private Long actualValue;
    private Long totalActualValue;
    private Long expect;
    private String name;

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
     * Gets total actual value.
     *
     * @return the total actual value
     */
    public Long getTotalActualValue() {
        return totalActualValue;
    }

    /**
     * Sets total actual value.
     *
     * @param totalActualValue the total actual value
     */
    public void setTotalActualValue(Long totalActualValue) {
        this.totalActualValue = totalActualValue;
    }

    /**
     * Gets expect.
     *
     * @return the expect
     */
    public Long getExpect() {
        return expect;
    }

    /**
     * Sets expect.
     *
     * @param expect the expect
     */
    public void setExpect(Long expect) {
        this.expect = expect;
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
}
