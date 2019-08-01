package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.PushReachReport;
import com.talkingdata.marketing.core.entity.dto.CalcObjectResult;
import com.talkingdata.marketing.core.page.campaign.PushReachReportPage;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_PUSH_REACH_REPORT PushReachReportDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-02-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface PushReachReportDao extends BaseDao<PushReachReport> {
    /**
     * 根据创建时间来删除
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);

    /**
     * 通过投放ID和时间查询推送报告.
     * @param segmentId the segment id
     * @return the metric value by segment id
     */
    List<CalcObjectResult> getMetricValueBySegmentId(Integer segmentId);
    /**
     * 根据投放ID获取当日的投放结果
     *
     * @param segmentId the segment id
     * @param tp        the tp
     * @return the day metric value by segment id
     */
    List<CalcObjectResult> getDayMetricValueBySegmentId(@Param("segmentId") Integer segmentId, @Param("tp") String tp);

    /**
     * 插入或更新推送报告.
     *
     * @param pushReachReport 推送报告
     */
    void insertOrUpdate(PushReachReport pushReachReport);

    /**
     * 批量插入.
     *
     * @param list 推送报告列表
     */
    void batchInsert(List<PushReachReport> list);

    /**
     * 通过pipelineId和日期获得投放报告
     * @param pipelineId 活动流程ID
     * @param pipelineNodeId 活动流程节点ID
     * @param reportDate 起始时间
     */
    List<PushReachReport> findByPipelineIdAndDate(@Param("pipelineId") Integer pipelineId, @Param("pipelineNodeId") String pipelineNodeId, @Param("reportDate") String reportDate);

    /**
     * 通过pipelineId获得投放报告
     * @param pipelineId 活动流程ID
     * @param pipelineNodeId 活动流程节点ID
     */
    List<PushReachReport> findByPipelineId(@Param("pipelineId") Integer pipelineId, @Param("pipelineNodeId") String pipelineNodeId);

    /**
     * 通过pipelineId和日期获得投放报告趋势
     * @param pipelineId 活动流程ID
     * @param pipelineNodeId 活动流程节点ID
     */
    List<PushReachReport> findTrendByPipelineId(@Param("pipelineId") Integer pipelineId, @Param("pipelineNodeId") String pipelineNodeId);

    /**
     * 通过segmentId和日期获得投放报告趋势
     * @param segmentId 活动流程ID
     */
    List<PushReachReport> findTrendBySegmentId(@Param("segmentId") Integer segmentId);

    /**
     * 通过segmentId和日期获得投放报告趋势
     * @param page 活动流程page
     */
    List<PushReachReport> findTrendByPage(PushReachReportPage page);
}
