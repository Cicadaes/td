package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CAMPAIGN CampaignDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Component
public interface CampaignDao extends BaseDao<Campaign> {
    /**
     * Find by status and time range list.
     *
     * @param map the map
     * @return the list
     */
    List<Campaign> findByStatusAndTimeRange(Map<String,Object> map);

    /**
     * Count by status and time range int.
     *
     * @param hashMap the hash map
     * @return the int
     */
    int countByStatusAndTimeRange(Map<String, Object> hashMap);

    /**
     * Select by ids list.
     *
     * @param ids the ids
     * @return the list
     */
    List<Campaign> selectByIds(List<Integer> ids);

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);

    /**
     * Find by start time list.
     *
     * @param starDate the star date
     * @param endDate  the end date
     * @return the list
     */
    List<Campaign> findByStartTime(@Param("starDate")Date starDate, @Param("endDate")Date endDate, @Param("tenantId")String tenantId);

    /**
     * Gets campaign by equity config id.
     *
     * @param equityConfigId the equity config id
     * @return the campaign by equity config id
     */
    Campaign getCampaignByEquityConfigId(Integer equityConfigId);
}
