package com.talkingdata.marketing.core.page.campaign;

import com.talkingdata.enterprise.base.page.BasePage;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_SMS_REACH_REPORT SmsReachReportPage<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-02 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class SmsReachReportPage extends BasePage {

    private String id;
    private String idOperator = "=";
    private String campaignId;
    private String campaignIdOperator = "=";
    private String segmentId;
    private String segmentIdOperator = "=";
    private String pipelineId;
    private String pipelineIdOperator = "=";
    private String pipelineNodeId;
    private String pipelineNodeIdOperator = "=";
    private String reportDate;
    private String reportDateOperator = "=";
    private String reportHour;
    private String reportHourOperator = "=";
    private String succCount;
    private String succCountOperator = "=";
    private String failCount;
    private String failCountOperator = "=";
    private String unknownCount;
    private String unknownCountOperator = "=";
    private String clickCount;
    private String clickCountOperator = "=";
    private String independentClickCount;
    private String independentClickCountOperator = "=";
    private String clickIpCount;
    private String clickIpCountOperator = "=";
    private String clickLinkCount;
    private String clickLinkCountOperator = "=";
    private String insufficientBalanceCount;
    private String insufficientBalanceCountOperator = "=";
    private String invalidPhoneNumberCount;
    private String invalidPhoneNumberCountOperator = "=";
    private String unsubscribeCount;
    private String unsubscribeCountOperator = "=";
    private String blacklistCount;
    private String blacklistCountOperator = "=";
    private String unconnectCount;
    private String unconnectCountOperator = "=";
    private String overrunFailCount;
    private String overrunFailCountOperator = "=";
    private String other;
    private String otherOperator = "=";
    private String tenantId;
    private String tenantIdOperator = "=";
    private String createTime;
    private String createTime1;
    private String createTime2;
    private String createTimeOperator = "=";
    private String creator;
    private String creatorOperator = "=";
    private String createBy;
    private String createByOperator = "=";
    private String updater;
    private String updaterOperator = "=";
    private String updateBy;
    private String updateByOperator = "=";
    private String updateTime;
    private String updateTime1;
    private String updateTime2;
    private String updateTimeOperator = "=";

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdOperator() {
        return this.idOperator;
    }

    public void setIdOperator(String idOperator) {
        this.idOperator = idOperator;
    }

    public String getCampaignId() {
        return this.campaignId;
    }

    public void setCampaignId(String campaignId) {
        this.campaignId = campaignId;
    }

    public String getCampaignIdOperator() {
        return this.campaignIdOperator;
    }

    public void setCampaignIdOperator(String campaignIdOperator) {
        this.campaignIdOperator = campaignIdOperator;
    }

    public String getSegmentId() {
        return this.segmentId;
    }

    public void setSegmentId(String segmentId) {
        this.segmentId = segmentId;
    }

    public String getSegmentIdOperator() {
        return this.segmentIdOperator;
    }

    public void setSegmentIdOperator(String segmentIdOperator) {
        this.segmentIdOperator = segmentIdOperator;
    }

    public String getPipelineId() {
        return this.pipelineId;
    }

    public void setPipelineId(String pipelineId) {
        this.pipelineId = pipelineId;
    }

    public String getPipelineIdOperator() {
        return this.pipelineIdOperator;
    }

    public void setPipelineIdOperator(String pipelineIdOperator) {
        this.pipelineIdOperator = pipelineIdOperator;
    }

    public String getPipelineNodeId() {
        return this.pipelineNodeId;
    }

    public void setPipelineNodeId(String pipelineNodeId) {
        this.pipelineNodeId = pipelineNodeId;
    }

    public String getPipelineNodeIdOperator() {
        return this.pipelineNodeIdOperator;
    }

    public void setPipelineNodeIdOperator(String pipelineNodeIdOperator) {
        this.pipelineNodeIdOperator = pipelineNodeIdOperator;
    }

    public String getReportDate() {
        return this.reportDate;
    }

    public void setReportDate(String reportDate) {
        this.reportDate = reportDate;
    }

    public String getReportDateOperator() {
        return this.reportDateOperator;
    }

    public void setReportDateOperator(String reportDateOperator) {
        this.reportDateOperator = reportDateOperator;
    }

    public String getReportHour() {
        return this.reportHour;
    }

    public void setReportHour(String reportHour) {
        this.reportHour = reportHour;
    }

    public String getReportHourOperator() {
        return this.reportHourOperator;
    }

    public void setReportHourOperator(String reportHourOperator) {
        this.reportHourOperator = reportHourOperator;
    }

    public String getSuccCount() {
        return this.succCount;
    }

    public void setSuccCount(String succCount) {
        this.succCount = succCount;
    }

    public String getSuccCountOperator() {
        return this.succCountOperator;
    }

    public void setSuccCountOperator(String succCountOperator) {
        this.succCountOperator = succCountOperator;
    }

    public String getFailCount() {
        return this.failCount;
    }

    public void setFailCount(String failCount) {
        this.failCount = failCount;
    }

    public String getFailCountOperator() {
        return this.failCountOperator;
    }

    public void setFailCountOperator(String failCountOperator) {
        this.failCountOperator = failCountOperator;
    }

    public String getUnknownCount() {
        return this.unknownCount;
    }

    public void setUnknownCount(String unknownCount) {
        this.unknownCount = unknownCount;
    }

    public String getUnknownCountOperator() {
        return this.unknownCountOperator;
    }

    public void setUnknownCountOperator(String unknownCountOperator) {
        this.unknownCountOperator = unknownCountOperator;
    }

    public String getClickCount() {
        return this.clickCount;
    }

    public void setClickCount(String clickCount) {
        this.clickCount = clickCount;
    }

    public String getClickCountOperator() {
        return this.clickCountOperator;
    }

    public void setClickCountOperator(String clickCountOperator) {
        this.clickCountOperator = clickCountOperator;
    }

    public String getIndependentClickCount() {
        return this.independentClickCount;
    }

    public void setIndependentClickCount(String independentClickCount) {
        this.independentClickCount = independentClickCount;
    }

    public String getIndependentClickCountOperator() {
        return this.independentClickCountOperator;
    }

    public void setIndependentClickCountOperator(String independentClickCountOperator) {
        this.independentClickCountOperator = independentClickCountOperator;
    }

    public String getClickIpCount() {
        return this.clickIpCount;
    }

    public void setClickIpCount(String clickIpCount) {
        this.clickIpCount = clickIpCount;
    }

    public String getClickIpCountOperator() {
        return this.clickIpCountOperator;
    }

    public void setClickIpCountOperator(String clickIpCountOperator) {
        this.clickIpCountOperator = clickIpCountOperator;
    }

    public String getClickLinkCount() {
        return this.clickLinkCount;
    }

    public void setClickLinkCount(String clickLinkCount) {
        this.clickLinkCount = clickLinkCount;
    }

    public String getClickLinkCountOperator() {
        return this.clickLinkCountOperator;
    }

    public void setClickLinkCountOperator(String clickLinkCountOperator) {
        this.clickLinkCountOperator = clickLinkCountOperator;
    }

    public String getInsufficientBalanceCount() {
        return this.insufficientBalanceCount;
    }

    public void setInsufficientBalanceCount(String insufficientBalanceCount) {
        this.insufficientBalanceCount = insufficientBalanceCount;
    }

    public String getInsufficientBalanceCountOperator() {
        return this.insufficientBalanceCountOperator;
    }

    public void setInsufficientBalanceCountOperator(String insufficientBalanceCountOperator) {
        this.insufficientBalanceCountOperator = insufficientBalanceCountOperator;
    }

    public String getInvalidPhoneNumberCount() {
        return this.invalidPhoneNumberCount;
    }

    public void setInvalidPhoneNumberCount(String invalidPhoneNumberCount) {
        this.invalidPhoneNumberCount = invalidPhoneNumberCount;
    }

    public String getInvalidPhoneNumberCountOperator() {
        return this.invalidPhoneNumberCountOperator;
    }

    public void setInvalidPhoneNumberCountOperator(String invalidPhoneNumberCountOperator) {
        this.invalidPhoneNumberCountOperator = invalidPhoneNumberCountOperator;
    }

    public String getUnsubscribeCount() {
        return this.unsubscribeCount;
    }

    public void setUnsubscribeCount(String unsubscribeCount) {
        this.unsubscribeCount = unsubscribeCount;
    }

    public String getUnsubscribeCountOperator() {
        return this.unsubscribeCountOperator;
    }

    public void setUnsubscribeCountOperator(String unsubscribeCountOperator) {
        this.unsubscribeCountOperator = unsubscribeCountOperator;
    }

    public String getBlacklistCount() {
        return this.blacklistCount;
    }

    public void setBlacklistCount(String blacklistCount) {
        this.blacklistCount = blacklistCount;
    }

    public String getBlacklistCountOperator() {
        return this.blacklistCountOperator;
    }

    public void setBlacklistCountOperator(String blacklistCountOperator) {
        this.blacklistCountOperator = blacklistCountOperator;
    }

    public String getUnconnectCount() {
        return this.unconnectCount;
    }

    public void setUnconnectCount(String unconnectCount) {
        this.unconnectCount = unconnectCount;
    }

    public String getUnconnectCountOperator() {
        return this.unconnectCountOperator;
    }

    public void setUnconnectCountOperator(String unconnectCountOperator) {
        this.unconnectCountOperator = unconnectCountOperator;
    }

    public String getOverrunFailCount() {
        return this.overrunFailCount;
    }

    public void setOverrunFailCount(String overrunFailCount) {
        this.overrunFailCount = overrunFailCount;
    }

    public String getOverrunFailCountOperator() {
        return this.overrunFailCountOperator;
    }

    public void setOverrunFailCountOperator(String overrunFailCountOperator) {
        this.overrunFailCountOperator = overrunFailCountOperator;
    }

    public String getOther() {
        return this.other;
    }

    public void setOther(String other) {
        this.other = other;
    }

    public String getOtherOperator() {
        return this.otherOperator;
    }

    public void setOtherOperator(String otherOperator) {
        this.otherOperator = otherOperator;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTenantIdOperator() {
        return this.tenantIdOperator;
    }

    public void setTenantIdOperator(String tenantIdOperator) {
        this.tenantIdOperator = tenantIdOperator;
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

    public String getCreator() {
        return this.creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreatorOperator() {
        return this.creatorOperator;
    }

    public void setCreatorOperator(String creatorOperator) {
        this.creatorOperator = creatorOperator;
    }

    public String getCreateBy() {
        return this.createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public String getCreateByOperator() {
        return this.createByOperator;
    }

    public void setCreateByOperator(String createByOperator) {
        this.createByOperator = createByOperator;
    }

    public String getUpdater() {
        return this.updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater;
    }

    public String getUpdaterOperator() {
        return this.updaterOperator;
    }

    public void setUpdaterOperator(String updaterOperator) {
        this.updaterOperator = updaterOperator;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public String getUpdateByOperator() {
        return this.updateByOperator;
    }

    public void setUpdateByOperator(String updateByOperator) {
        this.updateByOperator = updateByOperator;
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

}
