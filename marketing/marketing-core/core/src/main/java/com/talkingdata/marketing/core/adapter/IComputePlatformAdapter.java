package com.talkingdata.marketing.core.adapter;

import com.talkingdata.marketing.core.entity.campaign.Crowd;

/**
 * 计算平台适配器,用户适配各计算平台的接口等。
 *
 * @author tao.yang
 * @date 2018-02-26
 */
public interface IComputePlatformAdapter {

    /**
     * 重新计算,在此需要对各计算平台的状态做对应的转换处理
     *
     * @param crowd 人群
     * @return
     */
    int recalculate(Crowd crowd);

}
