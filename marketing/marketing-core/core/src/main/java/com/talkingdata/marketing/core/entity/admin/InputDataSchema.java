package com.talkingdata.marketing.core.entity.admin;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_INPUT_DATA_SCHEMA InputDataSchemaEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-13 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class InputDataSchema extends BaseEntity {

    private Integer id;
    private Integer parentId;
    private String name;
    private String code;
    private String type;
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
     * <li>parentId -> parent_id</li>
     * <li>name -> name</li>
     * <li>code -> code</li>
     * <li>type -> type</li>
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
            case "parentId": return "parent_id";
            case "name": return "name";
            case "code": return "code";
            case "type": return "type";
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
     * <li>parent_id -> parentId</li>
     * <li>name -> name</li>
     * <li>code -> code</li>
     * <li>type -> type</li>
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
            case "parent_id": return "parentId";
            case "name": return "name";
            case "code": return "code";
            case "type": return "type";
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
    public Integer getParentId() {
        return this.parentId;
    }

    /**  **/
    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    /**  **/
    public String getName() {
        return this.name;
    }

    /**  **/
    public void setName(String name) {
        this.name = name;
    }

    /**  **/
    public String getCode() {
        return this.code;
    }

    /**  **/
    public void setCode(String code) {
        this.code = code;
    }

    /**  **/
    public String getType() {
        return this.type;
    }

    /**  **/
    public void setType(String type) {
        this.type = type;
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
