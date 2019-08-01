package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.PipelineCrowdRel;
import org.apache.ibatis.annotations.Param;

/**
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_CROWD_REL PipelineCrowdRelDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-11-17 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface PipelineCrowdRelDao extends BaseDao<PipelineCrowdRel> {

    /**
     * Delete by pipeline info and crowd id int.
     *
     * @param crowdRel the crowd rel
     * @return the int
     */
    int deleteByPipelineInfoAndCrowdId(PipelineCrowdRel crowdRel);

    /**
     * 通过pipelineId获取人群
     * @param pipelineId 活动流程ID
     * @param pipelineNodeId 活动流程节点ID
     * @return 人群
     */
    PipelineCrowdRel findByPipelineInfo(@Param("pipelineId")Integer pipelineId, @Param("pipelineNodeId")String pipelineNodeId);
}
