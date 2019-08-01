package com.talkingdata.marketing.core.entity.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * The type Funnel trend dto.
 * @author xiaoming.kang
 */
public class FunnelTrendDto {
    private String crowdName;
    private List<Map<String, BigDecimal>> items;

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
    public List<Map<String, BigDecimal>> getItems() {
        return items;
    }

    /**
     * Sets items.
     *
     * @param items the items
     */
    public void setItems(List<Map<String, BigDecimal>> items) {
        this.items = items;
    }
}
