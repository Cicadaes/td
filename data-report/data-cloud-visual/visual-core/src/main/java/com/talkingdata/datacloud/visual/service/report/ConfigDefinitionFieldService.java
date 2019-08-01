package com.talkingdata.datacloud.visual.service.report;

import com.talkingdata.datacloud.visual.entity.report.ConfigDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.visual.dao.report.ConfigDefinitionFieldDao;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinitionField;

import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_CONFIG_DEFINITION_FIELD ConfigDefinitionFieldService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("configDefinitionFieldService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class ConfigDefinitionFieldService extends BaseService<ConfigDefinitionField, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(ConfigDefinitionFieldService.class);

    @Autowired
    private ConfigDefinitionFieldDao dao;

    public ConfigDefinitionFieldDao getDao() {
        return dao;
    }

}
