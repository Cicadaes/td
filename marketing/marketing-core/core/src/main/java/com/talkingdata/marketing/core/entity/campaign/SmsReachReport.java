package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_SMS_REACH_REPORT SmsReachReportEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-02 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class SmsReachReport extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private Integer segmentId;
    private Integer pipelineId;
    private String pipelineNodeId;
    private String reportDate;
    private Integer reportHour;
    private Integer succCount;
    private Integer failCount;
    private Integer unknownCount;
    private Integer clickCount;
    private Integer independentClickCount;
    private Integer clickIpCount;
    private Integer clickLinkCount;
    private Integer insufficientBalanceCount;
    private Integer invalidPhoneNumberCount;
    private Integer unsubscribeCount;
    private Integer blacklistCount;
    private Integer unconnectCount;
    private Integer overrunFailCount;
    private Integer other;
    private String tenantId;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String creator;
    private String createBy;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaignId -> campaign_id</li>
     * <li>segmentId -> segment_id</li>
     * <li>pipelineId -> pipeline_id</li>
     * <li>pipelineNodeId -> pipeline_node_id</li>
     * <li>reportDate -> report_date</li>
     * <li>reportHour -> report_hour</li>
     * <li>succCount -> succ_count</li>
     * <li>failCount -> fail_count</li>
     * <li>unknownCount -> unknown_count</li>
     * <li>clickCount -> click_count</li>
     * <li>independentClickCount -> independent_click_count</li>
     * <li>clickIpCount -> click_ip_count</li>
     * <li>clickLinkCount -> click_link_count</li>
     * <li>insufficientBalanceCount -> insufficient_balance_count</li>
     * <li>invalidPhoneNumberCount -> invalid_phone_number_count</li>
     * <li>unsubscribeCount -> unsubscribe_count</li>
     * <li>blacklistCount -> blacklist_count</li>
     * <li>unconnectCount -> unconnect_count</li>
     * <li>overrunFailCount -> overrun_fail_count</li>
     * <li>other -> other</li>
     * <li>tenantId -> tenant_id</li>
     * <li>createTime -> create_time</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null){
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "campaignId": return "campaign_id";
            case "segmentId": return "segment_id";
            case "pipelineId": return "pipeline_id";
            case "pipelineNodeId": return "pipeline_node_id";
            case "reportDate": return "report_date";
            case "reportHour": return "report_hour";
            case "succCount": return "succ_count";
            case "failCount": return "fail_count";
            case "unknownCount": return "unknown_count";
            case "clickCount": return "click_count";
            case "independentClickCount": return "independent_click_count";
            case "clickIpCount": return "click_ip_count";
            case "clickLinkCount": return "click_link_count";
            case "insufficientBalanceCount": return "insufficient_balance_count";
            case "invalidPhoneNumberCount": return "invalid_phone_number_count";
            case "unsubscribeCount": return "unsubscribe_count";
            case "blacklistCount": return "blacklist_count";
            case "unconnectCount": return "unconnect_count";
            case "overrunFailCount": return "overrun_fail_count";
            case "other": return "other";
            case "tenantId": return "tenant_id";
            case "createTime": return "create_time";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "updater": return "updater";
            case "updateBy": return "update_by";
            case "updateTime": return "update_time";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaign_id -> campaignId</li>
     * <li>segment_id -> segmentId</li>
     * <li>pipeline_id -> pipelineId</li>
     * <li>pipeline_node_id -> pipelineNodeId</li>
     * <li>report_date -> reportDate</li>
     * <li>report_hour -> reportHour</li>
     * <li>succ_count -> succCount</li>
     * <li>fail_count -> failCount</li>
     * <li>unknown_count -> unknownCount</li>
     * <li>click_count -> clickCount</li>
     * <li>independent_click_count -> independentClickCount</li>
     * <li>click_ip_count -> clickIpCount</li>
     * <li>click_link_count -> clickLinkCount</li>
     * <li>insufficient_balance_count -> insufficientBalanceCount</li>
     * <li>invalid_phone_number_count -> invalidPhoneNumberCount</li>
     * <li>unsubscribe_count -> unsubscribeCount</li>
     * <li>blacklist_count -> blacklistCount</li>
     * <li>unconnect_count -> unconnectCount</li>
     * <li>overrun_fail_count -> overrunFailCount</li>
     * <li>other -> other</li>
     * <li>tenant_id -> tenantId</li>
     * <li>create_time -> createTime</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null){
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "campaign_id": return "campaignId";
            case "segment_id": return "segmentId";
            case "pipeline_id": return "pipelineId";
            case "pipeline_node_id": return "pipelineNodeId";
            case "report_date": return "reportDate";
            case "report_hour": return "reportHour";
            case "succ_count": return "succCount";
            case "fail_count": return "failCount";
            case "unknown_count": return "unknownCount";
            case "click_count": return "clickCount";
            case "independent_click_count": return "independentClickCount";
            case "click_ip_count": return "clickIpCount";
            case "click_link_count": return "clickLinkCount";
            case "insufficient_balance_count": return "insufficientBalanceCount";
            case "invalid_phone_number_count": return "invalidPhoneNumberCount";
            case "unsubscribe_count": return "unsubscribeCount";
            case "blacklist_count": return "blacklistCount";
            case "unconnect_count": return "unconnectCount";
            case "overrun_fail_count": return "overrunFailCount";
            case "other": return "other";
            case "tenant_id": return "tenantId";
            case "create_time": return "createTime";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            default: return null;
        }
    }
    
    /** 主键 **/
    public Integer getId() {
        return this.id;
    }

    /** 主键 **/
    public void setId(Integer id) {
        this.id = id;
    }

    /** 活动id **/
    public Integer getCampaignId() {
        return this.campaignId;
    }

    /** 活动id **/
    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    /** 投放id **/
    public Integer getSegmentId() {
        return this.segmentId;
    }

    /** 投放id **/
    public void setSegmentId(Integer segmentId) {
        this.segmentId = segmentId;
    }

    /** 活动流程ID **/
    public Integer getPipelineId() {
        return this.pipelineId;
    }

    /** 活动流程ID **/
    public void setPipelineId(Integer pipelineId) {
        this.pipelineId = pipelineId;
    }

    /** 活动流程节点ID **/
    public String getPipelineNodeId() {
        return this.pipelineNodeId;
    }

    /** 活动流程节点ID **/
    public void setPipelineNodeId(String pipelineNodeId) {
        this.pipelineNodeId = pipelineNodeId;
    }

    /** 日期:yyyyMMdd **/
    public String getReportDate() {
        return this.reportDate;
    }

    /** 日期:yyyyMMdd **/
    public void setReportDate(String reportDate) {
        this.reportDate = reportDate;
    }

    /** 小时 **/
    public Integer getReportHour() {
        return this.reportHour;
    }

    /** 小时 **/
    public void setReportHour(Integer reportHour) {
        this.reportHour = reportHour;
    }

    /** 成功数量 **/
    public Integer getSuccCount() {
        return this.succCount;
    }

    /** 成功数量 **/
    public void setSuccCount(Integer succCount) {
        this.succCount = succCount;
    }

    /** 失败数量 **/
    public Integer getFailCount() {
        return this.failCount;
    }

    /** 失败数量 **/
    public void setFailCount(Integer failCount) {
        this.failCount = failCount;
    }

    /** 未知数量 **/
    public Integer getUnknownCount() {
        return this.unknownCount;
    }

    /** 未知数量 **/
    public void setUnknownCount(Integer unknownCount) {
        this.unknownCount = unknownCount;
    }

    /** 点击数量 **/
    public Integer getClickCount() {
        return this.clickCount;
    }

    /** 点击数量 **/
    public void setClickCount(Integer clickCount) {
        this.clickCount = clickCount;
    }

    /** 独立点击数 **/
    public Integer getIndependentClickCount() {
        return this.independentClickCount;
    }

    /** 独立点击数 **/
    public void setIndependentClickCount(Integer independentClickCount) {
        this.independentClickCount = independentClickCount;
    }

    /** 点击ip数 **/
    public Integer getClickIpCount() {
        return this.clickIpCount;
    }

    /** 点击ip数 **/
    public void setClickIpCount(Integer clickIpCount) {
        this.clickIpCount = clickIpCount;
    }

    /** 点击链接数 **/
    public Integer getClickLinkCount() {
        return this.clickLinkCount;
    }

    /** 点击链接数 **/
    public void setClickLinkCount(Integer clickLinkCount) {
        this.clickLinkCount = clickLinkCount;
    }

    /** 余额不足数 **/
    public Integer getInsufficientBalanceCount() {
        return this.insufficientBalanceCount;
    }

    /** 余额不足数 **/
    public void setInsufficientBalanceCount(Integer insufficientBalanceCount) {
        this.insufficientBalanceCount = insufficientBalanceCount;
    }

    /** 手机号无效 **/
    public Integer getInvalidPhoneNumberCount() {
        return this.invalidPhoneNumberCount;
    }

    /** 手机号无效 **/
    public void setInvalidPhoneNumberCount(Integer invalidPhoneNumberCount) {
        this.invalidPhoneNumberCount = invalidPhoneNumberCount;
    }

    /** 退订数 **/
    public Integer getUnsubscribeCount() {
        return this.unsubscribeCount;
    }

    /** 退订数 **/
    public void setUnsubscribeCount(Integer unsubscribeCount) {
        this.unsubscribeCount = unsubscribeCount;
    }

    /** 黑名单数 **/
    public Integer getBlacklistCount() {
        return this.blacklistCount;
    }

    /** 黑名单数 **/
    public void setBlacklistCount(Integer blacklistCount) {
        this.blacklistCount = blacklistCount;
    }

    /** 无法接通 **/
    public Integer getUnconnectCount() {
        return this.unconnectCount;
    }

    /** 无法接通 **/
    public void setUnconnectCount(Integer unconnectCount) {
        this.unconnectCount = unconnectCount;
    }

    /** 超限失败 **/
    public Integer getOverrunFailCount() {
        return this.overrunFailCount;
    }

    /** 超限失败 **/
    public void setOverrunFailCount(Integer overrunFailCount) {
        this.overrunFailCount = overrunFailCount;
    }

    /** 其它,其它数=失败数-余额不足数-手机号无效-退订数 **/
    public Integer getOther() {
        return this.other;
    }

    /** 其它,其它数=失败数-余额不足数-手机号无效-退订数 **/
    public void setOther(Integer other) {
        this.other = other;
    }

    /** 租户id **/
    public String getTenantId() {
        return this.tenantId;
    }

    /** 租户id **/
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    /** 创建时间 **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 创建时间 **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /** 创建人 **/
    public String getCreator() {
        return this.creator;
    }

    /** 创建人 **/
    public void setCreator(String creator) {
        this.creator = creator;
    }

    /** 创建人账号 **/
    public String getCreateBy() {
        return this.createBy;
    }

    /** 创建人账号 **/
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    /** 更新人 **/
    public String getUpdater() {
        return this.updater;
    }

    /** 更新人 **/
    public void setUpdater(String updater) {
        this.updater = updater;
    }

    /** 更新人账号 **/
    public String getUpdateBy() {
        return this.updateBy;
    }

    /** 更新人账号 **/
    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    /** 更新时间 **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /** 更新时间 **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

}
