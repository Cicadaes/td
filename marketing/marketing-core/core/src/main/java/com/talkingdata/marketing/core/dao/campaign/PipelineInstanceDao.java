package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.PipelineInstance;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_INSTANCE PipelineInstanceDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-18 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface PipelineInstanceDao extends BaseDao<PipelineInstance> {

    /**
     * Find by campaign id list.
     *
     * @param campaignId the campaign id
     * @return the list
     */
    List<PipelineInstance> findByCampaignId(Integer campaignId);

    /**
     * Find by pipeline definition id list.
     *
     * @param pipelineDefinitionId the pipeline definition id
     * @return the list
     */
    List<PipelineInstance> findByPipelineDefinitionId(Integer pipelineDefinitionId);
}
