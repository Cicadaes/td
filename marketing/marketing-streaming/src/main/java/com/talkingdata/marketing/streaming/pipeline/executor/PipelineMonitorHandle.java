package com.talkingdata.marketing.streaming.pipeline.executor;

import com.talkingdata.marketing.streaming.MktAccumulatorV2;
import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.model.PipelineMonitor;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import org.springframework.stereotype.Component;

/**
 * @author tingwen.liu
 * @create 2018-03-08
 * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
 */
@Component
class PipelineMonitorHandle {

    /**
     * 监控类型-节点人数监控
     */
    private static final Integer MONITOR_TYPE_EP_COUNT = 1;

    private MktAccumulatorV2 mktAcc;

    void accumulator(PipelineDefinition pipelineDef, AbstractNodeDefinition nodeDef) {
        PipelineMonitor pipelineMonitor = new PipelineMonitor();
        pipelineMonitor.setCampaignId(pipelineDef.getCampaignId());
        pipelineMonitor.setPipelineId(pipelineDef.getId());
        pipelineMonitor.setPipelineVersion(pipelineDef.getVersion());
        pipelineMonitor.setPipelineNodeId(nodeDef.getId());
        pipelineMonitor.setMonitorType(MONITOR_TYPE_EP_COUNT);
        pipelineMonitor.setMetricValue(1L);
        String key = String.format("%s_%s_%s_%s_%s", pipelineDef.getCampaignId(), pipelineDef.getId(), pipelineDef.getVersion(), nodeDef.getId(), MONITOR_TYPE_EP_COUNT);
        pipelineMonitor.setUniqueKey(key);
        mktAcc.add(pipelineMonitor);
    }

    void setMktAcc(MktAccumulatorV2 mktAcc) {
        this.mktAcc = mktAcc;
    }
}
