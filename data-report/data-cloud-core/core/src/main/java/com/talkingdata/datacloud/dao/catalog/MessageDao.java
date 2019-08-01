package com.talkingdata.datacloud.dao.catalog;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.catalog.Message;
/**
 *
 * <br>
 * <b>功能：</b>message MessageDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface MessageDao extends BaseDao<Message> {

    void updateBatch(Message message);

}
