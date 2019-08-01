package com.talkingdata.marketing.streaming.model;

/**
 * @author tingwen.liu
 * @create 2018-03-14
 * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
 */
public class ExecutorResultData {

    private String saveType;

    private ExecutorResultDataContent content;

    public ExecutorResultData(String saveType, ExecutorResultDataContent content) {
        this.saveType = saveType;
        this.content = content;
    }

    public String getSaveType() {
        return saveType;
    }

    public void setSaveType(String saveType) {
        this.saveType = saveType;
    }

    public ExecutorResultDataContent getContent() {
        return content;
    }

    public void setContent(ExecutorResultDataContent content) {
        this.content = content;
    }
}
