package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.SmsReachReport;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_SMS_REACH_REPORT SmsReachReportDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-10-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface SmsReachReportDao extends BaseDao<SmsReachReport> {

    /**
     * Find timeaxis by segment id.
     *
     * @param segmentId the segment id
     * @return the list
     */
    List<String> findTimeaxisBySegmentId(Integer segmentId);

    /**
     * 通过pipelineId获取时间轴
     * @param pipelineId 活动流程id
     * @param pipelineNodeId 活动流程节点id
     * @return 时间轴
     */
    List<String> findTimeaxisByPipelineId(@Param("pipelineId")Integer pipelineId, @Param("pipelineNodeId")String pipelineNodeId);

    /**
     * Find by segment id and date list.
     *
     * @param segmentId      the segment id
     * @param granularity    the granularity
     * @param startTimeInDay the start time in day
     * @param endTimeInDay   the end time in day
     * @return the list
     */
    List<SmsReachReport> findBySegmentIdAndDate(@Param("segmentId")Integer segmentId, @Param("granularity")String granularity, @Param("startTimeInDay") Date startTimeInDay, @Param("endTimeInDay")Date endTimeInDay);

    /**
     * 通过pipelineId查询投放报告
     * @param pipelineId 活动流程id
     * @param pipelineNodeId 活动流程节点id
     * @param granularity 时间粒度
     * @return 返回报告列表
     */
    List<SmsReachReport> findByPipelineId(@Param("pipelineId")Integer pipelineId, @Param("pipelineNodeId")String pipelineNodeId, @Param("granularity")String granularity);

    /**
     * 通过pipelineId和日期查询投放报告
     * @param pipelineId 活动流程id
     * @param pipelineNodeId 活动流程节点id
     * @param granularity 时间粒度
     * @param reportDate 起始时间
     * @return 返回报告列表
     */
    List<SmsReachReport> findByPipelineIdAndDate(@Param("pipelineId")Integer pipelineId, @Param("pipelineNodeId")String pipelineNodeId, @Param("granularity")String granularity, @Param("reportDate") String reportDate);

    /**
     * 通过segmentId获取投放报告列表
     * @param segmentId 投放id
     * @param granularity 时间粒度
     * @param reportDate 查询日期
     * @return 投放报告列表
     */
    List<SmsReachReport> findBySegmentIdAndDate(@Param("segmentId")Integer segmentId, @Param("granularity")String granularity, @Param("reportDate")String reportDate);

    /**
     * 通过segmentId获取投放报告列表
     * @param segmentId 投放id
     * @param granularity 时间粒度
     * @return 投放报告列表
     */
    List<SmsReachReport> findBySegmentId(@Param("segmentId")Integer segmentId, @Param("granularity")String granularity);

    /**
     * Insert or update.
     *
     * @param smsReachReport the sms reach report
     */
    void insertOrUpdate(SmsReachReport smsReachReport);

    /**
     * Batch insert.
     *
     * @param list the list
     */
    void batchInsert(List<SmsReachReport> list);


}
