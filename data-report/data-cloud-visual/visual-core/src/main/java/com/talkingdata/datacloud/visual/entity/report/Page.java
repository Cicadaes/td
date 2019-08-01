package com.talkingdata.datacloud.visual.entity.report;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <b>功能：</b>TD_DC_VISUAL_PAGE PageEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class Page extends BaseEntity {

    private Integer id;
    private Integer reportId;
    private String name;
    private String backgroundColor;
    private String backgroundImage;
    private Integer width;
    private Integer height;
    private Integer zIndex;
    private Boolean isCustom;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date updateTime;
    private List<Chart> chartList=new ArrayList<Chart>();

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>reportId -> report_id</li>
     * <li>name -> name</li>
     * <li>backgroundColor -> background_color</li>
     * <li>backgroundImage -> background_image</li>
     * <li>width -> width</li>
     * <li>height -> height</li>
     * <li>zIndex -> z_index</li>
     * <li>isCustom -> is_custom</li>
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
            case "reportId": return "report_id";
            case "name": return "name";
            case "backgroundColor": return "background_color";
            case "backgroundImage": return "background_image";
            case "width": return "width";
            case "height": return "height";
            case "zIndex": return "z_index";
            case "isCustom": return "is_custom";
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
     * <li>report_id -> reportId</li>
     * <li>name -> name</li>
     * <li>background_color -> backgroundColor</li>
     * <li>background_image -> backgroundImage</li>
     * <li>width -> width</li>
     * <li>height -> height</li>
     * <li>z_index -> zIndex</li>
     * <li>is_custom -> isCustom</li>
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
            case "report_id": return "reportId";
            case "name": return "name";
            case "background_color": return "backgroundColor";
            case "background_image": return "backgroundImage";
            case "width": return "width";
            case "height": return "height";
            case "z_index": return "zIndex";
            case "is_custom": return "isCustom";
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

    /** 报表ID **/
    public Integer getReportId() {
        return this.reportId;
    }

    /** 报表ID **/
    public void setReportId(Integer reportId) {
        this.reportId = reportId;
    }

    /** 名称 **/
    public String getName() {
        return this.name;
    }

    /** 名称 **/
    public void setName(String name) {
        this.name = name;
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

    /**  **/
    public Integer getWidth() {
        return this.width;
    }

    /**  **/
    public void setWidth(Integer width) {
        this.width = width;
    }

    /**  **/
    public Integer getHeight() {
        return this.height;
    }

    /**  **/
    public void setHeight(Integer height) {
        this.height = height;
    }

    /**  **/
    public Integer getZIndex() {
        return this.zIndex;
    }

    /**  **/
    public void setZIndex(Integer zIndex) {
        this.zIndex = zIndex;
    }

    /** 定制标记 **/
    public Boolean getIsCustom() {
        return this.isCustom;
    }

    /** 定制标记 **/
    public void setIsCustom(Boolean isCustom) {
        this.isCustom = isCustom;
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

    public List<Chart> getChartList() {
        return chartList;
    }

    public void setChartList(List<Chart> chartList) {
        this.chartList = chartList;
    }
}
