package com.talkingdata.marketing.core.dao.admin;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.admin.FunnelStepConditionDefinition;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_FUNNEL_STEP_CONDITION_DEFINITION FunnelStepConditionDefinitionDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface FunnelStepConditionDefinitionDao extends BaseDao<FunnelStepConditionDefinition> {

    /**
     * Insert batch int.
     *
     * @param funnelStepConditionDefinitions the funnel step condition definitions
     * @return the int
     */
    int insertBatch(List<FunnelStepConditionDefinition> funnelStepConditionDefinitions);

    /**
     * Select by ids list.
     *
     * @param ids the ids
     * @return the list
     */
    List<FunnelStepConditionDefinition> selectByIds(List ids);

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);

}
