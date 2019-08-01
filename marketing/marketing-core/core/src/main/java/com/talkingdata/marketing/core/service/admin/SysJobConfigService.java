package com.talkingdata.marketing.core.service.admin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.admin.SysJobConfigDao;
import com.talkingdata.marketing.core.entity.admin.SysJobConfig;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_SYS_JOB_CONFIG SysJobConfigService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-06-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("sysJobConfigService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SysJobConfigService extends BaseService<SysJobConfig, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(SysJobConfigService.class);

    @Autowired
    private SysJobConfigDao dao;

    @Override
    public SysJobConfigDao getDao() {
        return dao;
    }

}
