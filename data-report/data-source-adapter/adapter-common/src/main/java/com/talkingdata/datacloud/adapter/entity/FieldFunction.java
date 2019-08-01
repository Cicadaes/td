package com.talkingdata.datacloud.adapter.entity;

/**
 * Created by yangruobin on 2017/9/7.
 */
public class FieldFunction {
    //当function为空，limit为0时，则直接用field
    public String field;
    //当field为metrics时，用于对field的avg,sum;当field为groupBy时，用于对field的year,month,sum;当field为limit时，为1，2等数字
    public String function;
    //列别名
    public String alias;

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
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }
}