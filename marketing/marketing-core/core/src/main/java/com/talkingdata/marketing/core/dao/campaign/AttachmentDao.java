package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.Attachment;

/**
 * <br>
 * <b>功能：</b>TD_MKT_ATTACHMENT AttachmentDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2018-01-31 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface AttachmentDao extends BaseDao<Attachment> {
    /**
     * 根据crowdId查询附件.
     *
     * @param crowdId the crowd id
     * @return attachment
     */
    Attachment selectByCrowdId(Integer crowdId);

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);

    /**
     * Select by equity config id attachment.
     *
     * @param equityConfigId the equity config id
     * @return attachment
     */
    Attachment selectByEquityConfigId(Integer equityConfigId);
}
