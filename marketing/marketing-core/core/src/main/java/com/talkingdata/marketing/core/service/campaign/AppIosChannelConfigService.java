package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.entity.campaign.AppConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.AppIosChannelConfigDao;
import com.talkingdata.marketing.core.entity.campaign.AppIosChannelConfig;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_APP_IOS_CHANNEL_CONFIG AppIosChannelConfigService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("appIosChannelConfigService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class AppIosChannelConfigService extends BaseService<AppIosChannelConfig, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(AppIosChannelConfigService.class);

    @Autowired
    private AppIosChannelConfigDao dao;

    @Override
    public AppIosChannelConfigDao getDao() {
        return dao;
    }

    public void insertOrUpdate(AppIosChannelConfig appIosChannelConfig) {
        getDao().insertOrUpdate(appIosChannelConfig);
    }

    public AppIosChannelConfig getByAppConfigId(Integer appConfigId){
        return getDao().getByAppConfigId(appConfigId);
    }
}
