package com.talkingdata.marketing.core.entity.dto;

import java.util.List;

/**
 * The type Effect segment dto.
 * @author xiaoming.kang
 */
public class EffectSegmentDto {
    private Integer segmentId;
    private String segmentName;
    private Integer channelDefinitionId;
    private List<EffectItemDto> items;

    /**
     * Gets segment id.
     *
     * @return the segment id
     */
    public Integer getSegmentId() {
        return segmentId;
    }

    /**
     * Sets segment id.
     *
     * @param segmentId the segment id
     */
    public void setSegmentId(Integer segmentId) {
        this.segmentId = segmentId;
    }

    /**
     * Gets segment name.
     *
     * @return the segment name
     */
    public String getSegmentName() {
        return segmentName;
    }

    /**
     * Sets segment name.
     *
     * @param segmentName the segment name
     */
    public void setSegmentName(String segmentName) {
        this.segmentName = segmentName;
    }

    /**
     * Gets items.
     *
     * @return the items
     */
    public List<EffectItemDto> getItems() {
        return items;
    }

    /**
     * Sets items.
     *
     * @param items the items
     */
    public void setItems(List<EffectItemDto> items) {
        this.items = items;
    }

    /**
     * Gets channel definition id.
     *
     * @return the channel definition id
     */
    public Integer getChannelDefinitionId() {
        return channelDefinitionId;
    }

    /**
     * Sets channel definition id.
     *
     * @param channelDefinitionId the channel definition id
     */
    public void setChannelDefinitionId(Integer channelDefinitionId) {
        this.channelDefinitionId = channelDefinitionId;
    }
}
