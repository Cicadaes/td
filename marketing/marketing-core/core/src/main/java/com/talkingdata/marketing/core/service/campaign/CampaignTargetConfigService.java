package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.Constant;
import com.talkingdata.marketing.core.dao.campaign.CampaignTargetConfigDao;
import com.talkingdata.marketing.core.entity.campaign.CampaignTargetConfig;
import com.talkingdata.marketing.core.page.campaign.CampaignTargetConfigPage;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.Collections;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CAMPAIGN_TARGET_CONFIG CampaignTargetConfigService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("campaignTargetConfigService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CampaignTargetConfigService extends BaseService<CampaignTargetConfig, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(CampaignTargetConfigService.class);

    @Autowired private CampaignTargetConfigDao dao;

    @Override public CampaignTargetConfigDao getDao() {
        return dao;
    }

    public List<CampaignTargetConfig> findByCampaignId(Integer campaignId) throws Exception {
        CampaignTargetConfigPage page = new CampaignTargetConfigPage();
        page.setCampaignId(String.valueOf(campaignId));
        page.setPageSize(Constant.QUERY_PAGE_SIZE);
        List<CampaignTargetConfig> result = queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    public Integer insertOrUpdateCampaignTargetConfig(CampaignTargetConfig campaignTargetConfig) {
        return getDao().insertOrUpdate(campaignTargetConfig);
    }

    public void deleteByUniqueIndex(Integer campaignId, Integer targetDefinitionId, Integer metricType) {
        getDao().deleteByUniqueIndex(campaignId, targetDefinitionId, metricType);
    }

    public List<CampaignTargetConfig> findByUniqueIndex(final Integer campaignId, final Integer targetDefinitionId, final Integer metricType)
        throws Exception {
        CampaignTargetConfigPage page = new CampaignTargetConfigPage();
        page.setCampaignId(String.valueOf(campaignId));
        page.setTargetDefinitionId(String.valueOf(targetDefinitionId));
        page.setMetricType(String.valueOf(metricType));
        List<CampaignTargetConfig> result = getDao().queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }

}
