package com.talkingdata.datacloud.vo;

/**
 * Created by Ocean on 2017/1/9.
 */
public enum ResourceType {
    DATASET("dataset"),
    CATALOG("catalog");

    public final String code;

    ResourceType(String code) {
        this.code = code;
    }
}
