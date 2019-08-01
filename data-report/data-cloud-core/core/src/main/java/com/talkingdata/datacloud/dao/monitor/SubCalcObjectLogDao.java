package com.talkingdata.datacloud.dao.monitor;


import org.apache.ibatis.annotations.Param;
import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.monitor.SubCalcObjectLog;
import com.talkingdata.datacloud.page.monitor.SubCalcObjectLogPage;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>子计算对象日志 SubCalcObjectLogDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-21 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface SubCalcObjectLogDao extends BaseDao<SubCalcObjectLog> {
	
	/**
	 * 查询指定计算对象历史执行记录总数
	 * 
	 * @param page
	 * @return
	 */
	int queryWithCalcObjectLogIdByCount(SubCalcObjectLogPage page);
	
	public void updateStatus(@Param(value = "targetStatus") Integer targetStatus, @Param(value = "endTime") Date endTime,
							 @Param(value = "schedulerTaskLogId") Integer schedulerTaskLogId, @Param(value = "azkabanExecutorId") Integer azkabanExecutorId,
							 @Param(value = "status") Integer status);
	
	public void updateStatusAndException(@Param(value = "targetStatus") Integer targetStatus, @Param(value = "exception") String exception, @Param(value = "endTime") Date endTime,
										 @Param(value = "schedulerTaskLogId") Integer schedulerTaskLogId, @Param(value = "azkabanExecutorId") Integer azkabanExecutorId,
										 @Param(value = "status") Integer status);
	
	int deleteByExcludesTenantIds(@Param(value = "tenantIds") String[] tenantIds);
}
