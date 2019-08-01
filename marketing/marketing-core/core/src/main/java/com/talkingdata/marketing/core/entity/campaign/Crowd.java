package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_CROWD CrowdEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-02 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class Crowd extends BaseEntity {

    private Integer id;
    private Integer crowdType;
    private Integer source;
    private Integer parentId;
    private Integer refId;
    private Integer attachmentId;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date lastUpdateTime;
    private Integer status;
    private Integer calcStatus;
    private String lastVersion;
    private Integer estimatedSize;
    private Integer pushEstimatedSize;
    private Integer smsEstimatedSize;
    private Integer adEstimatedSize;
    private Integer edmEstimatedSize;
    private String idType;
    private String refCode;
    private String refName;
    private String description;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date endTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>crowdType -> crowd_type</li>
     * <li>source -> source</li>
     * <li>parentId -> parent_id</li>
     * <li>refId -> ref_id</li>
     * <li>attachmentId -> attachment_id</li>
     * <li>lastUpdateTime -> last_update_time</li>
     * <li>status -> status</li>
     * <li>calcStatus -> calc_status</li>
     * <li>lastVersion -> last_version</li>
     * <li>estimatedSize -> estimated_size</li>
     * <li>pushEstimatedSize -> push_estimated_size</li>
     * <li>smsEstimatedSize -> sms_estimated_size</li>
     * <li>adEstimatedSize -> ad_estimated_size</li>
     * <li>edmEstimatedSize -> edm_estimated_size</li>
     * <li>idType -> id_type</li>
     * <li>refCode -> ref_code</li>
     * <li>refName -> ref_name</li>
     * <li>description -> description</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>startTime -> start_time</li>
     * <li>endTime -> end_time</li>
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
            case "crowdType": return "crowd_type";
            case "source": return "source";
            case "parentId": return "parent_id";
            case "refId": return "ref_id";
            case "attachmentId": return "attachment_id";
            case "lastUpdateTime": return "last_update_time";
            case "status": return "status";
            case "calcStatus": return "calc_status";
            case "lastVersion": return "last_version";
            case "estimatedSize": return "estimated_size";
            case "pushEstimatedSize": return "push_estimated_size";
            case "smsEstimatedSize": return "sms_estimated_size";
            case "adEstimatedSize": return "ad_estimated_size";
            case "edmEstimatedSize": return "edm_estimated_size";
            case "idType": return "id_type";
            case "refCode": return "ref_code";
            case "refName": return "ref_name";
            case "description": return "description";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "startTime": return "start_time";
            case "endTime": return "end_time";
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
     * <li>crowd_type -> crowdType</li>
     * <li>source -> source</li>
     * <li>parent_id -> parentId</li>
     * <li>ref_id -> refId</li>
     * <li>attachment_id -> attachmentId</li>
     * <li>last_update_time -> lastUpdateTime</li>
     * <li>status -> status</li>
     * <li>calc_status -> calcStatus</li>
     * <li>last_version -> lastVersion</li>
     * <li>estimated_size -> estimatedSize</li>
     * <li>push_estimated_size -> pushEstimatedSize</li>
     * <li>sms_estimated_size -> smsEstimatedSize</li>
     * <li>ad_estimated_size -> adEstimatedSize</li>
     * <li>edm_estimated_size -> edmEstimatedSize</li>
     * <li>id_type -> idType</li>
     * <li>ref_code -> refCode</li>
     * <li>ref_name -> refName</li>
     * <li>description -> description</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>start_time -> startTime</li>
     * <li>end_time -> endTime</li>
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
            case "crowd_type": return "crowdType";
            case "source": return "source";
            case "parent_id": return "parentId";
            case "ref_id": return "refId";
            case "attachment_id": return "attachmentId";
            case "last_update_time": return "lastUpdateTime";
            case "status": return "status";
            case "calc_status": return "calcStatus";
            case "last_version": return "lastVersion";
            case "estimated_size": return "estimatedSize";
            case "push_estimated_size": return "pushEstimatedSize";
            case "sms_estimated_size": return "smsEstimatedSize";
            case "ad_estimated_size": return "adEstimatedSize";
            case "edm_estimated_size": return "edmEstimatedSize";
            case "id_type": return "idType";
            case "ref_code": return "refCode";
            case "ref_name": return "refName";
            case "description": return "description";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "start_time": return "startTime";
            case "end_time": return "endTime";
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

    /** 人群类型(1.Lookalike人群  2.场景人群  3.精准人群(历史人群) 4.精准人群(本地文件上） 5.子人群) **/
    public Integer getCrowdType() {
        return this.crowdType;
    }

    /** 人群类型(1.Lookalike人群  2.场景人群  3.精准人群(历史人群) 4.精准人群(本地文件上） 5.子人群) **/
    public void setCrowdType(Integer crowdType) {
        this.crowdType = crowdType;
    }

    /** 来源(用户管家) **/
    public Integer getSource() {
        return this.source;
    }

    /** 来源(用户管家) **/
    public void setSource(Integer source) {
        this.source = source;
    }

    /** 父人群ID **/
    public Integer getParentId() {
        return this.parentId;
    }

    /** 父人群ID **/
    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    /** 引用ID **/
    public Integer getRefId() {
        return this.refId;
    }

    /** 引用ID **/
    public void setRefId(Integer refId) {
        this.refId = refId;
    }

    /** 人群文件id **/
    public Integer getAttachmentId() {
        return this.attachmentId;
    }

    /** 人群文件id **/
    public void setAttachmentId(Integer attachmentId) {
        this.attachmentId = attachmentId;
    }

    /** 人群最后更新时间 **/
    public Date getLastUpdateTime() {
        return this.lastUpdateTime;
    }

    /** 人群最后更新时间 **/
    public void setLastUpdateTime(Date lastUpdateTime) {
        this.lastUpdateTime = lastUpdateTime;
    }

    /** 人群状态 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 人群状态 **/
    public void setStatus(Integer status) {
        this.status = status;
    }

    /** 计算状态 **/
    public Integer getCalcStatus() {
        return this.calcStatus;
    }

    /** 计算状态 **/
    public void setCalcStatus(Integer calcStatus) {
        this.calcStatus = calcStatus;
    }

    /** 人群版本 **/
    public String getLastVersion() {
        return this.lastVersion;
    }

    /** 人群版本 **/
    public void setLastVersion(String lastVersion) {
        this.lastVersion = lastVersion;
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

    /** 短信预估数量 **/
    public Integer getSmsEstimatedSize() {
        return this.smsEstimatedSize;
    }

    /** 短信预估数量 **/
    public void setSmsEstimatedSize(Integer smsEstimatedSize) {
        this.smsEstimatedSize = smsEstimatedSize;
    }

    /** 广告预估数量 **/
    public Integer getAdEstimatedSize() {
        return this.adEstimatedSize;
    }

    /** 广告预估数量 **/
    public void setAdEstimatedSize(Integer adEstimatedSize) {
        this.adEstimatedSize = adEstimatedSize;
    }

    /** 预估邮件数量 **/
    public Integer getEdmEstimatedSize() {
        return this.edmEstimatedSize;
    }

    /** 预估邮件数量 **/
    public void setEdmEstimatedSize(Integer edmEstimatedSize) {
        this.edmEstimatedSize = edmEstimatedSize;
    }

    /** 人群类型 **/
    public String getIdType() {
        return this.idType;
    }

    /** 人群类型 **/
    public void setIdType(String idType) {
        this.idType = idType;
    }

    /** 引用编码 **/
    public String getRefCode() {
        return this.refCode;
    }

    /** 引用编码 **/
    public void setRefCode(String refCode) {
        this.refCode = refCode;
    }

    /** 引用名称 **/
    public String getRefName() {
        return this.refName;
    }

    /** 引用名称 **/
    public void setRefName(String refName) {
        this.refName = refName;
    }

    /** 人群备注 **/
    public String getDescription() {
        return this.description;
    }

    /** 人群备注 **/
    public void setDescription(String description) {
        this.description = description;
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

    /** 开始时间 **/
    public Date getStartTime() {
        return this.startTime;
    }

    /** 开始时间 **/
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    /** 结束时间 **/
    public Date getEndTime() {
        return this.endTime;
    }

    /** 结束时间 **/
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
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
