package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.AuditLog;
import com.talkingdata.datacloud.page.admin.AuditLogPage;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>审计日志表 AuditLogDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-09-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface AuditLogDao extends BaseDao<AuditLog> {
	/**
	 * 高级搜索 查询标签类别总数
	 * 
	 * @param page
	 * @return
	 */
	Integer queryWithSearchByCount(AuditLogPage page);
	
	/**
	 * 高级搜索 查询标签类别列表
	 * 
	 * @param page
	 * @return
	 */
	List<AuditLog> queryWithSearchByList(AuditLogPage page);
}
