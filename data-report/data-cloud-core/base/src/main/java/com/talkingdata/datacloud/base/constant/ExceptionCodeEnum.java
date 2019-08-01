package com.talkingdata.datacloud.base.constant;

/**
 * 2016-12-28 copy from dmp
 */
public enum ExceptionCodeEnum {
    SUBMIT_CHECK_NAME("9001"),
    SUBMIT_CHECK_CODE("9002"),
    AZKABAN_TASK_EFFECTIVE("8001"),
    AZKABAN_TASK_ERROR("8002");

    private String errorCode;

    ExceptionCodeEnum(String errorCode) {
        this.errorCode = errorCode;
    }

    public String errorCode() {
        return errorCode;
    }
}
