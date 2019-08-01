package com.talkingdata.marketing.core.entity.dto;

import com.talkingdata.marketing.core.entity.campaign.PipelineMonitor;
import org.stringtemplate.v4.ST;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author chunyan.ji
 * @create 2018-03-08
 * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
 * @since JDK 1.8
 */
public class PipelineMonitorDto {
    private Map<String, Long> pipelineMonitorMap = new HashMap<>(16);

    public PipelineMonitorDto() {}

    public PipelineMonitorDto(List<PipelineMonitor> pipelineMonitorList) {
        for (PipelineMonitor pipelineMonitor:pipelineMonitorList){
            this.pipelineMonitorMap.put(pipelineMonitor.getPipelineNodeId(), pipelineMonitor.getMetricValue());
        }
    }

    public Map<String, Long> getPipelineMonitorMap() {return this.pipelineMonitorMap;}

    public void setPipelineMonitorMap(Map<String, Long> pipelineMonitorMap) {
        this.pipelineMonitorMap = pipelineMonitorMap;
    }
}