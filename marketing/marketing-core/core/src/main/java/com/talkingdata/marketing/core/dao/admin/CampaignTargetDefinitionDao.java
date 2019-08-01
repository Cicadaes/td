package com.talkingdata.marketing.core.dao.admin;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.admin.CampaignTargetDefinition;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CAMPAIGN_TARGET_DEFINITION CampaignTargetDefinitionDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface CampaignTargetDefinitionDao extends BaseDao<CampaignTargetDefinition> {
    /**
     * Select by ids list.
     *
     * @param ids the ids
     * @return the list
     */
    List<CampaignTargetDefinition> selectByIds(@Param("ids") List<Integer> ids);

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);

}
