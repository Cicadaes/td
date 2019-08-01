package com.talkingdata.marketing.core.entity.dto;

import org.apache.commons.lang.builder.ToStringBuilder;

import java.util.List;

/**
 * The type Funnel convert overview item.
 * @author xiaoming.kang
 * @create 2017 -05-05-上午10:43
 * @since JDK 1.8
 */
public class FunnelConvertOverviewItem {

    /**
     * //起始设备数
     */
    private Long startDeviceCount;

    /**
     * //终点设备数
     */
    private Long endDeviceCount;

    /**
     * //整体转化率 *100
     */
    private Integer wholeConvertRate;

    private List<FunnelConvertOverviewEventStepItem> funnelConvertOverviewEventStepItem;

    /**
     * Gets start device count.
     *
     * @return the start device count
     */
    public Long getStartDeviceCount() {
        return startDeviceCount;
    }

    /**
     * Sets start device count.
     *
     * @param startDeviceCount the start device count
     */
    public void setStartDeviceCount(Long startDeviceCount) {
        this.startDeviceCount = startDeviceCount;
    }

    /**
     * Gets end device count.
     *
     * @return the end device count
     */
    public Long getEndDeviceCount() {
        return endDeviceCount;
    }

    /**
     * Sets end device count.
     *
     * @param endDeviceCount the end device count
     */
    public void setEndDeviceCount(Long endDeviceCount) {
        this.endDeviceCount = endDeviceCount;
    }

    /**
     * Gets whole convert rate.
     *
     * @return the whole convert rate
     */
    public Integer getWholeConvertRate() {
        return wholeConvertRate;
    }

    /**
     * Sets whole convert rate.
     *
     * @param wholeConvertRate the whole convert rate
     */
    public void setWholeConvertRate(Integer wholeConvertRate) {
        this.wholeConvertRate = wholeConvertRate;
    }

    /**
     * Gets funnel convert overview event step item.
     *
     * @return the funnel convert overview event step item
     */
    public List<FunnelConvertOverviewEventStepItem> getFunnelConvertOverviewEventStepItem() {
        return funnelConvertOverviewEventStepItem;
    }

    /**
     * Sets funnel convert overview event step item.
     *
     * @param funnelConvertOverviewEventStepItem the funnel convert overview event step item
     */
    public void setFunnelConvertOverviewEventStepItem(List<FunnelConvertOverviewEventStepItem> funnelConvertOverviewEventStepItem) {
        this.funnelConvertOverviewEventStepItem = funnelConvertOverviewEventStepItem;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this)
                .append("startDeviceCount", startDeviceCount)
                .append("endDeviceCount", endDeviceCount)
                .append("wholeConvertRate", wholeConvertRate)
                .append("funnelConvertOverviewEventStepItem", funnelConvertOverviewEventStepItem)
                .toString();
    }
}
