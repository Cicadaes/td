package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.EdmReachReport;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_EDM_REACH_REPORT EdmReachReportDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-10-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface EdmReachReportDao extends BaseDao<EdmReachReport> {

    /**
     * Find timeaxis by segment id list.
     *
     * @param segmentId the segment id
     * @return the list
     */
    List<String> findTimeaxisBySegmentId(Integer segmentId);

    /**
     * Find by segment id and date list.
     *
     * @param segmentId      the segment id
     * @param granularity    the granularity
     * @param reportDate     reportDate
     * @return the list
     */
    List<EdmReachReport> findBySegmentIdAndDate(@Param("segmentId") Integer segmentId, @Param("granularity") String granularity, @Param("reportDate") String reportDate );

    /**
     * Batch insert.
     *
     * @param list the list
     */
    void batchInsert(List<EdmReachReport> list);

    /**
     * Insert or update.
     *
     * @param report the report
     */
    void insertOrUpdate(EdmReachReport report);

    /**
     * 通过pipelineId查询投放报告
     * @param pipelineId 活动流程id
     * @param pipelineNodeId 活动流程节点id
     * @param granularity 时间粒度
     * @return 返回报告列表
     */
    List<EdmReachReport> findByPipelineId(@Param("pipelineId")Integer pipelineId, @Param("pipelineNodeId")String pipelineNodeId, @Param("granularity")String granularity);

    /**
     * 通过pipelineId和日期查询投放报告
     * @param pipelineId 活动流程id
     * @param pipelineNodeId 活动流程节点id
     * @param granularity 时间粒度
     * @param reportDate 起始时间
     * @return 返回报告列表
     */
    List<EdmReachReport> findByPipelineIdAndDate(@Param("pipelineId")Integer pipelineId, @Param("pipelineNodeId")String pipelineNodeId, @Param("granularity")String granularity, @Param("reportDate") String reportDate);
}
