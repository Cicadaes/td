package com.talkingdata.datacloud.entity.report;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_DC_SNIPE_REPORT_CHART_REL SnipeReportChartRelEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-28 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class SnipeReportChartRel extends BaseEntity {

    private Integer id;
    private Integer reportId;
    private Integer chartId;
    private Integer column;
    private Integer row;
    private Integer width;
    private Integer height;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>reportId -> report_id</li>
     * <li>chartId -> chart_id</li>
     * <li>column -> column</li>
     * <li>row -> row</li>
     * <li>width -> width</li>
     * <li>height -> height</li>
     * <li>createTime -> create_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "id": return "id";
            case "reportId": return "report_id";
            case "chartId": return "chart_id";
            case "column": return "column";
            case "row": return "row";
            case "width": return "width";
            case "height": return "height";
            case "createTime": return "create_time";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>report_id -> reportId</li>
     * <li>chart_id -> chartId</li>
     * <li>column -> column</li>
     * <li>row -> row</li>
     * <li>width -> width</li>
     * <li>height -> height</li>
     * <li>create_time -> createTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "id": return "id";
            case "report_id": return "reportId";
            case "chart_id": return "chartId";
            case "column": return "column";
            case "row": return "row";
            case "width": return "width";
            case "height": return "height";
            case "create_time": return "createTime";
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

    /** 图表ID **/
    public Integer getChartId() {
        return this.chartId;
    }

    /** 图表ID **/
    public void setChartId(Integer chartId) {
        this.chartId = chartId;
    }

    /** 列位置 **/
    public Integer getColumn() {
        return this.column;
    }

    /** 列位置 **/
    public void setColumn(Integer column) {
        this.column = column;
    }

    /** 行位置 **/
    public Integer getRow() {
        return this.row;
    }

    /** 行位置 **/
    public void setRow(Integer row) {
        this.row = row;
    }

    /** 宽 **/
    public Integer getWidth() {
        return this.width;
    }

    /** 宽 **/
    public void setWidth(Integer width) {
        this.width = width;
    }

    /** 高 **/
    public Integer getHeight() {
        return this.height;
    }

    /** 高 **/
    public void setHeight(Integer height) {
        this.height = height;
    }

    /** 创建时间 **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 创建时间 **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

}
