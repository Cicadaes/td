package com.talkingdata.datacloud.adapter.entity;

import com.talkingdata.datacloud.util.StringUtils;

import java.util.Map;

/**
 * Created by yangruobin on 2017/9/14.
 */
public class Dimension {
    /**
     *当前维度的查询sql字段名称
     */
    private String field;
    /**
     *当前维度的个数
     */
    private int limit;
    /**
     * 当前维度查询后的名称
     */
    private String alias;
    /**
     * 维度值转换规则
     */
    private ConvertInterface convertFunction;

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public String getAlias() {
        return "`"+(StringUtils.isEmpty(alias)?field:alias)+"`";
    }

    public String getResultAlias() {
        return StringUtils.isEmpty(alias)?field:alias;
    }

    public void setAlias(String alias) {
        this.alias=StringUtils.isEmpty(alias)?this.field:alias;
    }

    public ConvertInterface getConvertFunction() {
        return convertFunction;
    }

    public void setConvertFunction(Map<String,Object>convertFunction) throws Exception{
        String className=(String)convertFunction.get("ruleType");
        String packageName = ConvertInterface.class.getPackage().getName();
        String wholeClassName=packageName+"."+className;
        Class convertInterfaceClass=Class.forName(wholeClassName);
        this.convertFunction=(ConvertInterface) convertInterfaceClass.newInstance();
        this.convertFunction.setConvertFunction(convertFunction.get("rule"));
    }
}
