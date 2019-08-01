package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.AppAndroidChannelConfig;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_APP_ANDROID_CHANNEL_CONFIG AppAndroidChannelConfigDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface AppAndroidChannelConfigDao extends BaseDao<AppAndroidChannelConfig> {
    /**
     * Gets by app config id and channel.
     *
     * @param appConfigId the app config id
     * @param channelCode the channel code
     * @return by app config id and channel
     */
    AppAndroidChannelConfig getByAppConfigIdAndChannel(@Param("appConfigId")Integer appConfigId,@Param("channelCode") String channelCode);

    /**
     * Insert or update.
     *
     * @param appAndroidChannelConfig the app android channel config
     */
    void insertOrUpdate(AppAndroidChannelConfig appAndroidChannelConfig);

    /**
     * Gets by app config id.
     *
     * @param appConfigId the app config id
     * @return by app config id
     */
    List<AppAndroidChannelConfig> getByAppConfigId(Integer appConfigId);
}
