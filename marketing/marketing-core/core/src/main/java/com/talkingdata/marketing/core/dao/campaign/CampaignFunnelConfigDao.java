package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.CampaignFunnelConfig;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CAMPAIGN_FUNNEL_CONFIG CampaignFunnelConfigDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface CampaignFunnelConfigDao extends BaseDao<CampaignFunnelConfig> {

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);

    /**
     * Select by primary keys list.
     *
     * @param param the param
     * @return the list
     */
    List<CampaignFunnelConfig> selectByPrimaryKeys(List<Integer> param);

    /**
     * Find by campaign id list.
     *
     * @param campaignId the campaign id
     * @return the list
     */
    List<CampaignFunnelConfig> findByCampaignId(Integer campaignId);
}
