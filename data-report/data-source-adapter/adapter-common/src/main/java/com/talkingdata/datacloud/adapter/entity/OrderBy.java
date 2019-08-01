package com.talkingdata.datacloud.adapter.entity;

/**
 * Created by yangruobin on 2017/9/14.
 */
public class OrderBy {
    //当前查询排序的字段名称
    private String field;
    //当前指标所做操作，比如asc，desc
    private String function;

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
}
