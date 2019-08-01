package com.talkingdata.marketing.core.entity.dto;

/**
 * The type Effect unit target cube.
 * @author xiaoming.kang
 */
public class EffectUnitTargetCube {
    private Integer unitId;
    private Integer targetId;
    private Long val;

    /**
     * Gets unit id.
     *
     * @return the unit id
     */
    public Integer getUnitId() {
        return unitId;
    }

    /**
     * Sets unit id.
     *
     * @param unitId the unit id
     */
    public void setUnitId(Integer unitId) {
        this.unitId = unitId;
    }

    /**
     * Gets target id.
     *
     * @return the target id
     */
    public Integer getTargetId() {
        return targetId;
    }

    /**
     * Sets target id.
     *
     * @param targetId the target id
     */
    public void setTargetId(Integer targetId) {
        this.targetId = targetId;
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
}
