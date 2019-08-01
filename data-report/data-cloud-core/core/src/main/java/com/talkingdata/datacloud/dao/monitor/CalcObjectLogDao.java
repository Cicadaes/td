package com.talkingdata.datacloud.dao.monitor;

import org.apache.ibatis.annotations.Param;
import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.monitor.CalcObjectLog;
import com.talkingdata.datacloud.page.monitor.CalcObjectLogPage;

import java.util.Date;
import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>调度任务计算日志 CalcObjectLogDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-02-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
public interface CalcObjectLogDao extends BaseDao<CalcObjectLog> {

	CalcObjectLog selectBySchedulerLogIdAndAzkabanExecId(@Param(value = "schedulerTaskLogId") String scheduleLogId,
														 @Param(value = "azkabanExecutorId") String azkabanExecutionId);

	CalcObjectLog selectBySchedulerLogIdAndNameAndCode(@Param(value = "schedulerTaskLogId") String scheduleLogId, @Param(value = "code") String code);

	public Integer queryWithSearchByCount(CalcObjectLogPage page);
	
	public Integer queryHistoryCalcIsFinishOrSkipped(CalcObjectLogPage page);

	public List<CalcObjectLog> queryWithSearchByList(CalcObjectLogPage page);

	public Integer queryWithSchedulerTaskByCount(CalcObjectLogPage page);

	public List<CalcObjectLog> queryWithSchedulerTaskByList(CalcObjectLogPage page);
	
	/**
	 * 查询计算对象日志
	 * 
	 * @param calcObjectLog
	 * @return
	 */
	public List<CalcObjectLog> queryByCalcObjectLog(CalcObjectLog calcObjectLog);
	
	/**
	 * 根据指定调度任务日志ID，并按照执行ID分组，获取分组列表
	 * 
	 * @param schedulerTaskLogId
	 * @param tenantId 租户为null不限租户查询
	 * @return
	 */
	public List<CalcObjectLog> queryWithExecutorIdGroupBySchedulerTaskLogId(@Param(value = "schedulerTaskLogId") Integer schedulerTaskLogId, @Param(value = "tenantId") String tenantId);

	/**
	 * 根据计算对象ID和指定租户查询计算对象信息
	 * 
	 * @param id
	 * @param tenantId
	 * @return
	 */
	public CalcObjectLog findWithIdAndTenantId(@Param(value = "id") Integer id, @Param(value = "tenantId") String tenantId);
	
	/**
	 * 查询具体业务对象计算日志：标签计算日志，人群放大计算日志等
	 * 
	 * @param bizObjectTableName
	 * @param bizObjectId
	 * @param objectCode
	 * @param tenantId
	 * @return
	 */
	public CalcObjectLog queryByBizObject(@Param(value = "bizObjectTableName") String bizObjectTableName, @Param(value = "bizObjectId") Integer bizObjectId,
										  @Param(value = "objectCode") String objectCode, @Param(value = "tenantId") String tenantId);


	public void updateStatus(@Param(value = "targetStatus") Integer targetStatus, @Param(value = "endTime") Date endTime,
							 @Param(value = "schedulerTaskLogId") Integer schedulerTaskLogId, @Param(value = "azkabanExecutorId") Integer azkabanExecutorId,
							 @Param(value = "status") Integer status);
	
	public void updateStatusAndException(@Param(value = "targetStatus") Integer targetStatus, @Param(value = "exception") String exception, @Param(value = "endTime") Date endTime,
										 @Param(value = "schedulerTaskLogId") Integer schedulerTaskLogId, @Param(value = "azkabanExecutorId") Integer azkabanExecutorId,
										 @Param(value = "status") Integer status);
	
	public void updateException(@Param(value = "exception") String exception, @Param(value = "schedulerTaskLogId") Integer schedulerTaskLogId,
								@Param(value = "azkabanExecutorId") Integer azkabanExecutorId, @Param(value = "status") Integer status);
	
	public List<CalcObjectLog> queryDistinctName(@Param(value = "tenantId") String tenantId, @Param(value = "objectType") String objectType);
	
	int deleteByExcludesTenantIds(@Param(value = "tenantIds") String[] tenantIds);
}
