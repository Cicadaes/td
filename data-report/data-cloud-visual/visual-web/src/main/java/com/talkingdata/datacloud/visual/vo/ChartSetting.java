package com.talkingdata.datacloud.visual.vo;

import com.talkingdata.datacloud.adapter.entity.QueryParameter;

/**
 * Created by yangruobin on 2017/9/12.
 */
public class ChartSetting {
    String uuid;
    String requestPath;
    String requestMethod;
    QueryParameter requestData;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getRequestPath() {
        return requestPath;
    }

    public void setRequestPath(String requestPath) {
        this.requestPath = requestPath;
    }

    public String getRequestMethod() {
        return requestMethod;
    }

    public void setRequestMethod(String requestMethod) {
        this.requestMethod = requestMethod;
    }

    public QueryParameter getRequestData() {
        return requestData;
    }

    public void setRequestData(QueryParameter requestData) {
        this.requestData = requestData;
    }
}
