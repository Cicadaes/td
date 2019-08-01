package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import com.talkingdata.marketing.core.page.campaign.SegmentTaskCalcObjectRecordPage;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>TD_MKT_SEGMENT_TASK_CALC_OBJECT_RECORD SegmentTaskCalcObjectRecordDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface SegmentTaskCalcObjectRecordDao extends BaseDao<SegmentTaskCalcObjectRecord> {
    /**
     * Query by param list.
     *
     * @param segmentId the segment id
     * @param tp        the tp
     * @param startDate the start date
     * @param endDate   the end date
     * @return the list
     */
    List<SegmentTaskCalcObjectRecord> queryByParam(@Param("segmentId") Integer segmentId,@Param("tp") Integer tp,
                                                   @Param("startDate") Date startDate, @Param("endDate") Date endDate);


    List<SegmentTaskCalcObjectRecord> queryByPage(@Param("page") SegmentTaskCalcObjectRecordPage page,
            @Param("startDate") Date startDate, @Param("endDate") Date endDate);

    /**
     * Query by create time list.
     *
     * @param map the map
     * @return the list
     */
    List<SegmentTaskCalcObjectRecord> queryByCreateTime(Map map);

    /**
     * Select by campaign ids list.
     *
     * @param ids the ids
     * @return the list
     */
    List<SegmentTaskCalcObjectRecord> selectByCampaignIds(List<Integer> ids);

    /**
     * Select by segment ids list.
     *
     * @param ids the ids
     * @return the list
     */
    List<SegmentTaskCalcObjectRecord> selectBySegmentIds(List<Integer> ids);

    /**
     * Select by pipeline ids list.
     *
     * @param pipelineId 活动流程id
     * @param pipelineNodeId 活动流程节点id
     * @return the list
     */
    List<SegmentTaskCalcObjectRecord> selectByPipelineId(@Param("pipelineId")Integer pipelineId, @Param("pipelineNodeId")String pipelineNodeId);

    /**
     * Gets today already calc record.
     *
     * @param date the date
     * @return the today already calc record
     */
    List<SegmentTaskCalcObjectRecord> getTodayAlreadyCalcRecord(@Param("date") Date date);

    /**
     * Query by status and type list.
     *
     * @param statusList the status list
     * @param tp         the tp
     * @return the list
     */
    List<SegmentTaskCalcObjectRecord> queryByStatusAndType(@Param("statusList") List<Integer> statusList, @Param("tp") Integer tp);

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);

    /**
     * Query by segment id list.
     *
     * @param segmentId the segment id
     * @return the list
     */
    List<SegmentTaskCalcObjectRecord> queryBySegmentId(Integer segmentId);
}
