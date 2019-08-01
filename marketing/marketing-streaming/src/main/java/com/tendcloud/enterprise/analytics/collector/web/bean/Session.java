package com.tendcloud.enterprise.analytics.collector.web.bean;

import java.util.ArrayList;
import java.util.List;

/**
 * @author sheng.hong
 */
public class Session {

    /**
     * Session id
     */
    private String sessionId = "";
    /**
     * Session的开始时间
     */
    private long starttime = 0;

    /**
     * Session Status: 1: launch 2:continue 3:terminate
     */
    private int status = 0;

    /**
     * launch 为true,存储使用间隔 Terminate事件，存储session持续时间
     */
    private int duration = 0;

    /**
     * Page List
     */
    private List<Page> pages = new ArrayList<Page>();
    /**
     * Event List
     */
    private List<Event> events = new ArrayList<Event>();

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setStarttime(long starttime) {
        this.starttime = starttime;
    }

    public long getStarttime() {
        return starttime;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getStatus() {
        return status;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public int getDuration() {
        return duration;
    }

    public void setPages(List<Page> pages) {
        this.pages = pages;
    }

    public List<Page> getPages() {
        return pages;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    public List<Event> getEvents() {
        return events;
    }
}
