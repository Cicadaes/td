package com.talkingdata.marketing.core.entity.dto;

import java.util.List;

/**
 * The type Funnel detail page.
 * @author xiaoming.kang
 */
public class FunnelDetailPage {
    /**
     * The Data.
     */
    List<List<String>> data;
    /**
     * The Total.
     */
    Integer total;

    /**
     * Gets data.
     *
     * @return the data
     */
    public List<List<String>> getData() {
        return data;
    }

    /**
     * Sets data.
     *
     * @param data the data
     */
    public void setData(List<List<String>> data) {
        this.data = data;
    }

    /**
     * Gets total.
     *
     * @return the total
     */
    public Integer getTotal() {
        return total;
    }

    /**
     * Sets total.
     *
     * @param total the total
     */
    public void setTotal(Integer total) {
        this.total = total;
    }
}
