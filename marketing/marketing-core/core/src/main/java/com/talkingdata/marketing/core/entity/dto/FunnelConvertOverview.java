package com.talkingdata.marketing.core.entity.dto;

import java.util.List;
import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * The type Funnel convert overview.
 * @author xiaoming.kang
 * @create 2017 -05-05-上午10:40
 * @since JDK 1.8
 */
public class FunnelConvertOverview {

    private Integer crowdId;

    private String crowdName;

    private List<FunnelConvertOverviewEventStepItem> funnelConvertOverviewEventStepItem;

    /**
     * Gets crowd id.
     *
     * @return the crowd id
     */
    public Integer getCrowdId() {
        return crowdId;
    }

    /**
     * Sets crowd id.
     *
     * @param crowdId the crowd id
     */
    public void setCrowdId(Integer crowdId) {
        this.crowdId = crowdId;
    }

    /**
     * Gets crowd name.
     *
     * @return the crowd name
     */
    public String getCrowdName() {
        return crowdName;
    }

    /**
     * Sets crowd name.
     *
     * @param crowdName the crowd name
     */
    public void setCrowdName(String crowdName) {
        this.crowdName = crowdName;
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
                .append("crowdId", crowdId)
                .append("crowdName", crowdName)
                .append("funnelConvertOverviewEventStepItem", funnelConvertOverviewEventStepItem)
                .toString();
    }
}
