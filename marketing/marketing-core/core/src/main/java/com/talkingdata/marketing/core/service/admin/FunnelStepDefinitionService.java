package com.talkingdata.marketing.core.service.admin;

import com.talkingdata.marketing.core.page.admin.FunnelStepDefinitionPage;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.admin.FunnelStepDefinitionDao;
import com.talkingdata.marketing.core.entity.admin.FunnelStepDefinition;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_FUNNEL_STEP_DEFINITION FunnelStepDefinitionService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("funnelStepDefinitionService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class FunnelStepDefinitionService extends BaseService<FunnelStepDefinition, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(FunnelStepDefinitionService.class);

    @Autowired
    private FunnelStepDefinitionDao dao;

    @Override
    public FunnelStepDefinitionDao getDao() {
        return dao;
    }

    public List<FunnelStepDefinition> listByFunnelIdAndName(Integer funnelId, String name) throws Exception {
        FunnelStepDefinitionPage page = new FunnelStepDefinitionPage();
        page.setFunnelDefinitionId(String.valueOf(funnelId));
        page.setName(name);
        List<FunnelStepDefinition> result = getDao().queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }

    public List<FunnelStepDefinition> listByIds(List<Integer> ids) throws Exception {
        List<FunnelStepDefinition> result = getDao().selectByPrimaryKeys(ids);
        return result == null ? Collections.EMPTY_LIST : result;
    }
}
