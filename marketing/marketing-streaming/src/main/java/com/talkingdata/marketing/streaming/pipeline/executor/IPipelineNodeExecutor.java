package com.talkingdata.marketing.streaming.pipeline.executor;

import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.model.OperatorResult;
import com.talkingdata.marketing.streaming.pipeline.definition.PipelineDiagram;
import com.tendcloud.tenddata.entity.EventPackage;

import java.util.Set;

/**
 * @author Created by tend on 2017/10/18.
 */
public interface IPipelineNodeExecutor {

    /**
     * 执行Pipeline中算子
     *
     * @param pipelineDefinition PipelineDefinition
     * @param pipelineDiagram    PipelineDiagram
     * @param executorNodes      需要执行的算子Set集合
     * @param eventPackage       EventPackage   @return OperatorResult 包含执行完状态和数据
     */
    OperatorResult executeNodes(PipelineDefinition pipelineDefinition, PipelineDiagram pipelineDiagram,
                                Set<AbstractNodeDefinition> executorNodes, EventPackage eventPackage);

}
