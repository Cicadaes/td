package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_PIPELINE_CROWD_REL PipelineCrowdRelEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-11-17 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class PipelineCrowdRel extends BaseEntity {

    private Integer id;
    private Integer campaignId;
    private Integer pipelineId;
    private String pipelineVersion;
    private String pipelineNodeId;
    private Integer crowdId;
    private String crowdVerion;
    private Integer crowdRefId;
    private Integer calcStatus;
    private Integer calcType;
    private Integer calcPeriod;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date calcTime;
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
     * <li>pipelineId -> pipeline_id</li>
     * <li>pipelineVersion -> pipeline_version</li>
     * <li>pipelineNodeId -> pipeline_node_id</li>
     * <li>crowdId -> crowd_id</li>
     * <li>crowdVerion -> crowd_verion</li>
     * <li>crowdRefId -> crowd_ref_id</li>
     * <li>calcStatus -> calc_status</li>
     * <li>calcType -> calc_type</li>
     * <li>calcPeriod -> calc_period</li>
     * <li>calcTime -> calc_time</li>
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
            case "pipelineId": return "pipeline_id";
            case "pipelineVersion": return "pipeline_version";
            case "pipelineNodeId": return "pipeline_node_id";
            case "crowdId": return "crowd_id";
            case "crowdVerion": return "crowd_verion";
            case "crowdRefId": return "crowd_ref_id";
            case "calcStatus": return "calc_status";
            case "calcType": return "calc_type";
            case "calcPeriod": return "calc_period";
            case "calcTime": return "calc_time";
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
     * <li>pipeline_id -> pipelineId</li>
     * <li>pipeline_version -> pipelineVersion</li>
     * <li>pipeline_node_id -> pipelineNodeId</li>
     * <li>crowd_id -> crowdId</li>
     * <li>crowd_verion -> crowdVerion</li>
     * <li>crowd_ref_id -> crowdRefId</li>
     * <li>calc_status -> calcStatus</li>
     * <li>calc_type -> calcType</li>
     * <li>calc_period -> calcPeriod</li>
     * <li>calc_time -> calcTime</li>
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
            case "pipeline_id": return "pipelineId";
            case "pipeline_version": return "pipelineVersion";
            case "pipeline_node_id": return "pipelineNodeId";
            case "crowd_id": return "crowdId";
            case "crowd_verion": return "crowdVerion";
            case "crowd_ref_id": return "crowdRefId";
            case "calc_status": return "calcStatus";
            case "calc_type": return "calcType";
            case "calc_period": return "calcPeriod";
            case "calc_time": return "calcTime";
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
    
    /** 主键ID **/
    public Integer getId() {
        return this.id;
    }

    /** 主键ID **/
    public void setId(Integer id) {
        this.id = id;
    }

    /** 营销活动ID **/
    public Integer getCampaignId() {
        return this.campaignId;
    }

    /** 营销活动ID **/
    public void setCampaignId(Integer campaignId) {
        this.campaignId = campaignId;
    }

    /** 活动流程ID **/
    public Integer getPipelineId() {
        return this.pipelineId;
    }

    /** 活动流程ID **/
    public void setPipelineId(Integer pipelineId) {
        this.pipelineId = pipelineId;
    }

    /** 活动流程版本 **/
    public String getPipelineVersion() {
        return this.pipelineVersion;
    }

    /** 活动流程版本 **/
    public void setPipelineVersion(String pipelineVersion) {
        this.pipelineVersion = pipelineVersion;
    }

    /** 活动流程节点ID **/
    public String getPipelineNodeId() {
        return this.pipelineNodeId;
    }

    /** 活动流程节点ID **/
    public void setPipelineNodeId(String pipelineNodeId) {
        this.pipelineNodeId = pipelineNodeId;
    }

    /** 人群ID **/
    public Integer getCrowdId() {
        return this.crowdId;
    }

    /** 人群ID **/
    public void setCrowdId(Integer crowdId) {
        this.crowdId = crowdId;
    }

    /** 人群版本 **/
    public String getCrowdVerion() {
        return this.crowdVerion;
    }

    /** 人群版本 **/
    public void setCrowdVerion(String crowdVerion) {
        this.crowdVerion = crowdVerion;
    }

    /** 用户管家人群ID **/
    public Integer getCrowdRefId() {
        return this.crowdRefId;
    }

    /** 用户管家人群ID **/
    public void setCrowdRefId(Integer crowdRefId) {
        this.crowdRefId = crowdRefId;
    }

    /** 计算状态 **/
    public Integer getCalcStatus() {
        return this.calcStatus;
    }

    /** 计算状态 **/
    public void setCalcStatus(Integer calcStatus) {
        this.calcStatus = calcStatus;
    }

    /** 计算类型(1-永不，2-实时，3-周期性) **/
    public Integer getCalcType() {
        return this.calcType;
    }

    /** 计算类型(1-永不，2-实时，3-周期性) **/
    public void setCalcType(Integer calcType) {
        this.calcType = calcType;
    }

    /** 周期数(天) **/
    public Integer getCalcPeriod() {
        return this.calcPeriod;
    }

    /** 周期数(天) **/
    public void setCalcPeriod(Integer calcPeriod) {
        this.calcPeriod = calcPeriod;
    }

    /** 最后一次计算时间 **/
    public Date getCalcTime() {
        return this.calcTime;
    }

    /** 最后一次计算时间 **/
    public void setCalcTime(Date calcTime) {
        this.calcTime = calcTime;
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
