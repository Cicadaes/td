package com.talkingdata.marketing.core.enums;

import java.util.HashMap;
import java.util.Map;

/**
 * 不允许使用
 * @author armeng
 * @author xiaoming.kang
 */
public enum  SmsMetric {
    /**
     * sms发送成功
     */
    SMS_SEND_SUCCESS(1,"smsSendSuccess"),
    /**
     * sms发送失败
     */
    SMS_SEND_FAIL(2, "smsSendFail"),
    /**
     * sms发送未知???
     */
    SMS_SEND_UNKNOWN(3, "smsSendUnknown"),
    /**
     * smsClick
     */
    SMS_CLICK(4, "smsClick"),
    /**
     * smsClickAlone
     */
    SMS_CLICK_ALONE(5, "smsClickAlone"),
    /**
     * smsClickIp
     */
    SMS_CLICK_IP(6, "smsClickIp");

    private static Map<Integer, SmsMetric> smsMetricKeyEnumMap;

    static {
        smsMetricKeyEnumMap = new HashMap<>(16);
        for (SmsMetric e : SmsMetric.values()) {
            smsMetricKeyEnumMap.put(e.getCode(), e);
        }
    }

    private Integer code;
    private String value;
    SmsMetric(Integer code, String value) {
        this.code = code;
        this.value = value;
    }
    public static SmsMetric parse(Integer code) {
        SmsMetric type = smsMetricKeyEnumMap.get(code);
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
