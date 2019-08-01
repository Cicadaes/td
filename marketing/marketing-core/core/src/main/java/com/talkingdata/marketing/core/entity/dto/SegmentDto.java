package com.talkingdata.marketing.core.entity.dto;

import com.talkingdata.marketing.core.entity.campaign.Segment;
import java.util.Date;

/**
 * The type Segment dto.
 * @author xiaoming.kang
 */
public class SegmentDto extends Segment {
    private Date startTime;
    private Date endTime;

    /**
     * Gets start time.
     *
     * @return the start time
     */
    public Date getStartTime() {
        return startTime;
    }

    /**
     * Sets start time.
     *
     * @param startTime the start time
     */
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    /**
     * Gets end time.
     *
     * @return the end time
     */
    public Date getEndTime() {
        return endTime;
    }

    /**
     * Sets end time.
     *
     * @param endTime the end time
     */
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }
}
