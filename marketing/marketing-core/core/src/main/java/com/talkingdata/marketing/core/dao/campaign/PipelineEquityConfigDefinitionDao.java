package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.PipelineEquityConfigDefinition;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_EQUITY_CONFIG_DEFINITION PipelineEquityConfigDefinitionDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-08-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface PipelineEquityConfigDefinitionDao extends BaseDao<PipelineEquityConfigDefinition> {

    /**
     * Delete by pipeline definition id.
     *
     * @param pipelineDefinitionId the pipeline definition id
     */
    void deleteByPipelineDefinitionId(Integer pipelineDefinitionId);

    /**
     * Find by pipeline definition id list list.
     *
     * @param idList the id list
     * @return the list
     */
    List<PipelineEquityConfigDefinition> findByPipelineDefinitionIdList(@Param("idList") List<Integer> idList);

    /**
     * Delete by equity config id.
     *
     * @param equityConfigId the equity config id
     */
    void deleteByEquityConfigId(Integer equityConfigId);

    /**
     * Update name by equity config id.
     *
     * @param equityConfigId   the equity config id
     * @param equityConfigName the equity config name
     */
    void updateNameByEquityConfigId(@Param("equityConfigId") Integer equityConfigId, @Param("equityConfigName") String equityConfigName);
}
