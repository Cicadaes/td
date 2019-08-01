package com.talkingdata.datacloud.visual.entity.report;

import com.talkingdata.datacloud.base.entity.BaseEntity;


/**
 * <b>功能：</b>TD_DC_VISUAL_REPORT_PAGE_CHART_REL ReportPageChartRelEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ReportPageChartRel extends BaseEntity {

    private Integer id;
    private Integer reportId;
    private Integer pageId;
    private Integer chartId;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>reportId -> report_id</li>
     * <li>pageId -> page_id</li>
     * <li>chartId -> chart_id</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "id": return "id";
            case "reportId": return "report_id";
            case "pageId": return "page_id";
            case "chartId": return "chart_id";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>report_id -> reportId</li>
     * <li>page_id -> pageId</li>
     * <li>chart_id -> chartId</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "id": return "id";
            case "report_id": return "reportId";
            case "page_id": return "pageId";
            case "chart_id": return "chartId";
            default: return null;
        }
    }
    
    /** 主键ID,自增 **/
    public Integer getId() {
        return this.id;
    }

    /** 主键ID,自增 **/
    public void setId(Integer id) {
        this.id = id;
    }

    /** 报表id **/
    public Integer getReportId() {
        return this.reportId;
    }

    /** 报表id **/
    public void setReportId(Integer reportId) {
        this.reportId = reportId;
    }

    /** 页面id **/
    public Integer getPageId() {
        return this.pageId;
    }

    /** 页面id **/
    public void setPageId(Integer pageId) {
        this.pageId = pageId;
    }

    /** 图表id **/
    public Integer getChartId() {
        return this.chartId;
    }

    /** 图表id **/
    public void setChartId(Integer chartId) {
        this.chartId = chartId;
    }

}
