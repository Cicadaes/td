package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.EquityConfig;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_EQUITY_CONFIG EquityConfigDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-08-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Component
public interface EquityConfigDao extends BaseDao<EquityConfig> {

    /**
     * Find by campaign id list.
     *
     * @param campaignId the campaign id
     * @return the list
     */
    List<EquityConfig> findByCampaignId(Integer campaignId);

    /**
     * 该营销活动内，权益名称为equityConfigName 或者 attachmentName为attachmentName的记录
     *
     * @param equityConfigName the equity config name
     * @param attachmentName   the attachment name
     * @param campaignId       the campaign id
     * @return list
     */
    List<EquityConfig> findByName(@Param("equityConfigName") String equityConfigName,@Param("attachmentName") String attachmentName, @Param("campaignId") Integer campaignId);
}
