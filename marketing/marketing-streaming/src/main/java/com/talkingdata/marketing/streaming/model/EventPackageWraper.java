package com.talkingdata.marketing.streaming.model;

/**
 * @author Created by tend on 2018/1/31.
 */
public class EventPackageWraper {
    private String eventPackage;
    private String nextTriggerTime;

    public EventPackageWraper() {
    }

    public EventPackageWraper(String eventPackage, String nextTriggerTime) {
        this.eventPackage = eventPackage;
        this.nextTriggerTime = nextTriggerTime;
    }

    public String getEventPackage() {
        return eventPackage;
    }

    public void setEventPackage(String eventPackage) {
        this.eventPackage = eventPackage;
    }

    public String getNextTriggerTime() {
        return nextTriggerTime;
    }

    public void setNextTriggerTime(String nextTriggerTime) {
        this.nextTriggerTime = nextTriggerTime;
    }
}
