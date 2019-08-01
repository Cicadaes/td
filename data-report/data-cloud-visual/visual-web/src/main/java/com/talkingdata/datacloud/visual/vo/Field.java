package com.talkingdata.datacloud.visual.vo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2017/4/1 0001.
 */
public class Field {
    private Integer id;
    private String code;
    private String name;
    private String fieldAliasName;
    private String description;
    private Integer valueType;
    private Integer multipleMaxNumber;
    private Object value;
    private Object defaultValue;
    private String minValue;
    private String maxValue;
    private Object optionValues;
    private Integer requried;
    private String helpInfo;
    private Integer viewType;
    private Object viewMetaData;
    private String verifyRule;
    private String iconClass;
    private List<Field> childrenFields=new ArrayList<Field>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getValueType() {
        return valueType;
    }

    public void setValueType(Integer valueType) {
        this.valueType = valueType;
    }

    public Integer getMultipleMaxNumber() {
        return multipleMaxNumber;
    }

    public void setMultipleMaxNumber(Integer multipleMaxNumber) {
        this.multipleMaxNumber = multipleMaxNumber;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public Object getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(Object defaultValue) {
        this.defaultValue = defaultValue;
    }

    public String getMinValue() {
        return minValue;
    }

    public void setMinValue(String minValue) {
        this.minValue = minValue;
    }

    public String getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(String maxValue) {
        this.maxValue = maxValue;
    }

    public Object getOptionValues() {
        return optionValues;
    }

    public void setOptionValues(Object optionValues) {
        this.optionValues = optionValues;
    }

    public Integer getRequried() {
        return requried;
    }

    public void setRequried(Integer requried) {
        this.requried = requried;
    }

    public String getHelpInfo() {
        return helpInfo;
    }

    public void setHelpInfo(String helpInfo) {
        this.helpInfo = helpInfo;
    }

    public Integer getViewType() {
        return viewType;
    }

    public void setViewType(Integer viewType) {
        this.viewType = viewType;
    }

    public Object getViewMetaData() {
        return viewMetaData;
    }

    public void setViewMetaData(Object viewMetaData) {
        this.viewMetaData = viewMetaData;
    }

    public String getVerifyRule() {
        return verifyRule;
    }

    public void setVerifyRule(String verifyRule) {
        this.verifyRule = verifyRule;
    }

    public List<Field> getChildrenFields() {
        return childrenFields;
    }

    public void setChildrenFields(List<Field> childrenFields) {
        this.childrenFields = childrenFields;
    }

    public String getIconClass() {
        return iconClass;
    }

    public void setIconClass(String iconClass) {
        this.iconClass = iconClass;
    }

    public String getFieldAliasName() {
        return fieldAliasName;
    }

    public void setFieldAliasName(String fieldAliasName) {
        this.fieldAliasName = fieldAliasName;
    }
}
