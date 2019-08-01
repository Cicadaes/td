package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.page.BasePage;
import com.talkingdata.marketing.core.page.campaign.PipelineSegmentGroupRelPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.PipelineSegmentGroupRelDao;
import com.talkingdata.marketing.core.entity.campaign.PipelineSegmentGroupRel;

import java.util.List;

/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_SEGMENT_GROUP_REL PipelineSegmentGroupRelService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-07 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("pipelineSegmentGroupRelService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PipelineSegmentGroupRelService extends BaseService<PipelineSegmentGroupRel, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(PipelineSegmentGroupRelService.class);

    @Autowired
    private PipelineSegmentGroupRelDao dao;

    @Override
    public PipelineSegmentGroupRelDao getDao() {
        return dao;
    }

    @Autowired
    public PipelineSegmentGroupService pipelineSegmentGroupService;

    public List<PipelineSegmentGroupRel> findGroupRelsByGroupName(String groupName) throws Exception {
        Integer groupId = pipelineSegmentGroupService.findGroupIdByGroupName(groupName);
        PipelineSegmentGroupRelPage page = new PipelineSegmentGroupRelPage();
        page.setPageSize(Integer.MAX_VALUE);
        page.setGroupId(groupId.toString());
        List<PipelineSegmentGroupRel> pipelineSegmentGroupRelList = getDao().queryByList(page);
        return pipelineSegmentGroupRelList;
    }
    public void createGroupRelByPipelineAndGroupName(Integer pipelineId, String groupName) throws Exception {
        Integer groupId = pipelineSegmentGroupService.findGroupIdByGroupName(groupName);
        if (groupId == null) {
            pipelineSegmentGroupService.insertGroupByGroupName(groupName);
            groupId = pipelineSegmentGroupService.findGroupIdByGroupName(groupName);
        }
        PipelineSegmentGroupRel pipelineSegmentGroupRel = new PipelineSegmentGroupRel();
        pipelineSegmentGroupRel.setPipelineId(pipelineId);
        pipelineSegmentGroupRel.setGroupId(groupId);
        this.insert(pipelineSegmentGroupRel);
    }
}
