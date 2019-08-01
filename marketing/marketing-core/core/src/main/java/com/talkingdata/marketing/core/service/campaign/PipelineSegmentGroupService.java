package com.talkingdata.marketing.core.service.campaign;

import java.util.List;
import com.talkingdata.enterprise.base.page.BasePage;
import com.talkingdata.marketing.core.page.campaign.PipelineSegmentGroupPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.PipelineSegmentGroupDao;
import com.talkingdata.marketing.core.entity.campaign.PipelineSegmentGroup;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_SEGMENT_GROUP PipelineSegmentGroupService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-03-07 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("pipelineSegmentGroupService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PipelineSegmentGroupService extends BaseService<PipelineSegmentGroup, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(PipelineSegmentGroupService.class);

    @Autowired
    private PipelineSegmentGroupDao dao;

    @Override
    public PipelineSegmentGroupDao getDao() {
        return dao;
    }

    public List<PipelineSegmentGroup> findGroupsByGroupName(String groupName) throws Exception {
        List<PipelineSegmentGroup> pipelineSegmentGroupList = getDao().findGroupsByGroupName(groupName);
        return pipelineSegmentGroupList;
    }

    public List<PipelineSegmentGroup> findGroupByGroupName(String groupName) throws Exception {
        List<PipelineSegmentGroup> pipelineSegmentGroupList = getDao().findGroupByGroupName(groupName);
        return pipelineSegmentGroupList;
    }

    public PipelineSegmentGroup insertGroupByGroupName(String groupName) throws Exception {
        PipelineSegmentGroup pipelineSegmentGroup = new PipelineSegmentGroup();
        pipelineSegmentGroup.setGroupName(groupName);
        this.insert(pipelineSegmentGroup);
        return pipelineSegmentGroup;
    }

    public void deleteGroupByGroupName(String groupName) throws Exception {
        Integer groupId = this.findGroupIdByGroupName(groupName);
        this.deleteByPrimaryKey(groupId);
    }

    public Integer findGroupIdByGroupName(String groupName) throws Exception {
        List<PipelineSegmentGroup> pipelineSegmentGroupList = this.findGroupByGroupName(groupName);
        if (!pipelineSegmentGroupList.isEmpty()) {
            return pipelineSegmentGroupList.get(0).getId();
        }
        return null;
    }
}
