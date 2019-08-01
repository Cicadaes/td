package com.talkingdata.marketing.core.dao.admin;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.admin.EffectIndexDefinition;

/**
 * <br>
 * <b>功能：</b>TD_MKT_EFFECT_INDEX_DEFINITION EffectIndexDefinitionDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-05-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface EffectIndexDefinitionDao extends BaseDao<EffectIndexDefinition> {

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);
}
