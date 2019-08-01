package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.CampaignLaunchUnit;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CAMPAIGN_LAUNCH_UNIT CampaignLaunchUnitDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Component
public interface CampaignLaunchUnitDao extends BaseDao<CampaignLaunchUnit> {

    /**
     * Reset crowd version.
     *
     * @param unitIdList the unit id list
     */
    void resetCrowdVersion(List<Integer> unitIdList);

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);

    /**
     * Update in calc unit by crowd id.
     *
     * @param campaignLaunchUnit the campaign launch unit
     * @param crowdId            the crowd id
     */
    void updateInCalcUnitByCrowdId(@Param("campaignLaunchUnit") CampaignLaunchUnit campaignLaunchUnit,
                                   @Param("crowdId") Integer crowdId);

    /**
     * Find by campaign id list.
     *
     * @param campaignId the campaign id
     * @return the list
     */
    List<CampaignLaunchUnit> findByCampaignId(@Param("campaignId")Integer campaignId);
}
