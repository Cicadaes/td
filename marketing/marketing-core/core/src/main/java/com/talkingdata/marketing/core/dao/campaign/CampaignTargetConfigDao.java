package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.CampaignTargetConfig;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CAMPAIGN_TARGET_CONFIG CampaignTargetConfigDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Component
public interface CampaignTargetConfigDao extends BaseDao<CampaignTargetConfig> {

    /**
     * Insert or update integer.
     *
     * @param campaignTargetConfig the campaign target config
     * @return the integer
     */
    Integer insertOrUpdate(CampaignTargetConfig campaignTargetConfig);

    /**
     * Delete by unique index.
     *
     * @param campaignId         the campaign id
     * @param targetDefinitionId the target definition id
     * @param metricType         the metric type
     */
    void deleteByUniqueIndex(@Param("campaignId") Integer campaignId, @Param("targetDefinitionId")
            Integer targetDefinitionId, @Param("metricType") Integer metricType);

    /**
     * Gets by campaign ids.
     *
     * @param campaignIds the campaign ids
     * @return the by campaign ids
     */
    List<CampaignTargetConfig> getByCampaignIds(List<Integer> campaignIds);

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);
}
