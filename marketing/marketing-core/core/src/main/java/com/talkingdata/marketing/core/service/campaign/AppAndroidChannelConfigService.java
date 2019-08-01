package com.talkingdata.marketing.core.service.campaign;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.AppAndroidChannelConfigDao;
import com.talkingdata.marketing.core.entity.campaign.AppAndroidChannelConfig;

import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_APP_ANDROID_CHANNEL_CONFIG AppAndroidChannelConfigService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("appAndroidChannelConfigService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class AppAndroidChannelConfigService extends BaseService<AppAndroidChannelConfig, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(AppAndroidChannelConfigService.class);

    @Autowired
    private AppAndroidChannelConfigDao dao;

    @Override
    public AppAndroidChannelConfigDao getDao() {
        return dao;
    }

    public AppAndroidChannelConfig getByAppConfigIdAndChannel(Integer appConfigId, String channelCode) {
        return getDao().getByAppConfigIdAndChannel(appConfigId,channelCode);
    }

    public void insertOrUpdate(AppAndroidChannelConfig appAndroidChannelConfig) {
        getDao().insertOrUpdate(appAndroidChannelConfig);
    }

    public List<AppAndroidChannelConfig> getByAppConfigId(Integer appConfigId) {
        return getDao().getByAppConfigId(appConfigId);
    }
}
