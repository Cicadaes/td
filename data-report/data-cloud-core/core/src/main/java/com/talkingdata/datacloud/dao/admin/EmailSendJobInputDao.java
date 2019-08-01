package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.EmailSendJobInput;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>邮件发送记录' EmailSendJobInputDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-09-18 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface EmailSendJobInputDao extends BaseDao<EmailSendJobInput> {

	List<EmailSendJobInput> findValid();
	
}
