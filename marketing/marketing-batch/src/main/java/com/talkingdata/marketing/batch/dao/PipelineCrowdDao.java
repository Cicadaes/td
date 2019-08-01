package com.talkingdata.marketing.batch.dao;

import com.talkingdata.marketing.batch.bean.CrowdDTO;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author Created by tend on 2017/11/21.
 */
@Component
public class PipelineCrowdDao {
    private static final Logger logger = LoggerFactory.getLogger(PipelineCrowdDao.class);

    /**
     * 计算状态 -1: 失败
     */
    public static final Integer FAIL_CALC_STATUS = -1;
    /**
     * 计算状态 0: 未开始
     */
    public static final Integer WAIT_CALC_STATUS = 0;
    /**
     * 计算状态 1: 计算中
     */
    public static final Integer PROCESSING_CALC_STATUS = 1;
    /**
     * 计算状态 2: 已完成
     */
    public static final Integer COMPLETE_CALC_STATUS = 2;

    /**
     * 计算类型 1: 永不
     */
    public static final Integer CALC_TYPE_NEVER = 1;

    /**
     * 计算类型 2:实时
     */
    public static final Integer CALC_TYPE_RUNTIME = 2;
    /**
     * 计算类型 3: 周期
     */
    public static final Integer CALC_TYPE_PERIOD = 3;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 查询需要计算的Pipeline的人群
     *
     * @return crowds
     */
    public List <Crowd> queryPipelineCrowds() {
        String sql = "SELECT DISTINCT c.* FROM TD_MKT_CROWD c JOIN TD_MKT_PIPELINE_CROWD_REL pc ON c.`id` = pc.`crowd_id` WHERE pc.`calc_status` = ? or pc.`calc_status` = ?";
        List<Crowd> crowds = jdbcTemplate.query(sql, new Object[]{FAIL_CALC_STATUS, WAIT_CALC_STATUS},
                new BeanPropertyRowMapper<>(Crowd.class));
        if (crowds == null || crowds.isEmpty()) {
            return null;
        }
        return crowds;
    }

    /**
     * 查询需要周期计算的Pipeline的人群
     *
     * @return crowdDTOs
     */
    public List <CrowdDTO> queryTodoPipelineCrowds() {
        String sql = "SELECT DISTINCT pc.`campaign_id` as campaignId, pc.`pipeline_id` as pipelineId, c.`id` as crowdId, " +
                " c.`ref_id` as refId, pc.`calc_period` as calcPeriod, " +
                " pc.`calc_time` as calcTime, pc.`calc_type` as calcType " +
                " FROM TD_MKT_CROWD c JOIN TD_MKT_PIPELINE_CROWD_REL pc " +
                " ON c.`id` = pc.`crowd_id` WHERE (pc.`calc_status` = ? OR pc.`calc_status` = ?) " +
                " AND (pc.`calc_type` = ? OR pc.`calc_type` = ?)";
        List<CrowdDTO> crowdDTOs = jdbcTemplate.query(sql, new Object[]{FAIL_CALC_STATUS, WAIT_CALC_STATUS, CALC_TYPE_PERIOD, CALC_TYPE_NEVER},
                new BeanPropertyRowMapper<>(CrowdDTO.class));
        if (crowdDTOs == null || crowdDTOs.isEmpty()) {
            return null;
        }
        return crowdDTOs;
    }

    /**
     * 更新PipelineCrowdRel状态
     *
     * @param pipelienId
     * @param crowdRefId
     * @param calcStatus
     */
    public void updatePipelineCrowdRelByCrowdId(String pipelienId, String crowdRefId, Integer calcStatus) {
        String sql = "update TD_MKT_PIPELINE_CROWD_REL set calc_status = ? where pipeline_id = ? and crowd_ref_id = ? ";
        jdbcTemplate.update(sql, calcStatus, pipelienId, crowdRefId);
    }

    /**
     * 通过pipelienId获取CampaignId
     *
     * @param pipelienId
     * @return
     */
    public String getCampaignIdByPipelienId(String pipelienId) {
        String sql = "select campaign_id from TD_MKT_PIPELINE_DEFINITION where id = ? limit 1 ";
        List <String> query = jdbcTemplate.query(sql, new Object[]{pipelienId}, new BeanPropertyRowMapper <>(String.class));
        String campaignId = null;
        if(query!=null && query.size()>0){
            campaignId = query.get(0);
        }
        return campaignId;
    }
}
