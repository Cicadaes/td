package com.talkingdata.datacloud.adapter.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Created by yangruobin on 2017/6/1.
 */
public class Filter{
    String field;
    String operator="=";
    Object value;

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public Object getValue() {
        return value;
    }
    @JsonIgnore
    public String getStringValue() {
        return value.toString();
    }

    public void setValue(Object value) {
        this.value = value;
    }
}
