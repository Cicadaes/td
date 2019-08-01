package com.talkingdata.marketing.core.service.admin;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.admin.FunnelStepConditionDefinitionDao;
import com.talkingdata.marketing.core.entity.admin.FunnelStepConditionDefinition;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_FUNNEL_STEP_CONDITION_DEFINITION FunnelStepConditionDefinitionService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("funnelStepConditionDefinitionService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class FunnelStepConditionDefinitionService extends BaseService<FunnelStepConditionDefinition, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(FunnelStepConditionDefinitionService.class);

    @Autowired
    private FunnelStepConditionDefinitionDao dao;

    @Override
    public FunnelStepConditionDefinitionDao getDao() {
        return dao;
    }

    public Integer insertBatch(List<FunnelStepConditionDefinition> funnelStepConditionDefinitions) throws Exception {
        return getDao().insertBatch(funnelStepConditionDefinitions);
    }

    public List<FunnelStepConditionDefinition> selectByIds(List<Integer> param) throws Exception {
        if (param == null || param.size()==0) {
            return Collections.EMPTY_LIST;
        }
        List<FunnelStepConditionDefinition> result = getDao().selectByIds(param);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }
}
