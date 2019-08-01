package com.talkingdata.marketing.core.entity.campaign.definition;

/**
 * Pipeline调试参数
 * @author tao.yang
 */
public class PipelineDebugParam {
    private Integer debugCrowdId;
    private boolean skipEntrance;
    private boolean skipSplit;
    private boolean skipTrigger;
    private boolean skipHourMeter;
    private boolean skipFilter;

    public Integer getDebugCrowdId() {
        return debugCrowdId;
    }

    public void setDebugCrowdId(Integer debugCrowdId) {
        this.debugCrowdId = debugCrowdId;
    }

    public boolean isSkipEntrance() {
        return skipEntrance;
    }

    public void setSkipEntrance(boolean skipEntrance) {
        this.skipEntrance = skipEntrance;
    }

    public boolean isSkipSplit() {
        return skipSplit;
    }

    public void setSkipSplit(boolean skipSplit) {
        this.skipSplit = skipSplit;
    }

    public boolean isSkipTrigger() {
        return skipTrigger;
    }

    public void setSkipTrigger(boolean skipTrigger) {
        this.skipTrigger = skipTrigger;
    }

    public boolean isSkipHourMeter() {
        return skipHourMeter;
    }

    public void setSkipHourMeter(boolean skipHourMeter) {
        this.skipHourMeter = skipHourMeter;
    }

    public boolean isSkipFilter() {
        return skipFilter;
    }

    public void setSkipFilter(boolean skipFilter) {
        this.skipFilter = skipFilter;
    }

    @Override
    public String toString() {
        return "PipelineDebugParam{" +
                "debugCrowdId=" + debugCrowdId +
                ", skipEntrance=" + skipEntrance +
                ", skipSplit=" + skipSplit +
                ", skipTrigger=" + skipTrigger +
                ", skipHourMeter=" + skipHourMeter +
                ", skipFilter=" + skipFilter +
                '}';
    }
}
