package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_CROWD_TASK_CALC_OBJECT_RECORD CrowdTaskCalcObjectRecordEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-02-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CrowdTaskCalcObjectRecord extends BaseEntity {

    private Integer id;
    private Integer crowdId;
    private String crowdName;
    private Integer crowdType;
    private Integer status;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date finishTime;
    private String errorInfo;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    private Integer refId;
    private Integer retry;
    private Integer maxRetry;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>crowdId -> crowd_id</li>
     * <li>crowdName -> crowd_name</li>
     * <li>crowdType -> crowd_type</li>
     * <li>status -> status</li>
     * <li>startTime -> start_time</li>
     * <li>finishTime -> finish_time</li>
     * <li>errorInfo -> error_info</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     * <li>refId -> ref_id</li>
     * <li>retry -> retry</li>
     * <li>maxRetry -> max_retry</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null){
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "crowdId": return "crowd_id";
            case "crowdName": return "crowd_name";
            case "crowdType": return "crowd_type";
            case "status": return "status";
            case "startTime": return "start_time";
            case "finishTime": return "finish_time";
            case "errorInfo": return "error_info";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updateBy": return "update_by";
            case "updateTime": return "update_time";
            case "refId": return "ref_id";
            case "retry": return "retry";
            case "maxRetry": return "max_retry";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>crowd_id -> crowdId</li>
     * <li>crowd_name -> crowdName</li>
     * <li>crowd_type -> crowdType</li>
     * <li>status -> status</li>
     * <li>start_time -> startTime</li>
     * <li>finish_time -> finishTime</li>
     * <li>error_info -> errorInfo</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     * <li>ref_id -> refId</li>
     * <li>retry -> retry</li>
     * <li>max_retry -> maxRetry</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null){
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "crowd_id": return "crowdId";
            case "crowd_name": return "crowdName";
            case "crowd_type": return "crowdType";
            case "status": return "status";
            case "start_time": return "startTime";
            case "finish_time": return "finishTime";
            case "error_info": return "errorInfo";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            case "ref_id": return "refId";
            case "retry": return "retry";
            case "max_retry": return "maxRetry";
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

    /** 人群id **/
    public Integer getCrowdId() {
        return this.crowdId;
    }

    /** 人群id **/
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

    /** 人群类型(1.Lookalike人群  2.场景人群  3.精准人群(历史人群) 4.精准人群(本地文件上） 5.子人群) **/
    public Integer getCrowdType() {
        return this.crowdType;
    }

    /** 人群类型(1.Lookalike人群  2.场景人群  3.精准人群(历史人群) 4.精准人群(本地文件上） 5.子人群) **/
    public void setCrowdType(Integer crowdType) {
        this.crowdType = crowdType;
    }

    /** 状态 －1.异常 0.未开始 1.进行中 2.已完成 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态 －1.异常 0.未开始 1.进行中 2.已完成 **/
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
    public Date getFinishTime() {
        return this.finishTime;
    }

    /** 结束时间 **/
    public void setFinishTime(Date finishTime) {
        this.finishTime = finishTime;
    }

    /** 异常信息 **/
    public String getErrorInfo() {
        return this.errorInfo;
    }

    /** 异常信息 **/
    public void setErrorInfo(String errorInfo) {
        this.errorInfo = errorInfo;
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

    /** 创建人账户 **/
    public String getCreateBy() {
        return this.createBy;
    }

    /** 创建人账户 **/
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

    /** 更新人账户 **/
    public String getUpdateBy() {
        return this.updateBy;
    }

    /** 更新人账户 **/
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

    /** 引用ID **/
    public Integer getRefId() {
        return this.refId;
    }

    /** 引用ID **/
    public void setRefId(Integer refId) {
        this.refId = refId;
    }

    /** 重试次数 **/
    public Integer getRetry() {
        return this.retry;
    }

    /** 重试次数 **/
    public void setRetry(Integer retry) {
        this.retry = retry;
    }

    /** 最大重试次 **/
    public Integer getMaxRetry() {
        return this.maxRetry;
    }

    /** 最大重试次 **/
    public void setMaxRetry(Integer maxRetry) {
        this.maxRetry = maxRetry;
    }

}
