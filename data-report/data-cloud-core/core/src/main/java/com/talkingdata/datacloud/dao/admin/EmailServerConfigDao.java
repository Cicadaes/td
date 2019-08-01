package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.EmailServerConfig;
import com.talkingdata.datacloud.page.admin.EmailServerConfigPage;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>邮件服务配置表 EmailServerConfigDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface EmailServerConfigDao extends BaseDao<EmailServerConfig> {

	EmailServerConfig find(String emailservercode);
	
	public List<EmailServerConfig> queryByEmailServerConfig(EmailServerConfig emailServerConfig);
	
	public Integer queryWithSearchByCount(EmailServerConfigPage page);
	
	public List<EmailServerConfig> queryWithSearchByList(EmailServerConfigPage page);
	
}
