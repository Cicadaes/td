package com.talkingdata.datacloud.visual.entity.report;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_DC_VISUAL_ADAPTER AdapterEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class Adapter extends BaseEntity {

    private Integer id;
    private Integer configDefinitionId;
    private Integer dataDefinitionId;
    private String name;
    private String implClass;
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
    @JsonIgnore
    private ConfigDefinition configDefinition;
    @JsonIgnore
    private AdapterAttachment mainAttachment;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>configDefinitionId -> config_definition_id</li>
     * <li>dataDefinitionId -> data_definition_id</li>
     * <li>name -> name</li>
     * <li>implClass -> impl_class</li>
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
            case "id": return "id";
            case "configDefinitionId": return "config_definition_id";
            case "dataDefinitionId": return "data_definition_id";
            case "name": return "name";
            case "implClass": return "impl_class";
            case "description": return "description";
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
     * <li>config_definition_id -> configDefinitionId</li>
     * <li>data_definition_id -> dataDefinitionId</li>
     * <li>name -> name</li>
     * <li>impl_class -> implClass</li>
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
            case "id": return "id";
            case "config_definition_id": return "configDefinitionId";
            case "data_definition_id": return "dataDefinitionId";
            case "name": return "name";
            case "impl_class": return "implClass";
            case "description": return "description";
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
    
    /** 主键id，自增 **/
    public Integer getId() {
        return this.id;
    }

    /** 主键id，自增 **/
    public void setId(Integer id) {
        this.id = id;
    }

    /** 渲染数据源连接面板配置定义id **/
    public Integer getConfigDefinitionId() {
        return this.configDefinitionId;
    }

    /** 渲染数据源连接面板配置定义id **/
    public void setConfigDefinitionId(Integer configDefinitionId) {
        this.configDefinitionId = configDefinitionId;
    }

    /** 渲染数据源图表面板配置定义id **/
    public Integer getDataDefinitionId() {
        return this.dataDefinitionId;
    }

    /** 渲染数据源图表面板配置定义id **/
    public void setDataDefinitionId(Integer dataDefinitionId) {
        this.dataDefinitionId = dataDefinitionId;
    }

    /** 名称 **/
    public String getName() {
        return this.name;
    }

    /** 名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /** 实现类 **/
    public String getImplClass() {
        return this.implClass;
    }

    /** 实现类 **/
    public void setImplClass(String implClass) {
        this.implClass = implClass;
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

    public ConfigDefinition getConfigDefinition() {
        return configDefinition;
    }

    public void setConfigDefinition(ConfigDefinition configDefinition) {
        this.configDefinition = configDefinition;
    }

    public AdapterAttachment getMainAttachment() {
        return mainAttachment;
    }

    public void setMainAttachment(AdapterAttachment mainAttachment) {
        this.mainAttachment = mainAttachment;
    }
}
