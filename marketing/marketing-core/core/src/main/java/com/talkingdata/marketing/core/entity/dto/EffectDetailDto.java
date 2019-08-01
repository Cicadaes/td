package com.talkingdata.marketing.core.entity.dto;

import java.util.List;

/**
 * The type Effect detail dto.
 * @author xiaoming.kang
 */
public class EffectDetailDto {
    private String crowdName;
    private List<EffectItemDto> unitOverview;
    private List<EffectSegmentDto> segments;

    /**
     * Gets crowd name.
     *
     * @return the crowd name
     */
    public String getCrowdName() {
        return crowdName;
    }

    /**
     * Sets crowd name.
     *
     * @param crowdName the crowd name
     */
    public void setCrowdName(String crowdName) {
        this.crowdName = crowdName;
    }

    /**
     * Gets unit overview.
     *
     * @return the unit overview
     */
    public List<EffectItemDto> getUnitOverview() {
        return unitOverview;
    }

    /**
     * Sets unit overview.
     *
     * @param unitOverview the unit overview
     */
    public void setUnitOverview(List<EffectItemDto> unitOverview) {
        this.unitOverview = unitOverview;
    }

    /**
     * Gets segments.
     *
     * @return the segments
     */
    public List<EffectSegmentDto> getSegments() {
        return segments;
    }

    /**
     * Sets segments.
     *
     * @param segments the segments
     */
    public void setSegments(List<EffectSegmentDto> segments) {
        this.segments = segments;
    }
}
