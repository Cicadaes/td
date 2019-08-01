package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.AppConfig;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_APP_CONFIG AppConfigDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-15 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface AppConfigDao extends BaseDao<AppConfig> {
    /**
     * Gets by app id.
     *
     * @param appId the app id
     * @return by app id
     */
    AppConfig getByAppId(String appId);

    /**
     * Query by app id or pid list.
     *
     * @param appId     the app id
     * @param productId the product id
     * @return list
     */
    List<AppConfig> queryByAppIdOrPid(@Param("appId")String appId, @Param("productId")Integer productId);

    /**
     * Select by app id app config.
     *
     * @param appId the app id
     * @return app config
     */
    AppConfig selectByAppId(String appId);
}
