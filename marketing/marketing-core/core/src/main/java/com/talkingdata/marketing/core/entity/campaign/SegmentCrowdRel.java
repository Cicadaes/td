package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_SEGMENT_CROWD_REL SegmentCrowdRelEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-05 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class SegmentCrowdRel extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private Integer campaignLaunchUnitId;
    private Integer segmentId;
    private Integer crowdId;
    private String crowdName;
    private String crowdVersion;
    private Integer crowdType;
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
     * <li>campaignLaunchUnitId -> campaign_launch_unit_id</li>
     * <li>segmentId -> segment_id</li>
     * <li>crowdId -> crowd_id</li>
     * <li>crowdName -> crowd_name</li>
     * <li>crowdVersion -> crowd_version</li>
     * <li>crowdType -> crowd_type</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
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
            case "campaignLaunchUnitId": return "campaign_launch_unit_id";
            case "segmentId": return "segment_id";
            case "crowdId": return "crowd_id";
            case "crowdName": return "crowd_name";
            case "crowdVersion": return "crowd_version";
            case "crowdType": return "crowd_type";
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
     * <li>campaign_launch_unit_id -> campaignLaunchUnitId</li>
     * <li>segment_id -> segmentId</li>
     * <li>crowd_id -> crowdId</li>
     * <li>crowd_name -> crowdName</li>
     * <li>crowd_version -> crowdVersion</li>
     * <li>crowd_type -> crowdType</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
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
            case "campaign_launch_unit_id": return "campaignLaunchUnitId";
            case "segment_id": return "segmentId";
            case "crowd_id": return "crowdId";
            case "crowd_name": return "crowdName";
            case "crowd_version": return "crowdVersion";
            case "crowd_type": return "crowdType";
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

    /** 活动ID **/
    public Integer getCampaignId() {
        return this.campaignId;
    }

    /** 活动ID **/
    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    /** 活动投放单元ID **/
    public Integer getCampaignLaunchUnitId() {
        return this.campaignLaunchUnitId;
    }

    /** 活动投放单元ID **/
    public void setCampaignLaunchUnitId(Integer campaignLaunchUnitId) {
        this.campaignLaunchUnitId = campaignLaunchUnitId;
    }

    /** 投放ID **/
    public Integer getSegmentId() {
        return this.segmentId;
    }

    /** 投放ID **/
    public void setSegmentId(Integer segmentId) {
        this.segmentId = segmentId;
    }

    /** 人群ID **/
    public Integer getCrowdId() {
        return this.crowdId;
    }

    /** 人群ID **/
    public void setCrowdId(Integer crowdId) {
        this.crowdId = crowdId;
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

    /** 人群类型(1.Lookalike人群  2.场景人群  3.精准人群(历史人群) 4.精准人群(本地文件上） 5.子人群) **/
    public Integer getCrowdType() {
        return this.crowdType;
    }

    /** 人群类型(1.Lookalike人群  2.场景人群  3.精准人群(历史人群) 4.精准人群(本地文件上） 5.子人群) **/
    public void setCrowdType(Integer crowdType) {
        this.crowdType = crowdType;
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
