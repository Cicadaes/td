package com.talkingdata.marketing.core.entity.dto;

/**
 * The type Funnel trend item dto.
 * @author xiaoming.kang
 */
public class FunnelTrendItemDto {
    private String date;
    private Integer ratio;

    /**
     * Gets ratio.
     *
     * @return the ratio
     */
    public Integer getRatio() {
        return ratio;
    }

    /**
     * Sets ratio.
     *
     * @param ratio the ratio
     */
    public void setRatio(Integer ratio) {
        this.ratio = ratio;
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
