package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.enterprise.base.page.BasePage;
import com.talkingdata.marketing.core.entity.campaign.PipelineSegmentGroup;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_SEGMENT_GROUP PipelineSegmentGroupDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-07 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface PipelineSegmentGroupDao extends BaseDao<PipelineSegmentGroup> {

    /**
     * 通过投放名模糊查询投放组
     * @param groupName 投放名
     * @return 投放组列表
     */
    List<PipelineSegmentGroup> findGroupsByGroupName(@Param("groupName")String groupName);

    List<PipelineSegmentGroup> findGroupByGroupName(@Param("groupName")String groupName);
}
