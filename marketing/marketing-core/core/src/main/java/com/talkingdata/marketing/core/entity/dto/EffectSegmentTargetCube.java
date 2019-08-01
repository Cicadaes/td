package com.talkingdata.marketing.core.entity.dto;

/**
 * The type Effect segment target cube.
 * @author xiaoming.kang
 */
public class EffectSegmentTargetCube {
    private Integer segmentId;
    private Integer targetId;
    private Long val;

    /**
     * Gets segment id.
     *
     * @return the segment id
     */
    public Integer getSegmentId() {
        return segmentId;
    }

    /**
     * Sets segment id.
     *
     * @param segmentId the segment id
     */
    public void setSegmentId(Integer segmentId) {
        this.segmentId = segmentId;
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
