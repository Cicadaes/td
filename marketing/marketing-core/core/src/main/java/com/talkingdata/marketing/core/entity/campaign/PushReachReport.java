package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_PUSH_REACH_REPORT PushReachReportEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-09 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class PushReachReport extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private Integer campaignLaunchUnitId;
    private Integer segmentId;
    private Integer channelDefinitionId;
    private Integer pipelineId;
    private String pipelineNodeId;
    private String reportDate;
    private Integer reportHour;
    private Integer sendCount;
    private Integer reachCount;
    private Integer displayCount;
    private Integer clickCount;
    private String tenantId;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String creator;
    private String createBy;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    private String attr1;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaignId -> campaign_id</li>
     * <li>campaignLaunchUnitId -> campaign_launch_unit_id</li>
     * <li>segmentId -> segment_id</li>
     * <li>channelDefinitionId -> channel_definition_id</li>
     * <li>pipelineId -> pipeline_id</li>
     * <li>pipelineNodeId -> pipeline_node_id</li>
     * <li>reportDate -> report_date</li>
     * <li>reportHour -> report_hour</li>
     * <li>sendCount -> send_count</li>
     * <li>reachCount -> reach_count</li>
     * <li>displayCount -> display_count</li>
     * <li>clickCount -> click_count</li>
     * <li>tenantId -> tenant_id</li>
     * <li>createTime -> create_time</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     * <li>attr1 -> attr1</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null){
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "campaignId": return "campaign_id";
            case "campaignLaunchUnitId": return "campaign_launch_unit_id";
            case "segmentId": return "segment_id";
            case "channelDefinitionId": return "channel_definition_id";
            case "pipelineId": return "pipeline_id";
            case "pipelineNodeId": return "pipeline_node_id";
            case "reportDate": return "report_date";
            case "reportHour": return "report_hour";
            case "sendCount": return "send_count";
            case "reachCount": return "reach_count";
            case "displayCount": return "display_count";
            case "clickCount": return "click_count";
            case "tenantId": return "tenant_id";
            case "createTime": return "create_time";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "updater": return "updater";
            case "updateBy": return "update_by";
            case "updateTime": return "update_time";
            case "attr1": return "attr1";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaign_id -> campaignId</li>
     * <li>campaign_launch_unit_id -> campaignLaunchUnitId</li>
     * <li>segment_id -> segmentId</li>
     * <li>channel_definition_id -> channelDefinitionId</li>
     * <li>pipeline_id -> pipelineId</li>
     * <li>pipeline_node_id -> pipelineNodeId</li>
     * <li>report_date -> reportDate</li>
     * <li>report_hour -> reportHour</li>
     * <li>send_count -> sendCount</li>
     * <li>reach_count -> reachCount</li>
     * <li>display_count -> displayCount</li>
     * <li>click_count -> clickCount</li>
     * <li>tenant_id -> tenantId</li>
     * <li>create_time -> createTime</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     * <li>attr1 -> attr1</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null){
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "campaign_id": return "campaignId";
            case "campaign_launch_unit_id": return "campaignLaunchUnitId";
            case "segment_id": return "segmentId";
            case "channel_definition_id": return "channelDefinitionId";
            case "pipeline_id": return "pipelineId";
            case "pipeline_node_id": return "pipelineNodeId";
            case "report_date": return "reportDate";
            case "report_hour": return "reportHour";
            case "send_count": return "sendCount";
            case "reach_count": return "reachCount";
            case "display_count": return "displayCount";
            case "click_count": return "clickCount";
            case "tenant_id": return "tenantId";
            case "create_time": return "createTime";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            case "attr1": return "attr1";
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

    /** 活动单元ID **/
    public Integer getCampaignLaunchUnitId() {
        return this.campaignLaunchUnitId;
    }

    /** 活动单元ID **/
    public void setCampaignLaunchUnitId(Integer campaignLaunchUnitId) {
        this.campaignLaunchUnitId = campaignLaunchUnitId;
    }

    /** 投放id **/
    public Integer getSegmentId() {
        return this.segmentId;
    }

    /** 投放id **/
    public void setSegmentId(Integer segmentId) {
        this.segmentId = segmentId;
    }

    /** 渠道ID **/
    public Integer getChannelDefinitionId() {
        return this.channelDefinitionId;
    }

    /** 渠道ID **/
    public void setChannelDefinitionId(Integer channelDefinitionId) {
        this.channelDefinitionId = channelDefinitionId;
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

    /**  **/
    public Integer getReportHour() {
        return this.reportHour;
    }

    /**  **/
    public void setReportHour(Integer reportHour) {
        this.reportHour = reportHour;
    }

    /** 发送数 **/
    public Integer getSendCount() {
        return this.sendCount;
    }

    /** 发送数 **/
    public void setSendCount(Integer sendCount) {
        this.sendCount = sendCount;
    }

    /** 到达数 **/
    public Integer getReachCount() {
        return this.reachCount;
    }

    /** 到达数 **/
    public void setReachCount(Integer reachCount) {
        this.reachCount = reachCount;
    }

    /** 展示数 **/
    public Integer getDisplayCount() {
        return this.displayCount;
    }

    /** 展示数 **/
    public void setDisplayCount(Integer displayCount) {
        this.displayCount = displayCount;
    }

    /** 点击数 **/
    public Integer getClickCount() {
        return this.clickCount;
    }

    /** 点击数 **/
    public void setClickCount(Integer clickCount) {
        this.clickCount = clickCount;
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

    /** 对应calc_id **/
    public String getAttr1() {
        return this.attr1;
    }

    /** 对应calc_id **/
    public void setAttr1(String attr1) {
        this.attr1 = attr1;
    }

}
