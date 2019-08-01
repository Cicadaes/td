package com.talkingdata.marketing.core.service.campaign;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.PipelineInstanceDao;
import com.talkingdata.marketing.core.entity.campaign.PipelineInstance;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_INSTANCE PipelineInstanceService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-18 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("pipelineInstanceService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PipelineInstanceService extends BaseService<PipelineInstance, Void> {

    private static final Logger logger = LoggerFactory.getLogger(PipelineInstanceService.class);

    @Autowired
    private PipelineInstanceDao dao;

    @Override
    public PipelineInstanceDao getDao() {
        return dao;
    }

}
