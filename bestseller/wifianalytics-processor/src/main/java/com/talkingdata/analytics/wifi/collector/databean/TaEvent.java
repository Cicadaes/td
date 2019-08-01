package com.talkingdata.analytics.wifi.collector.databean;

import java.io.Serializable;

/**
 * Created by loong on 4/22/16.
 */
public class TaEvent implements Serializable {
    private String fragtype;
    private String dstmac;
    private String ssid;
    private String channel;

    public String getFragtype() {
        return fragtype;
    }

    public void setFragtype(String fragtype) {
        this.fragtype = fragtype;
    }

    public String getDstmac() {
        return dstmac;
    }

    public void setDstmac(String dstmac) {
        this.dstmac = dstmac;
    }

    public String getSsid() {
        return ssid;
    }

    public void setSsid(String ssid) {
        this.ssid = ssid;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    @Override
    public String toString() {
        return "TaEvent{" +
                "fragtype='" + fragtype + '\'' +
                ", dstmac='" + dstmac + '\'' +
                ", ssid='" + ssid + '\'' +
                ", channel='" + channel + '\'' +
                '}';
    }
}
