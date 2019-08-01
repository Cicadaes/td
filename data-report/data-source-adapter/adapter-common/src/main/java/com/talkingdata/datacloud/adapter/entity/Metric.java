package com.talkingdata.datacloud.adapter.entity;

import com.talkingdata.datacloud.util.StringUtils;

/**
 * Created by yangruobin on 2017/9/14.
 */
public class Metric {
    //当前指标的查询sql字段名称
    private String field;
    //当前指标所做操作，比如sum，avg
    private String function;
    //当前指标查询后的名称
    private String alias;

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getFunction() {
        return function;
    }

    public void setFunction(String function) {
        this.function = function;
    }

    public String getAlias() {
        return "`"+(StringUtils.isEmpty(alias)?field:alias)+"`";
    }

    public String getResultAlias() {
        return StringUtils.isEmpty(alias)?field:alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }
}
