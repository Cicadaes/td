package com.talkingdata.marketing.core.entity.thirdmodel.sms;

/**
 * @author armeng
 * @author xiaoming.kang
 */

public enum SmsReportEnum {
    //时间
    TIME("time", 0),
    //总计
    TOTAL("total", 1),
    //成功数量
    SUC_NUMBER("sucNumber", 2),
    //失败数量
    ERR_NUMBER("errNumber", 3),
    //创建时间
    CREATE_TIME("create_time", 4);

    /**表示header头信息
     *
     */
    private String value;
    /**表示header对应的第N列(从0开始)
     *
     */
    private Integer code;
    SmsReportEnum(String value, Integer code) {
        this.value = value;
        this.code = code;
    }
    public String getValue() {
        return value;
    }

    public Integer getCode() {
        return code;
    }
}
