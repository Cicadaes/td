package com.talkingdata.datacloud.visual.vo;

import org.apache.commons.collections.map.HashedMap;

import java.util.Map;

/**
 * Created by yangruobin on 2017/9/12.
 */
public class Method {
    String methodName;
    String methodPath;
    Map sendValue=new HashedMap();
    Map resultValue=new HashedMap();

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public String getMethodPath() {
        return methodPath;
    }

    public void setMethodPath(String methodPath) {
        this.methodPath = methodPath;
    }

    public Map getSendValue() {
        return sendValue;
    }

    public void setSendValue(Map sendValue) {
        this.sendValue = sendValue;
    }

    public Map getResultValue() {
        return resultValue;
    }

    public void setResultValue(Map resultValue) {
        this.resultValue = resultValue;
    }
}
