package com.talkingdata.datacloud.entity.report;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/2/14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ReportEx {
  private Integer id;
  private String snipeId;
  private String reportName;
  private Integer chartSize;
  private Date createTime;
  private String creator;
  private Boolean publishFlag;

  public ReportEx(SnipeReport report) {
    this.id = report.getId();
    this.snipeId = report.getReportUuid();
    this.createTime = report.getCreateTime();
    this.creator = report.getCreator();
    this.publishFlag = report.getPublishFlag();
    this.reportName = report.getTitle();
  }

  public Boolean getPublishFlag() {
    return publishFlag;
  }

  public void setPublishFlag(Boolean publishFlag) {
    this.publishFlag = publishFlag;
  }

  public String getCreator() {
    return creator;
  }

  public void setCreator(String creator) {
    this.creator = creator;
  }

  public Date getCreateTime() {
    return createTime;
  }

  public void setCreateTime(Date createTime) {
    this.createTime = createTime;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getSnipeId() {
    return snipeId;
  }

  public void setSnipeId(String snipeId) {
    this.snipeId = snipeId;
  }

  public String getReportName() {
    return reportName;
  }

  public void setReportName(String reportName) {
    this.reportName = reportName;
  }

  public Integer getChartSize() {
    return chartSize;
  }

  public void setChartSize(Integer chartSize) {
    this.chartSize = chartSize;
  }

}
