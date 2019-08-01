package com.talkingdata.datacloud.visual.page.report;

import com.talkingdata.datacloud.base.page.BasePage;


/**
 * <b>功能：</b>TD_DC_VISUAL_REPORT_PAGE_CHART_REL ReportPageChartRelPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ReportPageChartRelPage extends BasePage {

    private Integer id;
    private String idOperator = "=";
    private Integer reportId;
    private String reportIdOperator = "=";
    private Integer pageId;
    private String pageIdOperator = "=";
    private Integer chartId;
    private String chartIdOperator = "=";

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getIdOperator() {
        return idOperator;
    }

    public void setIdOperator(String idOperator) {
        this.idOperator = idOperator;
    }

    public Integer getReportId() {
        return reportId;
    }

    public void setReportId(Integer reportId) {
        this.reportId = reportId;
    }

    public String getReportIdOperator() {
        return reportIdOperator;
    }

    public void setReportIdOperator(String reportIdOperator) {
        this.reportIdOperator = reportIdOperator;
    }

    public Integer getPageId() {
        return pageId;
    }

    public void setPageId(Integer pageId) {
        this.pageId = pageId;
    }

    public String getPageIdOperator() {
        return pageIdOperator;
    }

    public void setPageIdOperator(String pageIdOperator) {
        this.pageIdOperator = pageIdOperator;
    }

    public Integer getChartId() {
        return chartId;
    }

    public void setChartId(Integer chartId) {
        this.chartId = chartId;
    }

    public String getChartIdOperator() {
        return chartIdOperator;
    }

    public void setChartIdOperator(String chartIdOperator) {
        this.chartIdOperator = chartIdOperator;
    }
}
