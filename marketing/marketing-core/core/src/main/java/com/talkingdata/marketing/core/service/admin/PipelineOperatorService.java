package com.talkingdata.marketing.core.service.admin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.admin.PipelineOperatorDao;
import com.talkingdata.marketing.core.entity.admin.PipelineOperator;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_PIPELINE_OPERATOR PipelineOperatorService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-08-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("pipelineOperatorService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class PipelineOperatorService extends BaseService<PipelineOperator, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(PipelineOperatorService.class);

    @Autowired
    private PipelineOperatorDao dao;

    @Override
    public PipelineOperatorDao getDao() {
        return dao;
    }

}
