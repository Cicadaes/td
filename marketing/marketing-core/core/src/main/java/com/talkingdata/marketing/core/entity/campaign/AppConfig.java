package com.talkingdata.marketing.core.entity.campaign;

import com.talkingdata.enterprise.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_APP_CONFIG AppConfigEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-18 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class AppConfig extends BaseEntity {

    private Integer id;
    private String appId;
    private String appName;
    private Integer productId;
    private Integer developerId;
    private String description;
    private String pushAppId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    private String tenantId;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>appId -> app_id</li>
     * <li>appName -> app_name</li>
     * <li>productId -> product_id</li>
     * <li>developerId -> developer_id</li>
     * <li>description -> description</li>
     * <li>pushAppId -> push_app_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     * <li>tenantId -> tenant_id</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) {
            return null;
        }
        switch (fieldName) {
            case "id": return "id";
            case "appId": return "app_id";
            case "appName": return "app_name";
            case "productId": return "product_id";
            case "developerId": return "developer_id";
            case "description": return "description";
            case "pushAppId": return "push_app_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updateBy": return "update_by";
            case "updateTime": return "update_time";
            case "tenantId": return "tenant_id";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>app_id -> appId</li>
     * <li>app_name -> appName</li>
     * <li>product_id -> productId</li>
     * <li>developer_id -> developerId</li>
     * <li>description -> description</li>
     * <li>push_app_id -> pushAppId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     * <li>tenant_id -> tenantId</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) {
            return null;
        }
        switch (columnName) {
            case "id": return "id";
            case "app_id": return "appId";
            case "app_name": return "appName";
            case "product_id": return "productId";
            case "developer_id": return "developerId";
            case "description": return "description";
            case "push_app_id": return "pushAppId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            case "tenant_id": return "tenantId";
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

    /** appId **/
    public String getAppId() {
        return this.appId;
    }

    /** appId **/
    public void setAppId(String appId) {
        this.appId = appId;
    }

    /** app名称 **/
    public String getAppName() {
        return this.appName;
    }

    /** app名称 **/
    public void setAppName(String appName) {
        this.appName = appName;
    }

    /**  **/
    public Integer getProductId() {
        return this.productId;
    }

    /**  **/
    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    /** 开发者id，对应正亮的数据 **/
    public Integer getDeveloperId() {
        return this.developerId;
    }

    /** 开发者id，对应正亮的数据 **/
    public void setDeveloperId(Integer developerId) {
        this.developerId = developerId;
    }

    /** 描述 **/
    public String getDescription() {
        return this.description;
    }

    /** 描述 **/
    public void setDescription(String description) {
        this.description = description;
    }

    /** push的app id **/
    public String getPushAppId() {
        return this.pushAppId;
    }

    /** push的app id **/
    public void setPushAppId(String pushAppId) {
        this.pushAppId = pushAppId;
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

    /** 租户ID **/
    public String getTenantId() {
        return this.tenantId;
    }

    /** 租户ID **/
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

}
