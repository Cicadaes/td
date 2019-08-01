package com.talkingdata.datacloud.dao.monitor;

import org.apache.ibatis.annotations.Param;
import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.monitor.SchedulerTaskLog;
import com.talkingdata.datacloud.page.monitor.SchedulerTaskLogPage;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>调度任务日志 SchedulerTaskLogDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-02-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
public interface SchedulerTaskLogDao extends BaseDao<SchedulerTaskLog> {

	List<SchedulerTaskLog> queryByStatus(@Param(value = "status") int status);

	public Integer queryWithSearchByCount(SchedulerTaskLogPage page);

	public List<SchedulerTaskLog> queryWithSearchByList(SchedulerTaskLogPage page);
	
	public SchedulerTaskLog findWithTenantId(@Param(value = "schedulerTaskLogId") Integer schedulerTaskLogId, @Param(value = "tenantId") String tenantId);

	public List<SchedulerTaskLog> queryBySchedulerTaskLog(SchedulerTaskLog schedulerTaskLog);
	
	int deleteByExcludesTenantIds(@Param(value = "tenantIds") String[] tenantIds);
}
