package com.talkingdata.marketing.batch.bean;

import java.util.Date;

/**
 * @author Created by tend on 2017/11/9.
 */
public class BatchProcessDetail {
    private Long id;
    private Integer status;
    private Integer calcStatus;
    private Integer esScrollOffset;
    private Date startTime;
    private Date endTime;
    private String errorFilePath;
    private String errorInfo;
    private String tenantId;
    private String creator;
    private String createBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    private String updater;
    private String updateBy;
    @org.springframework.format.annotation.DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    /**
     * 非DB属性，表示在查询时，当前批次查询的结束毫秒值
     */
    private Long currentTimeMillis;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getCalcStatus() {
        return calcStatus;
    }

    public void setCalcStatus(Integer calcStatus) {
        this.calcStatus = calcStatus;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Integer getEsScrollOffset() {
        return esScrollOffset;
    }

    public void setEsScrollOffset(Integer esScrollOffset) {
        this.esScrollOffset = esScrollOffset;
    }

    public String getErrorFilePath() {
        return errorFilePath;
    }

    public void setErrorFilePath(String errorFilePath) {
        this.errorFilePath = errorFilePath;
    }

    public String getErrorInfo() {
        return errorInfo;
    }

    public void setErrorInfo(String errorInfo) {
        this.errorInfo = errorInfo;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdater() {
        return updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getCurrentTimeMillis() {
        return currentTimeMillis;
    }

    public void setCurrentTimeMillis(Long currentTimeMillis) {
        this.currentTimeMillis = currentTimeMillis;
    }

    @Override
    public String toString() {
        return "BatchProcessDetail{" +
                "id=" + id +
                ", status=" + status +
                ", calcStatus=" + calcStatus +
                ", esScrollOffset=" + esScrollOffset +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", errorFilePath='" + errorFilePath + '\'' +
                ", errorInfo='" + errorInfo + '\'' +
                ", tenantId='" + tenantId + '\'' +
                ", creator='" + creator + '\'' +
                ", createBy='" + createBy + '\'' +
                ", createTime=" + createTime +
                ", updater='" + updater + '\'' +
                ", updateBy='" + updateBy + '\'' +
                ", updateTime=" + updateTime +
                ", currentTimeMillis=" + currentTimeMillis +
                '}';
    }
}
