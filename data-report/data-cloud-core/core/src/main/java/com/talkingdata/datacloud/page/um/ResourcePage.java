package com.talkingdata.datacloud.page.um;

import com.talkingdata.datacloud.base.page.BasePage;

import java.util.Date;

/**
 * <b>功能：</b>UM_RESOURCE ResourcePage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ResourcePage extends BasePage {

    private String rid;
    private String ridOperator = "=";
    private String appRid;
    private String appRidOperator = "=";
    private String resourceTypeRid;
    private String resourceTypeRidOperator = "=";
    private String parentResourceRid;
    private String parentResourceRidOperator = "=";
    private String resourceCode;
    private String resourceCodeOperator = "=";
    private String resourceName;
    private String resourceNameOperator = "=";
    private String resourceDesc;
    private String resourceDescOperator = "=";
    private String resourceOrder;
    private String resourceOrderOperator = "=";
    private String resourceUri;
    private String resourceUriOperator = "=";
    private String isAction;
    private String isActionOperator = "=";
    private String action;
    private String actionOperator = "=";
    private String extAttr1;
    private String extAttr1Operator = "=";
    private String extAttr2;
    private String extAttr2Operator = "=";
    private String extAttr3;
    private String extAttr3Operator = "=";
    private String extAttr4;
    private String extAttr4Operator = "=";
    private String extAttr5;
    private String extAttr5Operator = "=";
    private String extAttr6;
    private String extAttr6Operator = "=";
    private String createTime;
    private String createTime1;
    private String createTime2;
    private String createTimeOperator = "=";
    private String updateTime;
    private String updateTime1;
    private String updateTime2;
    private String updateTimeOperator = "=";
    private String opUmid;
    private String opUmidOperator = "=";

    public String getRid() {
        return this.rid;
    }

    public void setRid(String rid) {
        this.rid = rid;
    }

    public String getRidOperator() {
        return this.ridOperator;
    }

    public void setRidOperator(String ridOperator) {
        this.ridOperator = ridOperator;
    }

    public String getAppRid() {
        return this.appRid;
    }

    public void setAppRid(String appRid) {
        this.appRid = appRid;
    }

    public String getAppRidOperator() {
        return this.appRidOperator;
    }

    public void setAppRidOperator(String appRidOperator) {
        this.appRidOperator = appRidOperator;
    }

    public String getResourceTypeRid() {
        return this.resourceTypeRid;
    }

    public void setResourceTypeRid(String resourceTypeRid) {
        this.resourceTypeRid = resourceTypeRid;
    }

    public String getResourceTypeRidOperator() {
        return this.resourceTypeRidOperator;
    }

    public void setResourceTypeRidOperator(String resourceTypeRidOperator) {
        this.resourceTypeRidOperator = resourceTypeRidOperator;
    }

    public String getParentResourceRid() {
        return this.parentResourceRid;
    }

    public void setParentResourceRid(String parentResourceRid) {
        this.parentResourceRid = parentResourceRid;
    }

    public String getParentResourceRidOperator() {
        return this.parentResourceRidOperator;
    }

    public void setParentResourceRidOperator(String parentResourceRidOperator) {
        this.parentResourceRidOperator = parentResourceRidOperator;
    }

    public String getResourceCode() {
        return this.resourceCode;
    }

    public void setResourceCode(String resourceCode) {
        this.resourceCode = resourceCode;
    }

    public String getResourceCodeOperator() {
        return this.resourceCodeOperator;
    }

    public void setResourceCodeOperator(String resourceCodeOperator) {
        this.resourceCodeOperator = resourceCodeOperator;
    }

    public String getResourceName() {
        return this.resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public String getResourceNameOperator() {
        return this.resourceNameOperator;
    }

    public void setResourceNameOperator(String resourceNameOperator) {
        this.resourceNameOperator = resourceNameOperator;
    }

    public String getResourceDesc() {
        return this.resourceDesc;
    }

    public void setResourceDesc(String resourceDesc) {
        this.resourceDesc = resourceDesc;
    }

    public String getResourceDescOperator() {
        return this.resourceDescOperator;
    }

    public void setResourceDescOperator(String resourceDescOperator) {
        this.resourceDescOperator = resourceDescOperator;
    }

    public String getResourceOrder() {
        return this.resourceOrder;
    }

    public void setResourceOrder(String resourceOrder) {
        this.resourceOrder = resourceOrder;
    }

    public String getResourceOrderOperator() {
        return this.resourceOrderOperator;
    }

    public void setResourceOrderOperator(String resourceOrderOperator) {
        this.resourceOrderOperator = resourceOrderOperator;
    }

    public String getResourceUri() {
        return this.resourceUri;
    }

    public void setResourceUri(String resourceUri) {
        this.resourceUri = resourceUri;
    }

    public String getResourceUriOperator() {
        return this.resourceUriOperator;
    }

    public void setResourceUriOperator(String resourceUriOperator) {
        this.resourceUriOperator = resourceUriOperator;
    }

    public String getIsAction() {
        return this.isAction;
    }

    public void setIsAction(String isAction) {
        this.isAction = isAction;
    }

    public String getIsActionOperator() {
        return this.isActionOperator;
    }

    public void setIsActionOperator(String isActionOperator) {
        this.isActionOperator = isActionOperator;
    }

    public String getAction() {
        return this.action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getActionOperator() {
        return this.actionOperator;
    }

    public void setActionOperator(String actionOperator) {
        this.actionOperator = actionOperator;
    }

    public String getExtAttr1() {
        return this.extAttr1;
    }

    public void setExtAttr1(String extAttr1) {
        this.extAttr1 = extAttr1;
    }

    public String getExtAttr1Operator() {
        return this.extAttr1Operator;
    }

    public void setExtAttr1Operator(String extAttr1Operator) {
        this.extAttr1Operator = extAttr1Operator;
    }

    public String getExtAttr2() {
        return this.extAttr2;
    }

    public void setExtAttr2(String extAttr2) {
        this.extAttr2 = extAttr2;
    }

    public String getExtAttr2Operator() {
        return this.extAttr2Operator;
    }

    public void setExtAttr2Operator(String extAttr2Operator) {
        this.extAttr2Operator = extAttr2Operator;
    }

    public String getExtAttr3() {
        return this.extAttr3;
    }

    public void setExtAttr3(String extAttr3) {
        this.extAttr3 = extAttr3;
    }

    public String getExtAttr3Operator() {
        return this.extAttr3Operator;
    }

    public void setExtAttr3Operator(String extAttr3Operator) {
        this.extAttr3Operator = extAttr3Operator;
    }

    public String getExtAttr4() {
        return this.extAttr4;
    }

    public void setExtAttr4(String extAttr4) {
        this.extAttr4 = extAttr4;
    }

    public String getExtAttr4Operator() {
        return this.extAttr4Operator;
    }

    public void setExtAttr4Operator(String extAttr4Operator) {
        this.extAttr4Operator = extAttr4Operator;
    }

    public String getExtAttr5() {
        return this.extAttr5;
    }

    public void setExtAttr5(String extAttr5) {
        this.extAttr5 = extAttr5;
    }

    public String getExtAttr5Operator() {
        return this.extAttr5Operator;
    }

    public void setExtAttr5Operator(String extAttr5Operator) {
        this.extAttr5Operator = extAttr5Operator;
    }

    public String getExtAttr6() {
        return this.extAttr6;
    }

    public void setExtAttr6(String extAttr6) {
        this.extAttr6 = extAttr6;
    }

    public String getExtAttr6Operator() {
        return this.extAttr6Operator;
    }

    public void setExtAttr6Operator(String extAttr6Operator) {
        this.extAttr6Operator = extAttr6Operator;
    }

    public String getCreateTime() {
        return this.createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getCreateTime1() {
        return this.createTime1;
    }

    public void setCreateTime1(String createTime1) {
        this.createTime1 = createTime1;
    }

    public String getCreateTime2() {
        return this.createTime2;
    }

    public void setCreateTime2(String createTime2) {
        this.createTime2 = createTime2;
    }

    public String getCreateTimeOperator() {
        return this.createTimeOperator;
    }

    public void setCreateTimeOperator(String createTimeOperator) {
        this.createTimeOperator = createTimeOperator;
    }

    public String getUpdateTime() {
        return this.updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }

    public String getUpdateTime1() {
        return this.updateTime1;
    }

    public void setUpdateTime1(String updateTime1) {
        this.updateTime1 = updateTime1;
    }

    public String getUpdateTime2() {
        return this.updateTime2;
    }

    public void setUpdateTime2(String updateTime2) {
        this.updateTime2 = updateTime2;
    }

    public String getUpdateTimeOperator() {
        return this.updateTimeOperator;
    }

    public void setUpdateTimeOperator(String updateTimeOperator) {
        this.updateTimeOperator = updateTimeOperator;
    }

    public String getOpUmid() {
        return this.opUmid;
    }

    public void setOpUmid(String opUmid) {
        this.opUmid = opUmid;
    }

    public String getOpUmidOperator() {
        return this.opUmidOperator;
    }

    public void setOpUmidOperator(String opUmidOperator) {
        this.opUmidOperator = opUmidOperator;
    }

}
