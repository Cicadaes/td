package com.talkingdata.marketing.streaming.pipeline.executor;


import com.talkingdata.marketing.streaming.model.ExecutorResultData;
import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.tendcloud.tenddata.entity.EventPackage;

import java.util.List;

/**
 * @author Created by yangtao on 2017/9/18.
 */
public interface IPipelineStageExecutor {

    /**
     * 执行stage
     *
     * @param definition   PipelineDefinition
     * @param eventPackage EventPackage
     */
    List<ExecutorResultData> executor(PipelineDefinition definition, EventPackage eventPackage);

}
