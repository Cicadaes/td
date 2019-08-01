package com.talkingdata.datacloud.visual.entity.report;

import java.util.Date;

/**
 * <b>功能：</b>TD_DC_VISUAL_DATA_SOURCE_SNAPSHOT DataSourceSnapshotEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-31 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DataSourceSnapshot extends DataSourceSnapshotKey {

    private String name;
    private String mappedDataSource;
    private Integer adapterId;
    private String params;
    private String description;
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
     * <li>reportId -> report_id</li>
     * <li>dataSourceId -> data_source_id</li>
     * <li>name -> name</li>
     * <li>mappedDataSource -> mapped_data_source</li>
     * <li>adapterId -> adapter_Id</li>
     * <li>params -> params</li>
     * <li>description -> description</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "name": return "name";
            case "mappedDataSource": return "mapped_data_source";
            case "adapterId": return "adapter_Id";
            case "params": return "params";
            case "description": return "description";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updateBy": return "update_by";
            case "updateTime": return "update_time";
            default: return DataSourceSnapshotKey.fieldToColumn(fieldName);
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>report_id -> reportId</li>
     * <li>data_source_id -> dataSourceId</li>
     * <li>name -> name</li>
     * <li>mapped_data_source -> mappedDataSource</li>
     * <li>adapter_Id -> adapterId</li>
     * <li>params -> params</li>
     * <li>description -> description</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "name": return "name";
            case "mapped_data_source": return "mappedDataSource";
            case "adapter_Id": return "adapterId";
            case "params": return "params";
            case "description": return "description";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            default: return DataSourceSnapshotKey.columnToField(columnName);
        }
    }
    
    /** 数据源名称 **/
    public String getName() {
        return this.name;
    }

    /** 数据源名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /** 映射真实数据源名称 **/
    public String getMappedDataSource() {
        return this.mappedDataSource;
    }

    /** 映射真实数据源名称 **/
    public void setMappedDataSource(String mappedDataSource) {
        this.mappedDataSource = mappedDataSource;
    }

    /**  **/
    public Integer getAdapterId() {
        return this.adapterId;
    }

    /**  **/
    public void setAdapterId(Integer adapterId) {
        this.adapterId = adapterId;
    }

    /**  **/
    public String getParams() {
        return this.params;
    }

    /**  **/
    public void setParams(String params) {
        this.params = params;
    }

    /** 描述 **/
    public String getDescription() {
        return this.description;
    }

    /** 描述 **/
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

    /** 修改人 **/
    public String getUpdater() {
        return this.updater;
    }

    /** 修改人 **/
    public void setUpdater(String updater) {
        this.updater = updater;
    }

    /** 修改人账号 **/
    public String getUpdateBy() {
        return this.updateBy;
    }

    /** 修改人账号 **/
    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    /** 修改时间 **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /** 修改时间 **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

}
