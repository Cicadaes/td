package com.talkingdata.marketing.core.vo.campaign;

import com.google.common.base.Objects;
import com.talkingdata.marketing.core.entity.campaign.Segment;

/**
 * @author xiaoming.kang
 * @date 2018/02/07.
 */
public class SegmentVO extends Segment {

    private String subCrowdName;
    private Integer targetCount;
    /**
     *  day/week/date
     */
    private Integer cycleVal;
    /**
     *  hour
     */
    private Integer cycleHour;
    /**
     * minute
     */
    private Integer cycleMinute;
    private String channelCode;
    private Integer channelType;
    private Integer subCrowdId;
    private Integer calcObjectStatus;

    public String getSubCrowdName() {
        return subCrowdName;
    }

    public void setSubCrowdName(String subCrowdName) {
        this.subCrowdName = subCrowdName;
    }

    public Integer getTargetCount() {
        return targetCount;
    }

    public void setTargetCount(Integer targetCount) {
        this.targetCount = targetCount;
    }

    public Integer getCycleVal() {
        return cycleVal;
    }

    public void setCycleVal(Integer cycleVal) {
        this.cycleVal = cycleVal;
    }

    public Integer getCycleHour() {
        return cycleHour;
    }

    public void setCycleHour(Integer cycleHour) {
        this.cycleHour = cycleHour;
    }

    public Integer getCycleMinute() {
        return cycleMinute;
    }

    public void setCycleMinute(Integer cycleMinute) {
        this.cycleMinute = cycleMinute;
    }

    public String getChannelCode() {
        return channelCode;
    }

    public void setChannelCode(String channelCode) {
        this.channelCode = channelCode;
    }

    public Integer getChannelType() {
        return channelType;
    }

    public void setChannelType(Integer channelType) {
        this.channelType = channelType;
    }

    public Integer getSubCrowdId() {
        return subCrowdId;
    }

    public void setSubCrowdId(Integer subCrowdId) {
        this.subCrowdId = subCrowdId;
    }

    public Integer getCalcObjectStatus() {
        return calcObjectStatus;
    }

    public void setCalcObjectStatus(Integer calcObjectStatus) {
        this.calcObjectStatus = calcObjectStatus;
    }

    @Override
    public String toString() {
        return "SegmentVO{" + "subCrowdName='" + subCrowdName + '\'' + ", targetCount=" + targetCount + ", cycleVal=" + cycleVal + ", cycleHour="
                + cycleHour + ", cycleMinute=" + cycleMinute + ", channelCode='" + channelCode + '\'' + ", channelType=" + channelType
                + ", subCrowdId=" + subCrowdId + ", calcObjectStatus=" + calcObjectStatus + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        SegmentVO segmentVO = (SegmentVO) o;
        return Objects.equal(subCrowdName, segmentVO.subCrowdName) && Objects.equal(targetCount, segmentVO.targetCount) && Objects
                .equal(cycleVal, segmentVO.cycleVal) && Objects.equal(cycleHour, segmentVO.cycleHour) && Objects
                .equal(cycleMinute, segmentVO.cycleMinute) && Objects.equal(channelCode, segmentVO.channelCode) && Objects
                .equal(channelType, segmentVO.channelType) && Objects.equal(subCrowdId, segmentVO.subCrowdId) && Objects
                .equal(calcObjectStatus, segmentVO.calcObjectStatus);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(super.hashCode(), subCrowdName, targetCount, cycleVal, cycleHour, cycleMinute, channelCode, channelType, subCrowdId,
                calcObjectStatus);
    }
}
