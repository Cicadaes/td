package com.talkingdata.marketing.streaming.model;

/**
 * @author tingwen.liu
 * @create 2018-03-14
 * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
 */
public class ExecutorResultDataContent<T> {

    private String dataType;

    private T dataContent;

    public ExecutorResultDataContent(String dataType, T dataContent) {
        this.dataType = dataType;
        this.dataContent = dataContent;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public T getDataContent() {
        return dataContent;
    }

    public void setDataContent(T dataContent) {
        this.dataContent = dataContent;
    }
}
