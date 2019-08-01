package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_DATA_DOWNLOAD DataDownloadEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DataDownload extends BaseEntity {

    private Integer id;
    private Integer taskId;
    private Integer crowdId;
    private Integer refId;
    private String refName;
    private Integer type;
    private String crowdVersion;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date lastUpdateTime;
    private Integer status;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date endTime;
    private String dvType;
    private Integer maxRetry;
    private Integer retry;
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
     * <li>taskId -> task_id</li>
     * <li>crowdId -> crowd_id</li>
     * <li>refId -> ref_id</li>
     * <li>refName -> ref_name</li>
     * <li>type -> type</li>
     * <li>crowdVersion -> crowd_version</li>
     * <li>lastUpdateTime -> last_update_time</li>
     * <li>status -> status</li>
     * <li>startTime -> start_time</li>
     * <li>endTime -> end_time</li>
     * <li>dvType -> dv_type</li>
     * <li>maxRetry -> max_retry</li>
     * <li>retry -> retry</li>
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
            case "taskId": return "task_id";
            case "crowdId": return "crowd_id";
            case "refId": return "ref_id";
            case "refName": return "ref_name";
            case "type": return "type";
            case "crowdVersion": return "crowd_version";
            case "lastUpdateTime": return "last_update_time";
            case "status": return "status";
            case "startTime": return "start_time";
            case "endTime": return "end_time";
            case "dvType": return "dv_type";
            case "maxRetry": return "max_retry";
            case "retry": return "retry";
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
     * <li>task_id -> taskId</li>
     * <li>crowd_id -> crowdId</li>
     * <li>ref_id -> refId</li>
     * <li>ref_name -> refName</li>
     * <li>type -> type</li>
     * <li>crowd_version -> crowdVersion</li>
     * <li>last_update_time -> lastUpdateTime</li>
     * <li>status -> status</li>
     * <li>start_time -> startTime</li>
     * <li>end_time -> endTime</li>
     * <li>dv_type -> dvType</li>
     * <li>max_retry -> maxRetry</li>
     * <li>retry -> retry</li>
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
            case "task_id": return "taskId";
            case "crowd_id": return "crowdId";
            case "ref_id": return "refId";
            case "ref_name": return "refName";
            case "type": return "type";
            case "crowd_version": return "crowdVersion";
            case "last_update_time": return "lastUpdateTime";
            case "status": return "status";
            case "start_time": return "startTime";
            case "end_time": return "endTime";
            case "dv_type": return "dvType";
            case "max_retry": return "maxRetry";
            case "retry": return "retry";
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

    /** 用户管家返回的任务id **/
    public Integer getTaskId() {
        return this.taskId;
    }

    /** 用户管家返回的任务id **/
    public void setTaskId(Integer taskId) {
        this.taskId = taskId;
    }

    /** 人群id **/
    public Integer getCrowdId() {
        return this.crowdId;
    }

    /** 人群id **/
    public void setCrowdId(Integer crowdId) {
        this.crowdId = crowdId;
    }

    /** 引用ID **/
    public Integer getRefId() {
        return this.refId;
    }

    /** 引用ID **/
    public void setRefId(Integer refId) {
        this.refId = refId;
    }

    /** 引用名称 **/
    public String getRefName() {
        return this.refName;
    }

    /** 引用名称 **/
    public void setRefName(String refName) {
        this.refName = refName;
    }

    /** 1 全量 2 增量 **/
    public Integer getType() {
        return this.type;
    }

    /** 1 全量 2 增量 **/
    public void setType(Integer type) {
        this.type = type;
    }

    /** 人群版本 **/
    public String getCrowdVersion() {
        return this.crowdVersion;
    }

    /** 人群版本 **/
    public void setCrowdVersion(String crowdVersion) {
        this.crowdVersion = crowdVersion;
    }

    /** 人群最后更新时间 **/
    public Date getLastUpdateTime() {
        return this.lastUpdateTime;
    }

    /** 人群最后更新时间 **/
    public void setLastUpdateTime(Date lastUpdateTime) {
        this.lastUpdateTime = lastUpdateTime;
    }

    /** -1 失败 0 未开始 1 进行中 2 已完成 **/
    public Integer getStatus() {
        return this.status;
    }

    /** -1 失败 0 未开始 1 进行中 2 已完成 **/
    public void setStatus(Integer status) {
        this.status = status;
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

    /**  **/
    public String getDvType() {
        return this.dvType;
    }

    /**  **/
    public void setDvType(String dvType) {
        this.dvType = dvType;
    }

    /** 最大重试次 **/
    public Integer getMaxRetry() {
        return this.maxRetry;
    }

    /** 最大重试次 **/
    public void setMaxRetry(Integer maxRetry) {
        this.maxRetry = maxRetry;
    }

    /** 重试次数 **/
    public Integer getRetry() {
        return this.retry;
    }

    /** 重试次数 **/
    public void setRetry(Integer retry) {
        this.retry = retry;
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
