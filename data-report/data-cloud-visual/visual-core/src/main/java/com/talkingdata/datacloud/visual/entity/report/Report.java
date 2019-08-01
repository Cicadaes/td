package com.talkingdata.datacloud.visual.entity.report;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <b>功能：</b>TD_DC_VISUAL_REPORT ReportEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class Report extends BaseEntity {

    private Integer id;
    private String name;
    private String description;
    private String backgroundColor;
    private String backgroundImage;
    @JsonIgnore
    private String formatAndTheme;
    private Integer status=0;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date publishTime;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date offlineTime;
    @JsonIgnore
    private List<Page> pageList=new ArrayList<>();

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>name -> name</li>
     * <li>description -> description</li>
     * <li>backgroundColor -> background_color</li>
     * <li>backgroundImage -> background_image</li>
     * <li>formatAndTheme -> format_and_theme</li>
     * <li>status -> status</li>
     * <li>tenantId -> tenant_id</li>
     * <li>creator -> creator</li>
     * <li>createBy -> create_by</li>
     * <li>createTime -> create_time</li>
     * <li>updater -> updater</li>
     * <li>updateBy -> update_by</li>
     * <li>updateTime -> update_time</li>
     * <li>publishTime -> publish_time</li>
     * <li>offlineTime -> offline_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "id": return "id";
            case "name": return "name";
            case "description": return "description";
            case "backgroundColor": return "background_color";
            case "backgroundImage": return "background_image";
            case "formatAndTheme": return "format_and_theme";
            case "status": return "status";
            case "tenantId": return "tenant_id";
            case "creator": return "creator";
            case "createBy": return "create_by";
            case "createTime": return "create_time";
            case "updater": return "updater";
            case "updateBy": return "update_by";
            case "updateTime": return "update_time";
            case "publishTime": return "publish_time";
            case "offlineTime": return "offline_time";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>name -> name</li>
     * <li>description -> description</li>
     * <li>background_color -> backgroundColor</li>
     * <li>background_image -> backgroundImage</li>
     * <li>format_and_theme -> formatAndTheme</li>
     * <li>status -> status</li>
     * <li>tenant_id -> tenantId</li>
     * <li>creator -> creator</li>
     * <li>create_by -> createBy</li>
     * <li>create_time -> createTime</li>
     * <li>updater -> updater</li>
     * <li>update_by -> updateBy</li>
     * <li>update_time -> updateTime</li>
     * <li>publish_time -> publishTime</li>
     * <li>offline_time -> offlineTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "id": return "id";
            case "name": return "name";
            case "description": return "description";
            case "background_color": return "backgroundColor";
            case "background_image": return "backgroundImage";
            case "format_and_theme": return "formatAndTheme";
            case "status": return "status";
            case "tenant_id": return "tenantId";
            case "creator": return "creator";
            case "create_by": return "createBy";
            case "create_time": return "createTime";
            case "updater": return "updater";
            case "update_by": return "updateBy";
            case "update_time": return "updateTime";
            case "publish_time": return "publishTime";
            case "offline_time": return "offlineTime";
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

    /** 名称 **/
    public String getName() {
        return this.name;
    }

    /** 名称 **/
    public void setName(String name) {
        this.name = name;
    }

    /** 描述 **/
    public String getDescription() {
        return this.description;
    }

    /** 描述 **/
    public void setDescription(String description) {
        this.description = description;
    }

    /** 背景色 **/
    public String getBackgroundColor() {
        return this.backgroundColor;
    }

    /** 背景色 **/
    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    /** 背景图 **/
    public String getBackgroundImage() {
        return this.backgroundImage;
    }

    /** 背景图 **/
    public void setBackgroundImage(String backgroundImage) {
        this.backgroundImage = backgroundImage;
    }

    /** 版式和主题 **/
    public String getFormatAndTheme() {
        return this.formatAndTheme;
    }

    /** 版式和主题 **/
    public void setFormatAndTheme(String formatAndTheme) {
        this.formatAndTheme = formatAndTheme;
    }

    /** 状态 0:未发布,1:发布,2:下线 **/
    public Integer getStatus() {
        return this.status;
    }

    /** 状态 0:未发布,1:发布,2:下线 **/
    public void setStatus(Integer status) {
        this.status = status;
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

    /** 发布时间 **/
    public Date getPublishTime() {
        return this.publishTime;
    }

    /** 发布时间 **/
    public void setPublishTime(Date publishTime) {
        this.publishTime = publishTime;
    }

    /** 下线时间 **/
    public Date getOfflineTime() {
        return this.offlineTime;
    }

    /** 下线时间 **/
    public void setOfflineTime(Date offlineTime) {
        this.offlineTime = offlineTime;
    }

    public List<Page> getPageList() {
        return pageList;
    }

    public void setPageList(List<Page> pageList) {
        this.pageList = pageList;
    }
}
