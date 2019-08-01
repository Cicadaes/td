package com.talkingdata.marketing.streaming.dao;

import com.talkingdata.marketing.streaming.model.PipelineMonitor;
import com.talkingdata.marketing.streaming.util.DateUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.support.DataAccessUtils;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Steaming Dao
 *
 * @author Created by tend on 2017/10/16.
 */
@Component
public class StreamingDao {

    private static final Logger logger = LoggerFactory.getLogger(StreamingDao.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void updatePipelineInstanceStatusById(Integer pipelineInstanceId, Integer status) {
        String sql = "UPDATE TD_MKT_PIPELINE_INSTANCE SET STATUS = ? WHERE id = ?";
        int update = jdbcTemplate.update(sql, status, pipelineInstanceId);
        if (update == 0) {
            logger.warn("update TD_MKT_PIPELINE_INSTANCE pipelineInstanceId: {} status to {} failed");
        }
    }

    public void updatePipelineDefStatusById(Integer pipelineDefId, Integer status) {
        String sql = "UPDATE TD_MKT_PIPELINE_DEFINITION SET STATUS = ? WHERE id = ?";
        int update = jdbcTemplate.update(sql, status, pipelineDefId);
        if (update == 0) {
            logger.warn("update TD_MKT_PIPELINE_DEFINITION pipelineInstanceId: {} status to {} failed");
        }
    }

    public PipelineMonitor selectForUpdateMonitorByUnidx(PipelineMonitor monitor) {
        String sql = "SELECT * from TD_MKT_PIPELINE_MONITOR " +
                "where campaign_id=? and pipeline_id=? and pipeline_node_id=? and pipeline_version=? and monitor_type=? " +
                "for update ";
        List<PipelineMonitor> monitors = jdbcTemplate.query(sql, new Object[]{monitor.getCampaignId(), monitor.getPipelineId(), monitor.getPipelineNodeId(),
                monitor.getPipelineVersion(), monitor.getMonitorType()}, new BeanPropertyRowMapper<>(PipelineMonitor.class));
        return DataAccessUtils.uniqueResult(monitors);
    }

    public void insetMonitor(PipelineMonitor monitor) {
        String sql = "insert into TD_MKT_PIPELINE_MONITOR(" +
                "campaign_id,pipeline_id,pipeline_node_id,pipeline_version,monitor_type,metric_value,create_time,creator) " +
                "values (?, ?, ?, ?, ?, ?, ?, ?)";
        int insert = jdbcTemplate.update(sql, monitor.getCampaignId(), monitor.getPipelineId(), monitor.getPipelineNodeId(),
                monitor.getPipelineVersion(), monitor.getMonitorType(), monitor.getMetricValue(),
                DateUtil.format(System.currentTimeMillis(), DateUtil.dtf_y4mmdd_hhmmss), "streaming");
        if (insert == 0) {
            logger.error("inset TD_MKT_PIPELINE_MONITOR campaignId: {}, pipelineId: {}, pipelineNodeId: {}, version: {}," +
                            "monitorType: {}, metricValue: {} failed", monitor.getCampaignId(), monitor.getPipelineId(), monitor.getPipelineNodeId(),
                    monitor.getPipelineVersion(), monitor.getMonitorType(), monitor.getMetricValue());
        }
    }

    public void updateMonitorById(PipelineMonitor monitor) {
        String sql = "update TD_MKT_PIPELINE_MONITOR set metric_value=?,updater=?,update_time=? where id=?";
        int update = jdbcTemplate.update(sql, monitor.getMetricValue(), "streaming",
                DateUtil.format(System.currentTimeMillis(), DateUtil.dtf_y4mmdd_hhmmss), monitor.getId());
        if (update == 0) {
            logger.error("update TD_MKT_PIPELINE_MONITOR id: {}, metricValue to {} failed", monitor.getId(), monitor.getMetricValue());
        }
    }

}
