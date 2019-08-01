package com.talkingdata.marketing.core.enums;

import com.talkingdata.marketing.core.constant.PushConstants;

import java.util.HashMap;
import java.util.Map;

/**
 * 不允许使用
 * @author armeng
 * @author xiaoming.kang
 */
public enum PushMetric {
    //PUSH_SEND_NUMBER
    PUSH_SEND_NUMBER(1, PushConstants.PUSH_SENT),
    //PUSH_ARRIVALED_NUMBER
    PUSH_ARRIVALED_NUMBER(2, PushConstants.PUSH_ARRIVALED),
    //PUSH_IMPRESSIONS_NUMBER
    PUSH_IMPRESSIONS_NUMBER(3, PushConstants.PUSH_IMPRESSIONS),
    //PUSH_CLICK_NUMBER
    PUSH_CLICK_NUMBER(4, PushConstants.PUSH_CLICK);

    private static Map<Integer, PushMetric> metricKeyEnumMap;

    static {
        metricKeyEnumMap = new HashMap<>(16);
        for (PushMetric e : PushMetric.values()) {
            metricKeyEnumMap.put(e.getCode(), e);
        }
    }

    private Integer code;
    private String value;
    PushMetric(Integer code, String value) {
        this.code = code;
        this.value = value;
    }
    public static PushMetric parse(Integer code) {
        PushMetric type = metricKeyEnumMap.get(code);
        if (type == null) {
            throw new IllegalArgumentException("Invalid code " + code);
        }
        return type;
    }
    public Integer getCode() {
        return code;
    }
    public String getValue() {
        return value;
    }
}
