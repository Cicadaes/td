package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.dto.PipelineDefinitionDto;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Set;


/**
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_DEFINITION PipelineDefinitionDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-08-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Component
public interface PipelineDefinitionDao extends BaseDao<PipelineDefinition> {

    /**
     * Find by campaign id list.
     *
     * @param campaignId the campaign id
     * @return the list
     */
    List<PipelineDefinition> findByCampaignId(Integer campaignId);


    /**
     * Query by page list.
     *
     * @param campaignId  the campaign id
     * @param creator     the creator
     * @param name        the name
     * @param statusList  the status list
     * @param updater     the updater
     * @param updateTime1 the update time 1
     * @param updateTime2 the update time 2
     * @param offset      the offset
     * @param limit       the limit
     * @return the list
     */
    List<PipelineDefinitionDto> queryByPage(@Param("campaignId") Integer campaignId, @Param("creator") String creator, @Param("name") String name, @Param("statusList") List<Integer> statusList, @Param("updater")String updater, @Param("updateTime1")Date updateTime1, @Param("updateTime2")Date updateTime2, @Param("offset") Integer offset, @Param("limit") Integer limit);

    /**
     * Count by page int.
     *
     * @param campaignId  the campaign id
     * @param creator     the creator
     * @param name        the name
     * @param statusList  the status list
     * @param updater     the updater
     * @param updateTime1 the update time 1
     * @param updateTime2 the update time 2
     * @return the int
     */
    int countByPage(@Param("campaignId") Integer campaignId, @Param("creator") String creator, @Param("name") String name, @Param("statusList") List<Integer> statusList, @Param("updater")String updater, @Param("updateTime1")Date updateTime1, @Param("updateTime2")Date updateTime2);

    /**
     * Select simple instance by ids list.
     *
     * @param ids the ids
     * @return the list
     */
    List<PipelineDefinition> selectSimpleInstanceByIds(@Param("set") Set<Integer> ids);

}
