package com.talkingdata.marketing.core.entity.admin;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_INPUT_DATA_OPTION InputDataOptionEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-13 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class InputDataOption extends BaseEntity {

    private Integer id;
    private Integer schemaId;
    private String key;
    private String value;
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
     * <li>id -> id</li>
     * <li>schemaId -> schema_id</li>
     * <li>key -> key</li>
     * <li>value -> value</li>
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
        if (fieldName == null) {
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "schemaId": return "schema_id";
            case "key": return "key";
            case "value": return "value";
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
     * <li>schema_id -> schemaId</li>
     * <li>key -> key</li>
     * <li>value -> value</li>
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
        if (columnName == null) {
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "schema_id": return "schemaId";
            case "key": return "key";
            case "value": return "value";
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
    
    /**  **/
    public Integer getId() {
        return this.id;
    }

    /**  **/
    public void setId(Integer id) {
        this.id = id;
    }

    /**  **/
    public Integer getSchemaId() {
        return this.schemaId;
    }

    /**  **/
    public void setSchemaId(Integer schemaId) {
        this.schemaId = schemaId;
    }

    /**  **/
    public String getKey() {
        return this.key;
    }

    /**  **/
    public void setKey(String key) {
        this.key = key;
    }

    /**  **/
    public String getValue() {
        return this.value;
    }

    /**  **/
    public void setValue(String value) {
        this.value = value;
    }

    /**  **/
    public String getDescription() {
        return this.description;
    }

    /**  **/
    public void setDescription(String description) {
        this.description = description;
    }

    /**  **/
    public String getTenantId() {
        return this.tenantId;
    }

    /**  **/
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    /**  **/
    public String getCreator() {
        return this.creator;
    }

    /**  **/
    public void setCreator(String creator) {
        this.creator = creator;
    }

    /**  **/
    public String getCreateBy() {
        return this.createBy;
    }

    /**  **/
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    /**  **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /**  **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**  **/
    public String getUpdater() {
        return this.updater;
    }

    /**  **/
    public void setUpdater(String updater) {
        this.updater = updater;
    }

    /**  **/
    public String getUpdateBy() {
        return this.updateBy;
    }

    /**  **/
    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    /**  **/
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /**  **/
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

}
