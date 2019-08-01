package com.talkingdata.marketing.core.entity.dto;

import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.definition.PipelineDebugParam;

/**
 * @author Created by tend on 2018/1/9.
 * @author xiaoming.kang
 */
public class PipelineDebugParamDto extends PipelineDebugParam {
    private Crowd debugCrowd;

    public Crowd getDebugCrowd() {
        return debugCrowd;
    }

    public void setDebugCrowd(Crowd debugCrowd) {
        this.debugCrowd = debugCrowd;
    }

    @Override
    public String toString() {
        return "PipelineDebugParamDto{" +
                "debugCrowd=" + debugCrowd +
                '}';
    }
}
