package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_EDM_REACH_REPORT EdmReachReportEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-02 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class EdmReachReport extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private Integer segmentId;
    private Integer pipelineId;
    private String pipelineNodeId;
    private String reportDate;
    private Integer reportHour;
    private Integer succCount;
    private Integer failCount;
    private Integer invalidAddressCount;
    private Integer serverRejectedCount;
    private Integer unknownCount;
    private Integer readCount;
    private Integer personReadCount;
    private Integer clickLinkCount;
    private Integer accountCloseCount;
    private Integer insufficientBalanceCount;
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
     * <li>invalidAddressCount -> invalid_address_count</li>
     * <li>serverRejectedCount -> server_rejected_count</li>
     * <li>unknownCount -> unknown_count</li>
     * <li>readCount -> read_count</li>
     * <li>personReadCount -> person_read_count</li>
     * <li>clickLinkCount -> click_link_count</li>
     * <li>accountCloseCount -> account_close_count</li>
     * <li>insufficientBalanceCount -> insufficient_balance_count</li>
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
            case "invalidAddressCount": return "invalid_address_count";
            case "serverRejectedCount": return "server_rejected_count";
            case "unknownCount": return "unknown_count";
            case "readCount": return "read_count";
            case "personReadCount": return "person_read_count";
            case "clickLinkCount": return "click_link_count";
            case "accountCloseCount": return "account_close_count";
            case "insufficientBalanceCount": return "insufficient_balance_count";
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
     * <li>invalid_address_count -> invalidAddressCount</li>
     * <li>server_rejected_count -> serverRejectedCount</li>
     * <li>unknown_count -> unknownCount</li>
     * <li>read_count -> readCount</li>
     * <li>person_read_count -> personReadCount</li>
     * <li>click_link_count -> clickLinkCount</li>
     * <li>account_close_count -> accountCloseCount</li>
     * <li>insufficient_balance_count -> insufficientBalanceCount</li>
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
            case "invalid_address_count": return "invalidAddressCount";
            case "server_rejected_count": return "serverRejectedCount";
            case "unknown_count": return "unknownCount";
            case "read_count": return "readCount";
            case "person_read_count": return "personReadCount";
            case "click_link_count": return "clickLinkCount";
            case "account_close_count": return "accountCloseCount";
            case "insufficient_balance_count": return "insufficientBalanceCount";
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

    /** 成功数 **/
    public Integer getSuccCount() {
        return this.succCount;
    }

    /** 成功数 **/
    public void setSuccCount(Integer succCount) {
        this.succCount = succCount;
    }

    /** 失败数 **/
    public Integer getFailCount() {
        return this.failCount;
    }

    /** 失败数 **/
    public void setFailCount(Integer failCount) {
        this.failCount = failCount;
    }

    /** 无效的地址数 **/
    public Integer getInvalidAddressCount() {
        return this.invalidAddressCount;
    }

    /** 无效的地址数 **/
    public void setInvalidAddressCount(Integer invalidAddressCount) {
        this.invalidAddressCount = invalidAddressCount;
    }

    /** 服务器拒绝数 **/
    public Integer getServerRejectedCount() {
        return this.serverRejectedCount;
    }

    /** 服务器拒绝数 **/
    public void setServerRejectedCount(Integer serverRejectedCount) {
        this.serverRejectedCount = serverRejectedCount;
    }

    /** 未知数 **/
    public Integer getUnknownCount() {
        return this.unknownCount;
    }

    /** 未知数 **/
    public void setUnknownCount(Integer unknownCount) {
        this.unknownCount = unknownCount;
    }

    /** 阅读数 **/
    public Integer getReadCount() {
        return this.readCount;
    }

    /** 阅读数 **/
    public void setReadCount(Integer readCount) {
        this.readCount = readCount;
    }

    /** 阅读人数 **/
    public Integer getPersonReadCount() {
        return this.personReadCount;
    }

    /** 阅读人数 **/
    public void setPersonReadCount(Integer personReadCount) {
        this.personReadCount = personReadCount;
    }

    /** 点击链接数 **/
    public Integer getClickLinkCount() {
        return this.clickLinkCount;
    }

    /** 点击链接数 **/
    public void setClickLinkCount(Integer clickLinkCount) {
        this.clickLinkCount = clickLinkCount;
    }

    /** 账户关闭次数 **/
    public Integer getAccountCloseCount() {
        return this.accountCloseCount;
    }

    /** 账户关闭次数 **/
    public void setAccountCloseCount(Integer accountCloseCount) {
        this.accountCloseCount = accountCloseCount;
    }

    /** 账户余额不足数 **/
    public Integer getInsufficientBalanceCount() {
        return this.insufficientBalanceCount;
    }

    /** 账户余额不足数 **/
    public void setInsufficientBalanceCount(Integer insufficientBalanceCount) {
        this.insufficientBalanceCount = insufficientBalanceCount;
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
