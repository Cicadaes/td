package com.talkingdata.marketing.batch.dao;

import com.talkingdata.marketing.batch.bean.BatchProcessDetail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author Created by tend on 2017/11/8.
 */
@Component
public class BatchProcessDetailDao {
    private static final Logger logger = LoggerFactory.getLogger(BatchProcessDetailDao.class);
    /**
     * 最近一次处理的状态
     */
    public static final Integer RECENTLY_BATCH_STATUS = 1;
    /**
     * 以前处理的状态
     */
    private static final Integer BEFORE_BATCH_STATUS = 0;
    /**
     * 计算状态 -1: 失败
     */
    private static final Integer FAIL_CALC_STATUS = -1;
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
    private static final Integer COMPLETE_CALC_STATUS = 2;


    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 查询最近一次的batch process detail
     *
     * @return BatchProcessDetail
     */
    public BatchProcessDetail recentlyBatchProcess() {
        String sql = "select * from TD_MKT_BATCH_PROCESS_DETAIL where status = ? order by end_time desc";
        List<BatchProcessDetail> processDetails = jdbcTemplate.query(sql, new Object[]{RECENTLY_BATCH_STATUS},
                new BeanPropertyRowMapper<>(BatchProcessDetail.class));
        if (processDetails == null || processDetails.isEmpty()) {
            return null;
        }
        if (processDetails.size() > 1) {
            logger.warn("td_mkt_batch_process_detail status = {}, more than two");
        }
        return processDetails.get(0);
    }

    /**
     * 插入BatchProcessDetail
     *
     * @param detail BatchProcessDetail
     */
    public void saveBatchProcess(BatchProcessDetail detail) {
        String sql = "insert into TD_MKT_BATCH_PROCESS_DETAIL " +
                "(status,calc_status,es_scroll_offset,start_time,end_time,error_file_path,error_info,tenant_id,creator," +
                "create_by,create_time,updater,update_by,update_time) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        jdbcTemplate.update(sql, detail.getStatus(), WAIT_CALC_STATUS, detail.getEsScrollOffset(), detail.getStartTime(),
                detail.getEndTime(), detail.getErrorFilePath(), detail.getErrorInfo(), detail.getTenantId(), detail.getCreator(),
                detail.getCreateBy(), detail.getCreateTime(), detail.getUpdater(), detail.getUpdateBy(), detail.getUpdateTime());
    }

    /**
     * 将指定id的status更新为0即过去的时间
     *
     * @param id BatchProcessDetail id
     */
    public void updateBeforeStatusById(Long id) {
        String sql = "update TD_MKT_BATCH_PROCESS_DETAIL set status = ?, calc_status = ? where id = ?";
        jdbcTemplate.update(sql, BEFORE_BATCH_STATUS, COMPLETE_CALC_STATUS, id);
    }

    /**
     * 将指定id的计算状态更新为计算中
     *
     * @param id BatchProcessDetail id
     */
    public void updateProcessingCalcStatusById(Long id, Integer calcStatus) {
        String sql = "update TD_MKT_BATCH_PROCESS_DETAIL set calc_status = ? where id = ?";
        jdbcTemplate.update(sql, calcStatus, id);
    }

    /**
     * 更新指定id的es scroll offset
     *
     * @param id     BatchProcessDetail id
     * @param offset offset
     */
    public void updateEsScrollOffsetById(Long id, Integer offset) {
        String sql = "update TD_MKT_BATCH_PROCESS_DETAIL set es_scroll_offset = ? where id = ?";
        jdbcTemplate.update(sql, offset, id);
    }

}
