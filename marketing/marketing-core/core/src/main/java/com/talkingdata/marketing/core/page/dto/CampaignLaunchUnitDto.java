package com.talkingdata.marketing.core.page.dto;

import com.talkingdata.marketing.core.entity.campaign.CampaignLaunchUnit;
import com.talkingdata.marketing.core.vo.campaign.SegmentVO;

import java.util.List;

/**
 * The type Campaign launch unit dto.
 * @author xiaoming.kang
 */
public class CampaignLaunchUnitDto extends CampaignLaunchUnit{
    private Integer crowdStatus;
    private Integer crowdType;
    private Integer refId;
    private List<SegmentVO> segmentList;

    /**
     * Gets crowd status.
     *
     * @return the crowd status
     */
    public Integer getCrowdStatus() {
        return crowdStatus;
    }

    /**
     * Sets crowd status.
     *
     * @param crowdStatus the crowd status
     */
    public void setCrowdStatus(Integer crowdStatus) {
        this.crowdStatus = crowdStatus;
    }

    /**
     * Gets crowd type.
     *
     * @return the crowd type
     */
    public Integer getCrowdType() {
        return crowdType;
    }

    /**
     * Sets crowd type.
     *
     * @param crowdType the crowd type
     */
    public void setCrowdType(Integer crowdType) {
        this.crowdType = crowdType;
    }

    /**
     * Gets ref id.
     *
     * @return the ref id
     */
    public Integer getRefId() {
        return refId;
    }

    /**
     * Sets ref id.
     *
     * @param refId the ref id
     */
    public void setRefId(Integer refId) {
        this.refId = refId;
    }

    /**
     * Gets segment list.
     *
     * @return the segment list
     */
    public List<SegmentVO> getSegmentList() {
        return segmentList;
    }

    /**
     * Sets segment list.
     *
     * @param segmentList the segment list
     */
    public void setSegmentList(List<SegmentVO> segmentList) {
        this.segmentList = segmentList;
    }
}
