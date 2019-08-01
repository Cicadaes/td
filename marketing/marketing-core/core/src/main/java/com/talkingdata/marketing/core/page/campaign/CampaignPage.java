package com.talkingdata.marketing.core.page.campaign;

import com.talkingdata.enterprise.base.page.BasePage;

import java.util.Date;

/**
 * <b>功能：</b>TD_MKT_CAMPAIGN CampaignPage<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CampaignPage extends BasePage {
    private String id;
    private String idOperator = "=";
    private String name;
    private String nameOperator = "=";
    private String description;
    private String descriptionOperator = "=";
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    private Long startTimeLong;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date startTime1;
    private Long startTime1Long;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date startTime2;
    private Long startTime2Long;
    private String startTimeOperator = "=";
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date endTime;
    private Long endTimeLong;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date endTime1;
    private Long endTime1Long;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date endTime2;
    private Long endTime2Long;
    private String endTimeOperator = "=";
    private String status;
    private String statusOperator = "=";
    private String tenantId;
    private String tenantIdOperator = "=";
    private String creator;
    private String creatorOperator = "=";
    private String createBy;
    private String createByOperator = "=";
    private String createTime;
    private String createTime1;
    private String createTime2;
    private String createTimeOperator = "=";
    private String updater;
    private String updaterOperator = "=";
    private String updateBy;
    private String updateByOperator = "=";
    private String updateTime;
    private String updateTime1;
    private String updateTime2;
    private String updateTimeOperator = "=";

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdOperator() {
        return this.idOperator;
    }

    public void setIdOperator(String idOperator) {
        this.idOperator = idOperator;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameOperator() {
        return this.nameOperator;
    }

    public void setNameOperator(String nameOperator) {
        this.nameOperator = nameOperator;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescriptionOperator() {
        return this.descriptionOperator;
    }

    public void setDescriptionOperator(String descriptionOperator) {
        this.descriptionOperator = descriptionOperator;
    }

    public String getStartTimeOperator() {
        return this.startTimeOperator;
    }

    public void setStartTimeOperator(String startTimeOperator) {
        this.startTimeOperator = startTimeOperator;
    }

    public String getEndTimeOperator() {
        return this.endTimeOperator;
    }

    public void setEndTimeOperator(String endTimeOperator) {
        this.endTimeOperator = endTimeOperator;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusOperator() {
        return this.statusOperator;
    }

    public void setStatusOperator(String statusOperator) {
        this.statusOperator = statusOperator;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTenantIdOperator() {
        return this.tenantIdOperator;
    }

    public void setTenantIdOperator(String tenantIdOperator) {
        this.tenantIdOperator = tenantIdOperator;
    }

    public String getCreator() {
        return this.creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreatorOperator() {
        return this.creatorOperator;
    }

    public void setCreatorOperator(String creatorOperator) {
        this.creatorOperator = creatorOperator;
    }

    public String getCreateBy() {
        return this.createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public String getCreateByOperator() {
        return this.createByOperator;
    }

    public void setCreateByOperator(String createByOperator) {
        this.createByOperator = createByOperator;
    }

    public String getCreateTime() {
        return this.createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getCreateTime1() {
        return this.createTime1;
    }

    public void setCreateTime1(String createTime1) {
        this.createTime1 = createTime1;
    }

    public String getCreateTime2() {
        return this.createTime2;
    }

    public void setCreateTime2(String createTime2) {
        this.createTime2 = createTime2;
    }

    public String getCreateTimeOperator() {
        return this.createTimeOperator;
    }

    public void setCreateTimeOperator(String createTimeOperator) {
        this.createTimeOperator = createTimeOperator;
    }

    public String getUpdater() {
        return this.updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater;
    }

    public String getUpdaterOperator() {
        return this.updaterOperator;
    }

    public void setUpdaterOperator(String updaterOperator) {
        this.updaterOperator = updaterOperator;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public String getUpdateByOperator() {
        return this.updateByOperator;
    }

    public void setUpdateByOperator(String updateByOperator) {
        this.updateByOperator = updateByOperator;
    }

    public String getUpdateTime() {
        return this.updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }

    public String getUpdateTime1() {
        return this.updateTime1;
    }

    public void setUpdateTime1(String updateTime1) {
        this.updateTime1 = updateTime1;
    }

    public String getUpdateTime2() {
        return this.updateTime2;
    }

    public void setUpdateTime2(String updateTime2) {
        this.updateTime2 = updateTime2;
    }

    public String getUpdateTimeOperator() {
        return this.updateTimeOperator;
    }

    public void setUpdateTimeOperator(String updateTimeOperator) {
        this.updateTimeOperator = updateTimeOperator;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getStartTime1() {
        return startTime1;
    }

    public void setStartTime1(Date startTime1) {
        this.startTime1 = startTime1;
    }

    public Date getStartTime2() {
        return startTime2;
    }

    public void setStartTime2(Date startTime2) {
        this.startTime2 = startTime2;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Date getEndTime1() {
        return endTime1;
    }

    public void setEndTime1(Date endTime1) {
        this.endTime1 = endTime1;
    }

    public Date getEndTime2() {
        return endTime2;
    }

    public void setEndTime2(Date endTime2) {
        this.endTime2 = endTime2;
    }

    public Long getStartTimeLong() {
        return startTimeLong;
    }

    public void setStartTimeLong(Long startTimeLong) {
        this.startTimeLong = startTimeLong;
    }

    public Long getStartTime1Long() {
        return startTime1Long;
    }

    public void setStartTime1Long(Long startTime1Long) {
        this.startTime1Long = startTime1Long;
    }

    public Long getStartTime2Long() {
        return startTime2Long;
    }

    public void setStartTime2Long(Long startTime2Long) {
        this.startTime2Long = startTime2Long;
    }

    public Long getEndTimeLong() {
        return endTimeLong;
    }

    public void setEndTimeLong(Long endTimeLong) {
        this.endTimeLong = endTimeLong;
    }

    public Long getEndTime1Long() {
        return endTime1Long;
    }

    public void setEndTime1Long(Long endTime1Long) {
        this.endTime1Long = endTime1Long;
    }

    public Long getEndTime2Long() {
        return endTime2Long;
    }

    public void setEndTime2Long(Long endTime2Long) {
        this.endTime2Long = endTime2Long;
    }

    public static void fillDate(CampaignPage page){
        if (page.getStartTimeLong()!= null){
            page.setStartTime(new Date(page.getStartTimeLong()));
        }
        if (page.getStartTime1Long()!= null){
            page.setStartTime1(new Date(page.getStartTime1Long()));
        }
        if (page.getStartTime2Long()!= null){
            page.setStartTime2(new Date(page.getStartTime2Long()));
        }

        if (page.getEndTimeLong()!=null){
            page.setEndTime(new Date(page.getEndTimeLong()));
        }
        if (page.getEndTime1Long()!= null){
            page.setEndTime1(new Date(page.getEndTime1Long()));
        }
        if (page.getEndTime2Long()!= null){
            page.setEndTime2(new Date(page.getEndTime2Long()));
        }
    }
}
