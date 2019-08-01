package com.talkingdata.analytics.wifi.collector.databean;

import java.io.Serializable;
import java.util.List;

import lombok.Builder;
import lombok.Data;

/**
 * Created by loong on 4/22/16.
 */
@Data
@Builder
public class WifiTa implements Serializable {

    private static final long serialVersionUID = 5531616360136507284L;

    private String            rssi;
    private String            mac;
    //信道
    private int               channel;

    private String            mactype;
    private List<TaEvent>     taevent;
    private int               dist;
    private long              duringstart;
    private long              duringend;
    private int               packetnumup;
    private int               packetnumdown;
    private int               volumeup;
    private int               volumedown;
    private int               authidtype;
    private String            authid;
    private String            tatype;
    private String            tabrand;
    private String            tasystem;
    private String            applicationlist;
    private String            urllist;
    private String            dns;

}
