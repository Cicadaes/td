package com.talkingdata.marketing.core.entity.dto;

import java.util.Map;

/**
 * The type Effect trend dto.
 * @author xiaoming.kang
 */
public class EffectTrendDto {
    private String segmentName;
    private String name;
    private Long value;
    private Long actualValue;
    private Map<String, Long> item;

    /**
     * Gets segment name.
     *
     * @return the segment name
     */
    public String getSegmentName() {
        return segmentName;
    }

    /**
     * Sets segment name.
     *
     * @param segmentName the segment name
     */
    public void setSegmentName(String segmentName) {
        this.segmentName = segmentName;
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
     * Gets item.
     *
     * @return the item
     */
    public Map<String, Long> getItem() {
        return item;
    }

    /**
     * Sets item.
     *
     * @param item the item
     */
    public void setItem(Map<String, Long> item) {
        this.item = item;
    }
}
