package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.dto.SegmentDto;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>TD_MKT_SEGMENT SegmentDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Component
public interface SegmentDao extends BaseDao<Segment> {
    /**
     * Query by status list.
     *
     * @param map the map
     * @return the list
     */
    List<SegmentDto> queryByStatus(Map map);

    /**
     * 根据SegmentId查询Dto
     * @param segmentId
     * @return
     */
    SegmentDto queryBySegmentId(Integer segmentId);


    /**
     * Query by ids list.
     *
     * @param ids the ids
     * @return the list
     */
    List<Segment> queryByIds(@Param("ids") List<Integer> ids);

    /**
     * Gets count by name.
     *
     * @param name the name
     * @return the count by name
     */
    Integer getCountByName(String name);

    /**
     * Find by status and campaign list.
     *
     * @param campaignId the campaign id
     * @param status     the status
     * @return the list
     */
    List<Segment> findByStatusAndCampaign(@Param("campaignId") Integer campaignId,
                                          @Param("statusList") List<Integer> status);

    /**
     * Gets segment by status and campaign.
     *
     * @param status          the status
     * @param crowdUpdateType the crowd update type
     * @return the segment by status and campaign
     */
    List<Segment> getSegmentByStatusAndCampaign(@Param("statusList") List<Integer> status,
                                                @Param("crowdUpdateType") Integer crowdUpdateType);

    /**
     * Query by status list list.
     *
     * @param statusList the status list
     * @return the list
     */
    List<Segment> queryByStatusList(@Param("statusList") List<Integer> statusList);

    /**
     * Update status by unit id.
     *
     * @param unitId the unit id
     * @param status the status
     */
    void updateStatusByUnitId(@Param("unitId") Integer unitId, @Param("status") Integer status);

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);

    /**
     * Update crowd version.
     *
     * @param segmentIdList the segment id list
     * @param crowdVersion  the crowd version
     */
    void updateCrowdVersion(@Param("segmentIdList") List<Integer> segmentIdList, @Param("crowdVersion") String crowdVersion);

    /**
     * Query by status and update type list.
     *
     * @param statusList      the status list
     * @param crowdUpdateType the crowd update type
     * @return the list
     */
    List<Segment> queryByStatusAndUpdateType(@Param("statusList") List<Integer> statusList, @Param("crowdUpdateType") Integer crowdUpdateType);

    /**
     * Find by campaign launch unit id list.
     *
     * @param campaignLaunchUnitId the campaign launch unit id
     * @return the list
     */
    List<Segment> findByCampaignLaunchUnitId(@Param("campaignLaunchUnitId") Integer campaignLaunchUnitId);
}
