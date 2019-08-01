package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.PipelineStage;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_STAGE PipelineStageDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface PipelineStageDao extends BaseDao<PipelineStage> {

    /**
     * Insert batch int.
     *
     * @param pipelineStages the pipeline stages
     * @return the int
     */
    int insertBatch(@Param("stages") List<PipelineStage> pipelineStages);

    /**
     * Find by campaign id list.
     *
     * @param campaignId the campaign id
     * @return the list
     */
    List<PipelineStage> findByCampaignId(Integer campaignId);

    /**
     * Find by pipeline definition id list.
     *
     * @param pipelineDefinitionId the pipeline definition id
     * @return the list
     */
    List<PipelineStage> findByPipelineDefinitionId(Integer pipelineDefinitionId);

    /**
     * Delete by campaign id and pipeline id and version.
     *
     * @param campaignId the campaign id
     * @param pipelineId the pipeline id
     * @param version    the version
     * @param tenantId   the tenant id
     */
    void deleteByCampaignIdAndPipelineIdAndVersion(@Param("campaignId") Integer campaignId, @Param("pipelineId") Integer pipelineId,
        @Param("version") String version, @Param("tenantId") String tenantId);
}
