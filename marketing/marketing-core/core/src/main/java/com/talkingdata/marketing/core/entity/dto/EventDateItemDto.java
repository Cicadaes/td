package com.talkingdata.marketing.core.entity.dto;

/**
 * The type Event date item dto.
 * @author xiaoming.kang
 */
public class EventDateItemDto {
    private String date;
    private Integer val;
    private String event;

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

    /**
     * Gets val.
     *
     * @return the val
     */
    public Integer getVal() {
        return val;
    }

    /**
     * Sets val.
     *
     * @param val the val
     */
    public void setVal(Integer val) {
        this.val = val;
    }

    /**
     * Gets event.
     *
     * @return the event
     */
    public String getEvent() {
        return event;
    }

    /**
     * Sets event.
     *
     * @param event the event
     */
    public void setEvent(String event) {
        this.event = event;
    }
}
