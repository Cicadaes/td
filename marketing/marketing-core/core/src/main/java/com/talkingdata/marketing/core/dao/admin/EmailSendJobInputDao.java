package com.talkingdata.marketing.core.dao.admin;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.admin.EmailSendJobInput;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_EMAIL_SEND_JOB_INPUT EmailSendJobInputDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-05-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface EmailSendJobInputDao extends BaseDao<EmailSendJobInput> {
    /**
     * Find valid list.
     *
     * @return the list
     */
    List<EmailSendJobInput> findValid();

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);
}
