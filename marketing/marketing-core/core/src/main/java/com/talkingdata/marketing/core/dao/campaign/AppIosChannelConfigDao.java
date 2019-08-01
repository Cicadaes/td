package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.AppConfig;
import com.talkingdata.marketing.core.entity.campaign.AppIosChannelConfig;

/**
 * <br>
 * <b>功能：</b>TD_MKT_APP_IOS_CHANNEL_CONFIG AppIosChannelConfigDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface AppIosChannelConfigDao extends BaseDao<AppIosChannelConfig> {

    /**
     * Insert or update.
     *
     * @param appIosChannelConfig the app ios channel config
     */
    void insertOrUpdate(AppIosChannelConfig appIosChannelConfig);

    /**
     * Gets by app config id.
     *
     * @param appConfigId the app config id
     * @return the by app config id
     */
    AppIosChannelConfig getByAppConfigId(Integer appConfigId);
}
