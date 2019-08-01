package com.talkingdata.datacloud.visual.entity.report;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_DC_VISUAL_DATA_SOURCE_METADATA DataSourceMetadataEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DataSourceMetadata extends BaseEntity {

    @JsonIgnore
    private Integer id;
    @JsonIgnore
    private Integer dataSourceId;
    private String metadata;
    private String metadataType;
    @JsonIgnore
    private Integer analyticType;
    private String argument;
    @JsonIgnore
    private String tenantId;
    @JsonIgnore
    private String creator;
    @JsonIgnore
    private String createBy;
    @JsonIgnore
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    @JsonIgnore
    private String updater;
    @JsonIgnore
    private String updateBy;
    @JsonIgnore
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>dataSourceId -> data_source_id</li>
     * <li>metadata -> metadata</li>
     * <li>metadataType -> metadata_type</li>
     * <li>analyticType -> analytic_type</li>
     * <li>argument -> argument</li>
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
            case "id": return "id";
            case "dataSourceId": return "data_source_id";
            case "metadata": return "metadata";
            case "metadataType": return "metadata_type";
            case "analyticType": return "analytic_type";
            case "argument": return "argument";
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
     * <li>data_source_id -> dataSourceId</li>
     * <li>metadata -> metadata</li>
     * <li>metadata_type -> metadataType</li>
     * <li>analytic_type -> analyticType</li>
     * <li>argument -> argument</li>
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
            case "id": return "id";
            case "data_source_id": return "dataSourceId";
            case "metadata": return "metadata";
            case "metadata_type": return "metadataType";
            case "analytic_type": return "analyticType";
            case "argument": return "argument";
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
    
    /**  **/
    public Integer getId() {
        return this.id;
    }

    /**  **/
    public void setId(Integer id) {
        this.id = id;
    }

    /** 数据源ID **/
    public Integer getDataSourceId() {
        return this.dataSourceId;
    }

    /** 数据源ID **/
    public void setDataSourceId(Integer dataSourceId) {
        this.dataSourceId = dataSourceId;
    }

    /** 数据源元数据字段 **/
    public String getMetadata() {
        return this.metadata;
    }

    /** 数据源元数据字段 **/
    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    /** 数据源元数据字段类型 **/
    public String getMetadataType() {
        return this.metadataType;
    }

    /** 数据源元数据字段类型 **/
    public void setMetadataType(String metadataType) {
        this.metadataType = metadataType;
    }

    /** 数据分析类型,0:指标,1:普通维度,2:时间维度 **/
    public Integer getAnalyticType() {
        return this.analyticType;
    }

    /** 数据分析类型,0:指标,1:普通维度,2:时间维度 **/
    public void setAnalyticType(Integer analyticType) {
        this.analyticType = analyticType;
    }

    /** 参数 **/
    public String getArgument() {
        return this.argument;
    }

    /** 参数 **/
    public void setArgument(String argument) {
        this.argument = argument;
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
