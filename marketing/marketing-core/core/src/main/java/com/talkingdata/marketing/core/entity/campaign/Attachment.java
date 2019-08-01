package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_ATTACHMENT AttachmentEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-01-31 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class Attachment extends BaseEntity {

    private Integer id;
    private Integer refId;
    private String name;
    private String path;
    private Integer type;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updaterBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>refId -> ref_id</li>
     * <li>name -> name</li>
     * <li>path -> path</li>
     * <li>type -> type</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updaterBy -> updater_by</li>
     * <li>updateTime -> update_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null){
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "refId": return "ref_id";
            case "name": return "name";
            case "path": return "path";
            case "type": return "type";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updaterBy": return "updater_by";
            case "updateTime": return "update_time";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>ref_id -> refId</li>
     * <li>name -> name</li>
     * <li>path -> path</li>
     * <li>type -> type</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>updater_by -> updaterBy</li>
     * <li>update_time -> updateTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null){
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "ref_id": return "refId";
            case "name": return "name";
            case "path": return "path";
            case "type": return "type";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "updater_by": return "updaterBy";
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

    /** 人群ID **/
    public Integer getRefId() {
        return this.refId;
    }

    /** 人群ID **/
    public void setRefId(Integer refId) {
        this.refId = refId;
    }

    /** 上传文件名称 **/
    public String getName() {
        return this.name;
    }

    /** 上传文件名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /** 路径 **/
    public String getPath() {
        return this.path;
    }

    /** 路径 **/
    public void setPath(String path) {
        this.path = path;
    }

    /** 1 人群使用 2 权益使用 **/
    public Integer getType() {
        return this.type;
    }

    /** 1 人群使用 2 权益使用 **/
    public void setType(Integer type) {
        this.type = type;
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
    public String getUpdaterBy() {
        return this.updaterBy;
    }

    /** 更新人账号 **/
    public void setUpdaterBy(String updaterBy) {
        this.updaterBy = updaterBy;
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
