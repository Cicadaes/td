package com.talkingdata.marketing.streaming.pipeline.definition.node;

import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;

/**
 * 组件-人群生成
 *
 * @create 2017-08-16-下午7:14
 * @since JDK 1.8
 * @author sheng.hong
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

    public Long getAcquisitionStartTime() {
        return acquisitionStartTime;
    }

    public void setAcquisitionStartTime(Long acquisitionStartTime) {
        this.acquisitionStartTime = acquisitionStartTime;
    }

    public Long getAcquisitionEndTime() {
        return acquisitionEndTime;
    }

    public void setAcquisitionEndTime(Long acquisitionEndTime) {
        this.acquisitionEndTime = acquisitionEndTime;
    }

    public Integer getBehaviorPathDescription() {
        return behaviorPathDescription;
    }

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