package com.talkingdata.marketing.streaming.service;

import com.talkingdata.marketing.streaming.dao.StreamingDao;
import com.talkingdata.marketing.streaming.model.PipelineMonitor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * @author tingwen.liu
 * @create 2018-03-12
 * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
 */
@Service
@Transactional(rollbackFor = Throwable.class)
public class StreamingService {

    @Autowired
    private StreamingDao dao;

    public void saveMonitor(Map<String, PipelineMonitor> monitorMap) {
        for (Map.Entry<String, PipelineMonitor> entry : monitorMap.entrySet()) {
            PipelineMonitor monitor = entry.getValue();
            PipelineMonitor dbMonitor = dao.selectForUpdateMonitorByUnidx(monitor);
            if (dbMonitor == null) {
                dao.insetMonitor(monitor);
            } else {
                dbMonitor.setMetricValue(dbMonitor.getMetricValue() + monitor.getMetricValue());
                dao.updateMonitorById(dbMonitor);
            }
        }
    }

}
