package com.talkingdata.marketing.core.entity.campaign.definition.node;

import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;

/**
 * 组件-人群生成
 *
 * @author armeng
 * @create 2017 -08-16-下午7:14
 * @since JDK 1.8
 */
public class GenerateCrowdNodeDefinition extends AbstractNodeDefinition {
    /**
     * 采集开始时间
     */
    private Long acquisitionStartTime;
    /**
     * 采集结束时间
     */
    private Long acquisitionEndTime;
    /**
     * 行为路径描述
     */
    private Integer behaviorPathDescription;

    /**
     * Gets acquisition start time.
     *
     * @return the acquisition start time
     */
    public Long getAcquisitionStartTime() {
        return acquisitionStartTime;
    }

    /**
     * Sets acquisition start time.
     *
     * @param acquisitionStartTime the acquisition start time
     */
    public void setAcquisitionStartTime(Long acquisitionStartTime) {
        this.acquisitionStartTime = acquisitionStartTime;
    }

    /**
     * Gets acquisition end time.
     *
     * @return the acquisition end time
     */
    public Long getAcquisitionEndTime() {
        return acquisitionEndTime;
    }

    /**
     * Sets acquisition end time.
     *
     * @param acquisitionEndTime the acquisition end time
     */
    public void setAcquisitionEndTime(Long acquisitionEndTime) {
        this.acquisitionEndTime = acquisitionEndTime;
    }

    /**
     * Gets behavior path description.
     *
     * @return the behavior path description
     */
    public Integer getBehaviorPathDescription() {
        return behaviorPathDescription;
    }

    /**
     * Sets behavior path description.
     *
     * @param behaviorPathDescription the behavior path description
     */
    public void setBehaviorPathDescription(Integer behaviorPathDescription) {
        this.behaviorPathDescription = behaviorPathDescription;
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("GenerateCrowdNodeDefinition{");
        sb.append("acquisitionStartTime=").append(acquisitionStartTime);
        sb.append(", acquisitionEndTime=").append(acquisitionEndTime);
        sb.append(", behaviorPathDescription=").append(behaviorPathDescription);
        sb.append(", AbstractNodeDefinition=").append(super.toString());
        sb.append('}');
        return sb.toString();
    }
}