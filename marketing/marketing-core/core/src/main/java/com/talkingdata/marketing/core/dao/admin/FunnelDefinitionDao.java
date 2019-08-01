package com.talkingdata.marketing.core.dao.admin;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.admin.FunnelDefinition;

/**
 * <br>
 * <b>功能：</b>TD_MKT_FUNNEL_DEFINITION FunnelDefinitionDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface FunnelDefinitionDao extends BaseDao<FunnelDefinition> {

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);

}
