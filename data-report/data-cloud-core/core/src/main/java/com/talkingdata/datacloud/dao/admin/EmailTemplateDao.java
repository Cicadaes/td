package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.EmailTemplate;
import com.talkingdata.datacloud.page.admin.EmailTemplatePage;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>邮件模板表 EmailTemplateDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface EmailTemplateDao extends BaseDao<EmailTemplate> {
	
	public EmailTemplate findByEmailTemplateCode(String code);
	
	public List<EmailTemplate> queryByEmailTemplate(EmailTemplate emailTemplate);
	
	public Integer queryWithSearchByCount(EmailTemplatePage page);
	
	public List<EmailTemplate> queryWithSearchByList(EmailTemplatePage page);
	
}
