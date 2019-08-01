package com.talkingdata.marketing.core.page.campaign.extend;

import java.util.List;

/**
 * <b>功能：</b>TD_MKT_PIPELINE_DEFINITION PipelineDefinitionPage<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-08-21 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class PipelineDefinitionExtendPage {
    private String campaignId;
    private String name;
    private String creator;
    private Long updateTime1;
    private Long updateTime2;
    private String updater;
    private List<Integer> statusList;
    private Integer page = 1;

    private Integer pageSize = 10;

    public List<Integer> getStatusList() {
        return statusList;
    }

    public void setStatusList(List<Integer> statusList) {
        this.statusList = statusList;
    }

    public String getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(String campaignId) {
        this.campaignId = campaignId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public Long getUpdateTime1() {
        return updateTime1;
    }

    public void setUpdateTime1(Long updateTime1) {
        this.updateTime1 = updateTime1;
    }

    public Long getUpdateTime2() {
        return updateTime2;
    }

    public void setUpdateTime2(Long updateTime2) {
        this.updateTime2 = updateTime2;
    }

    public String getUpdater() {
        return updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
}
