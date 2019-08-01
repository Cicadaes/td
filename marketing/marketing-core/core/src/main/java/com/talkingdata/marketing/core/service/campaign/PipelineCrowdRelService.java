package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.entity.campaign.Crowd;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.PipelineCrowdRelDao;
import com.talkingdata.marketing.core.entity.campaign.PipelineCrowdRel;
import com.talkingdata.marketing.core.service.campaign.CrowdService;

/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_CROWD_REL PipelineCrowdRelService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-11-17 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("pipelineCrowdRelService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PipelineCrowdRelService extends BaseService<PipelineCrowdRel, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(PipelineCrowdRelService.class);

    @Autowired
    private PipelineCrowdRelDao dao;

    @Autowired
    private CrowdService crowdService;

    @Override
    public PipelineCrowdRelDao getDao() {
        return dao;
    }

    /**
     * 通过pipelineId获取人群
     * @param pipelineId 活动流程id
     * @param pipelineNodeId 活动流程节点id
     * @return  投放人群
     * @throws Exception 异常
     */
    public Crowd getCrowdByPipelineInfo(Integer pipelineId, String pipelineNodeId) throws Exception {
        PipelineCrowdRel pipelineCrowdRel = getDao().findByPipelineInfo(pipelineId, pipelineNodeId);
        if (pipelineCrowdRel == null) {
            return null;
        }
        return crowdService.selectByPrimaryKey(pipelineCrowdRel.getCrowdId());
    }

}
