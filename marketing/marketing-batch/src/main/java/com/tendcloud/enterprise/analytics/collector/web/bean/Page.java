package com.tendcloud.enterprise.analytics.collector.web.bean;

/**
 * @author sheng.hong
 */
public class Page {

    private String url = "";
    private String referer = "";
    private long starttime = 0;
    private String durationUrl = "";
    private int duration = 0;

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }

    public void setReferer(String referer) {
        this.referer = referer;
    }

    public String getReferer() {
        return referer;
    }

    public void setStarttime(long startTime) {
        this.starttime = startTime;
    }

    public long getStarttime() {
        return starttime;
    }

    public void setDurationUrl(String durationUrl) {
        this.durationUrl = durationUrl;
    }

    public String getDurationUrl() {
        return durationUrl;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public int getDuration() {
        return duration;
    }
}
