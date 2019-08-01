package com.talkingdata.marketing.core.dao.admin;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.admin.FunnelIndexDefinition;

/**
 * <br>
 * <b>功能：</b>TD_MKT_FUNNEL_INDEX_DEFINITION FunnelIndexDefinitionDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-05-02 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface FunnelIndexDefinitionDao extends BaseDao<FunnelIndexDefinition> {

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);

}
