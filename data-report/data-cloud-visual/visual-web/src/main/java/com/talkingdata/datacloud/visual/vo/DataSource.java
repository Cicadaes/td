package com.talkingdata.datacloud.visual.vo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangruobin on 2017/4/28.
 */
public class DataSource {
    private Object data ;
    private Object config;
    private List<Parameter> parameters=new ArrayList<>();

    public List<Parameter> getParameters() {
        return parameters;
    }

    public void setParameters(List<Parameter> parameters) {
        this.parameters = parameters;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Object getConfig() {
        return config;
    }

    public void setConfig(Object config) {
        this.config = config;
    }
}
