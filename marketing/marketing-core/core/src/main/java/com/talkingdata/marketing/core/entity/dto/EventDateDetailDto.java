package com.talkingdata.marketing.core.entity.dto;

import java.util.List;
import java.util.Map;

/**
 * The type Event date detail dto.
 * @author xiaoming.kang
 */
public class EventDateDetailDto {
    private String crowdName;
    private List<Map<String, Long>> items;

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
     * Gets items.
     *
     * @return the items
     */
    public List<Map<String, Long>> getItems() {
        return items;
    }

    /**
     * Sets items.
     *
     * @param items the items
     */
    public void setItems(List<Map<String, Long>> items) {
        this.items = items;
    }
}
