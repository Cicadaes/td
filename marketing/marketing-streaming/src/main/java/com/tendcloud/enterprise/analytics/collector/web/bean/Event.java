package com.tendcloud.enterprise.analytics.collector.web.bean;

import java.util.HashMap;
import java.util.Map;

/**
 * @author sheng.hong
 */
public class Event {

    /**
     * 开发者自定义事件的ID
     */
    private String eventid = "";
    private String label = "";
    private int count = 0;
    private long starttime = 0;
    private Map<String, Object> parameters = new HashMap<String, Object>();

    public void setEventid(String eventid) {
        this.eventid = eventid;
    }

    public String getEventid() {
        return eventid;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public int getCount() {
        return count;
    }

    public void setStarttime(long startTime) {
        this.starttime = startTime;
    }

    public long getStarttime() {
        return starttime;
    }

    public void setParameters(Map<String, Object> parameters) {
        this.parameters = parameters;
    }

    public Map<String, Object> getParameters() {
        return parameters;
    }
}
