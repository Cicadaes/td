package com.talkingdata.marketing.streaming.pipeline.executor;

import com.talkingdata.marketing.streaming.model.ExecutorResultData;
import com.tendcloud.tenddata.entity.EventPackage;

import java.util.List;

/**
 * @author sheng.hong
 */
public interface IPipelineExecutor {

    /**
     * Pipeline执行
     * @param eventPackage
     */
    List<ExecutorResultData> executor(EventPackage eventPackage);

    /**
     * 全局规则校验
     * @param data
     * @return boolean
     */
    boolean validator(EventPackage data);

}
