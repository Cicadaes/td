package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_CAMPAIGN_LAUNCH_UNIT CampaignLaunchUnitEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-01-12 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CampaignLaunchUnit extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private Integer crowdId;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date firstSendTime;
    private String crowdName;
    private String crowdVersion;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date crowdUpdateTime;
    private Integer status;
    private Integer estimatedSize;
    private Integer pushEstimatedSize;
    private Integer smsEstimatedSize;
    private Integer edmEstimatedSize;
    private Integer adEstimatedSize;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>campaignId -> campaign_id</li>
     * <li>crowdId -> crowd_id</li>
     * <li>firstSendTime -> first_send_time</li>
     * <li>crowdName -> crowd_name</li>
     * <li>crowdVersion -> crowd_version</li>
     * <li>crowdUpdateTime -> crowd_update_time</li>
     * <li>status -> status</li>
     * <li>estimatedSize -> estimated_size</li>
     * <li>pushEstimatedSize -> push_estimated_size</li>
     * <li>smsEstimatedSize -> sms_estimated_size</li>
     * <li>edmEstimatedSize -> edm_estimated_size</li>
     * <li>adEstimatedSize -> ad_estimated_size</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) {
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "campaignId": return "campaign_id";
            case "crowdId": return "crowd_id";
            case "firstSendTime": return "first_send_time";
            case "crowdName": return "crowd_name";
            case "crowdVersion": return "crowd_version";
            case "crowdUpdateTime": return "crowd_update_time";
            case "status": return "status";
            case "estimatedSize": return "estimated_size";
            case "pushEstimatedSize": return "push_estimated_size";
            case "smsEstimatedSize": return "sms_estimated_size";
            case "edmEstimatedSize": return "edm_estimated_size";
            case "adEstimatedSize": return "ad_estimated_size";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
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
     * <li>crowd_id -> crowdId</li>
     * <li>first_send_time -> firstSendTime</li>
     * <li>crowd_name -> crowdName</li>
     * <li>crowd_version -> crowdVersion</li>
     * <li>crowd_update_time -> crowdUpdateTime</li>
     * <li>status -> status</li>
     * <li>estimated_size -> estimatedSize</li>
     * <li>push_estimated_size -> pushEstimatedSize</li>
     * <li>sms_estimated_size -> smsEstimatedSize</li>
     * <li>edm_estimated_size -> edmEstimatedSize</li>
     * <li>ad_estimated_size -> adEstimatedSize</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) {
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "campaign_id": return "campaignId";
            case "crowd_id": return "crowdId";
            case "first_send_time": return "firstSendTime";
            case "crowd_name": return "crowdName";
            case "crowd_version": return "crowdVersion";
            case "crowd_update_time": return "crowdUpdateTime";
            case "status": return "status";
            case "estimated_size": return "estimatedSize";
            case "push_estimated_size": return "pushEstimatedSize";
            case "sms_estimated_size": return "smsEstimatedSize";
            case "edm_estimated_size": return "edmEstimatedSize";
            case "ad_estimated_size": return "adEstimatedSize";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
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

    /** 活动名称 **/
    public Integer getCampaignId() {
        return this.campaignId;
    }

    /** 活动名称 **/
    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    /** 人群ID **/
    public Integer getCrowdId() {
        return this.crowdId;
    }

    /** 人群ID **/
    public void setCrowdId(Integer crowdId) {
        this.crowdId = crowdId;
    }

    /** 第一次投放时间 **/
    public Date getFirstSendTime() {
        return this.firstSendTime;
    }

    /** 第一次投放时间 **/
    public void setFirstSendTime(Date firstSendTime) {
        this.firstSendTime = firstSendTime;
    }

    /** 人群名称 **/
    public String getCrowdName() {
        return this.crowdName;
    }

    /** 人群名称 **/
    public void setCrowdName(String crowdName) {
        this.crowdName = crowdName;
    }

    /** 人群版本 **/
    public String getCrowdVersion() {
        return this.crowdVersion;
    }

    /** 人群版本 **/
    public void setCrowdVersion(String crowdVersion) {
        this.crowdVersion = crowdVersion;
    }

    /** 人群更新时间 **/
    public Date getCrowdUpdateTime() {
        return this.crowdUpdateTime;
    }

    /** 人群更新时间 **/
    public void setCrowdUpdateTime(Date crowdUpdateTime) {
        this.crowdUpdateTime = crowdUpdateTime;
    }

    /** 状态 -1、已删除 0、正常 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态 -1、已删除 0、正常 **/
    public void setStatus(Integer status) {
        this.status = status;
    }

    /** 预估数量 **/
    public Integer getEstimatedSize() {
        return this.estimatedSize;
    }

    /** 预估数量 **/
    public void setEstimatedSize(Integer estimatedSize) {
        this.estimatedSize = estimatedSize;
    }

    /** Push预估数量 **/
    public Integer getPushEstimatedSize() {
        return this.pushEstimatedSize;
    }

    /** Push预估数量 **/
    public void setPushEstimatedSize(Integer pushEstimatedSize) {
        this.pushEstimatedSize = pushEstimatedSize;
    }

    /**  短信预估数量 **/
    public Integer getSmsEstimatedSize() {
        return this.smsEstimatedSize;
    }

    /**  短信预估数量 **/
    public void setSmsEstimatedSize(Integer smsEstimatedSize) {
        this.smsEstimatedSize = smsEstimatedSize;
    }

    /** 邮件预估数量 **/
    public Integer getEdmEstimatedSize() {
        return this.edmEstimatedSize;
    }

    /** 邮件预估数量 **/
    public void setEdmEstimatedSize(Integer edmEstimatedSize) {
        this.edmEstimatedSize = edmEstimatedSize;
    }

    /** 广告预估数量 **/
    public Integer getAdEstimatedSize() {
        return this.adEstimatedSize;
    }

    /** 广告预估数量 **/
    public void setAdEstimatedSize(Integer adEstimatedSize) {
        this.adEstimatedSize = adEstimatedSize;
    }

    /** 租户ID **/
    public String getTenantId() {
        return this.tenantId;
    }

    /** 租户ID **/
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
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

    /** 创建时间 **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 创建时间 **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
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

    /** 最后更新时间 **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /** 最后更新时间 **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

}
