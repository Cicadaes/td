package com.talkingdata.marketing.core.entity.dto;

import java.util.List;

import com.talkingdata.marketing.core.entity.campaign.PushReachReport;

/**
 * @author chunyan.ji
 * @create 2018-03-01
 * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
 * @since JDK 1.8
 */
public class PushReachReportDto {
    /**发送数*/
    private Integer totalSendCount;
    /**到达数*/
    private Integer totalReachCount;
    /**展示数*/
    private Integer totalDisplayCount;
    /**点击数*/
    private Integer totalClickCount;
    /**到达率*/
    private String totalReachPercent;
    /**展示率*/
    private String totalDisplayPercent;
    /**点击率*/
    private String totalClickPercent;

    private List<PushReachReport> pushReachReports;

    /**初始化构造函数*/
    public PushReachReportDto() {
    }

    /**
     * 初始化构造函数和变量
     * @param totalSendCount 发送数
     * @param totalReachCount 到达数
     * @param totalDisplayCount 展示数
     * @param totalClickCount 点击数
     * @param totalReachPercent 到达率
     * @param totalDisplayPercent 展示率
     * @param totalClickPercent 点击率
     * @param pushReachReports 投放报告列表
     */
    public PushReachReportDto(Integer totalSendCount, Integer totalReachCount, Integer totalDisplayCount,
                              Integer totalClickCount, String totalReachPercent, String totalDisplayPercent,
                              String totalClickPercent, List<PushReachReport> pushReachReports) {
        this.totalSendCount = totalSendCount;
        this.totalReachCount = totalReachCount;
        this.totalDisplayCount = totalDisplayCount;
        this.totalClickCount = totalClickCount;
        this.totalReachPercent = totalReachPercent;
        this.totalDisplayPercent = totalDisplayPercent;
        this.totalClickPercent = totalClickPercent;
        this.pushReachReports = pushReachReports;
    }

    /**
     * 初始化构造函数和变量
     * @param totalSendCount 发送数
     * @param totalReachCount 到达数
     * @param totalDisplayCount 展示数
     * @param totalClickCount 点击数
     * @param pushReachReports 投放报告列表
     */
    public PushReachReportDto(Integer totalSendCount, Integer totalReachCount, Integer totalDisplayCount,
            Integer totalClickCount, List<PushReachReport> pushReachReports) {
        this.totalSendCount = totalSendCount;
        this.totalReachCount = totalReachCount;
        this.totalDisplayCount = totalDisplayCount;
        this.totalClickCount = totalClickCount;
        this.pushReachReports = pushReachReports;
    }
}