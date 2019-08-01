package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.EquityRecord;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_EQUITY_RECORD EquityRecordDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-08-31 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Component
public interface EquityRecordDao extends BaseDao<EquityRecord> {
    /**
     * Insert batch equity record integer.
     *
     * @param equityRecordList the equity record list
     * @return the integer
     */
    Integer insertBatchEquityRecord(List<EquityRecord> equityRecordList);

    /**
     * Delete not used equity.
     *
     * @param pipelineDefinitionId the pipeline definition id
     */
    void deleteNotUsedEquity(@Param("pipelineDefinitionId") Integer pipelineDefinitionId);

    /**
     * Delete extra equity.
     *
     * @param pipelineDefinitionId the pipeline definition id
     * @param equityConfigId       the equity config id
     * @param limit                the limit
     */
    void deleteExtraEquity(@Param("pipelineDefinitionId") Integer pipelineDefinitionId, @Param("equityConfigId") Integer equityConfigId, @Param("limit") Integer limit);

    /**
     * Update equity used.
     *
     * @param campaignId           the campaign id
     * @param pipelineDefinitionId the pipeline definition id
     * @param equityCode           the equity code
     * @param equityValueList      the equity value list
     */
    void updateEquityUsed(@Param("campaignId") Integer campaignId,
                          @Param("pipelineDefinitionId") Integer pipelineDefinitionId,
                          @Param("equityCode") String equityCode,
                          @Param("equityValueList") List<String> equityValueList);

    /**
     * Delete by ids.
     *
     * @param ids the ids
     */
    void deleteByIds(@Param("ids") List<Integer> ids);

    /**
     * Find by equity config id and status list.
     *
     * @param equityConfigId the equity config id
     * @param status         the status
     * @return the list
     */
    List<EquityRecord> findByEquityConfigIdAndStatus(@Param("equityConfigId")Integer equityConfigId, @Param("status")int status);

    /**
     * Count by equity config id and status int.
     *
     * @param equityConfigId the equity config id
     * @param status         the status
     * @return the int
     */
    int countByEquityConfigIdAndStatus(@Param("equityConfigId")Integer equityConfigId, @Param("status")int status);

    /**
     * Count by pipeline definition id and status int.
     *
     * @param pipelineDefinitionId the pipeline definition id
     * @param status               the status
     * @return the int
     */
    int countByPipelineDefinitionIdAndStatus(@Param("pipelineDefinitionId")Integer pipelineDefinitionId, @Param("status")int status);
}
