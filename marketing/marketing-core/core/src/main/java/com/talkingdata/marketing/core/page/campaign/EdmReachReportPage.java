package com.talkingdata.marketing.core.page.campaign;

import com.talkingdata.enterprise.base.page.BasePage;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_EDM_REACH_REPORT EdmReachReportPage<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-02 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class EdmReachReportPage extends BasePage {

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
    private String invalidAddressCount;
    private String invalidAddressCountOperator = "=";
    private String serverRejectedCount;
    private String serverRejectedCountOperator = "=";
    private String unknownCount;
    private String unknownCountOperator = "=";
    private String readCount;
    private String readCountOperator = "=";
    private String personReadCount;
    private String personReadCountOperator = "=";
    private String clickLinkCount;
    private String clickLinkCountOperator = "=";
    private String accountCloseCount;
    private String accountCloseCountOperator = "=";
    private String insufficientBalanceCount;
    private String insufficientBalanceCountOperator = "=";
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

    public String getInvalidAddressCount() {
        return this.invalidAddressCount;
    }

    public void setInvalidAddressCount(String invalidAddressCount) {
        this.invalidAddressCount = invalidAddressCount;
    }

    public String getInvalidAddressCountOperator() {
        return this.invalidAddressCountOperator;
    }

    public void setInvalidAddressCountOperator(String invalidAddressCountOperator) {
        this.invalidAddressCountOperator = invalidAddressCountOperator;
    }

    public String getServerRejectedCount() {
        return this.serverRejectedCount;
    }

    public void setServerRejectedCount(String serverRejectedCount) {
        this.serverRejectedCount = serverRejectedCount;
    }

    public String getServerRejectedCountOperator() {
        return this.serverRejectedCountOperator;
    }

    public void setServerRejectedCountOperator(String serverRejectedCountOperator) {
        this.serverRejectedCountOperator = serverRejectedCountOperator;
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

    public String getReadCount() {
        return this.readCount;
    }

    public void setReadCount(String readCount) {
        this.readCount = readCount;
    }

    public String getReadCountOperator() {
        return this.readCountOperator;
    }

    public void setReadCountOperator(String readCountOperator) {
        this.readCountOperator = readCountOperator;
    }

    public String getPersonReadCount() {
        return this.personReadCount;
    }

    public void setPersonReadCount(String personReadCount) {
        this.personReadCount = personReadCount;
    }

    public String getPersonReadCountOperator() {
        return this.personReadCountOperator;
    }

    public void setPersonReadCountOperator(String personReadCountOperator) {
        this.personReadCountOperator = personReadCountOperator;
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

    public String getAccountCloseCount() {
        return this.accountCloseCount;
    }

    public void setAccountCloseCount(String accountCloseCount) {
        this.accountCloseCount = accountCloseCount;
    }

    public String getAccountCloseCountOperator() {
        return this.accountCloseCountOperator;
    }

    public void setAccountCloseCountOperator(String accountCloseCountOperator) {
        this.accountCloseCountOperator = accountCloseCountOperator;
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
