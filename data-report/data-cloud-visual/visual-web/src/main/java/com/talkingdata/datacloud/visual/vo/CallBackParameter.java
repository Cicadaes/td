package com.talkingdata.datacloud.visual.vo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangruobin on 2017/5/3.
 */
public class CallBackParameter {
    private Integer datasource_id;
    private Integer adapter_id;
    private Integer chart_type;
    private List<OperatorParameter> datasource_config=new ArrayList<>();

    public Integer getDatasource_id() {
        return datasource_id;
    }

    public void setDatasource_id(Integer datasource_id) {
        this.datasource_id = datasource_id;
    }

    public List<OperatorParameter> getDatasource_config() {
        return datasource_config;
    }

    public void setDatasource_config(List<OperatorParameter> datasource_config) {
        this.datasource_config = datasource_config;
    }

    public Integer getAdapter_id() {
        return adapter_id;
    }

    public void setAdapter_id(Integer adapter_id) {
        this.adapter_id = adapter_id;
    }

    public Integer getChart_type() {
        return chart_type;
    }

    public void setChart_type(Integer chart_type) {
        this.chart_type = chart_type;
    }
}
