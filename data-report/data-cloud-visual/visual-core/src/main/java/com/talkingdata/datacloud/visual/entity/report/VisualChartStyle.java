package com.talkingdata.datacloud.visual.entity.report;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_DC_VISUAL_CHART_STYLE VisualChartStyleEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class VisualChartStyle extends BaseEntity {

    private Integer id;
    private Integer chartId;
    private Integer width;
    private Integer height;
    private Integer left;
    private Integer top;
    private Integer winHeight;
    private Integer winWidth;
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
     * <li>chartId -> chart_id</li>
     * <li>width -> width</li>
     * <li>height -> height</li>
     * <li>left -> left</li>
     * <li>top -> top</li>
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
            case "chartId": return "chart_id";
            case "width": return "width";
            case "height": return "height";
            case "left": return "left";
            case "top": return "top";
            case "winHeight": return "win_height";
            case "winWidth": return "win_width";
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
     * <li>chart_id -> chartId</li>
     * <li>width -> width</li>
     * <li>height -> height</li>
     * <li>left -> left</li>
     * <li>top -> top</li>
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
            case "chart_id": return "chartId";
            case "width": return "width";
            case "height": return "height";
            case "left": return "left";
            case "top": return "top";
            case "win_height": return "winHeight";
            case "win_width": return "winWidth";
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

    /** chart ID **/
    public Integer getChartId() {
        return this.chartId;
    }

    /** chart ID **/
    public void setChartId(Integer chartId) {
        this.chartId = chartId;
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
    public Integer getLeft() {
        return this.left;
    }

    /**  **/
    public void setLeft(Integer left) {
        this.left = left;
    }

    /**  **/
    public Integer getTop() {
        return this.top;
    }

    /**  **/
    public void setTop(Integer top) {
        this.top = top;
    }

    public Integer getWinHeight() {
        return winHeight;
    }

    public void setWinHeight(Integer winHeight) {
        this.winHeight = winHeight;
    }

    public Integer getWinWidth() {
        return winWidth;
    }

    public void setWinWidth(Integer winWidth) {
        this.winWidth = winWidth;
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
