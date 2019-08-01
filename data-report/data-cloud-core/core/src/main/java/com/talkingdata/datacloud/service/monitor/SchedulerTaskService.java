package com.talkingdata.datacloud.service.monitor;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.common.SchedulerTaskConstants;
import com.talkingdata.datacloud.dao.monitor.SchedulerTaskDao;
import com.talkingdata.datacloud.entity.monitor.SchedulerTask;
import com.talkingdata.datacloud.exception.BusinessException;
import com.talkingdata.datacloud.page.monitor.SchedulerTaskPage;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 
 * <br>
 * <b>功能：</b>调度任务 SchedulerTaskService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-02-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
@Service("schedulerTaskService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SchedulerTaskService extends BaseService<SchedulerTask,Integer> {
	public final static Logger logger = Logger.getLogger(SchedulerTaskService.class);

	@Autowired
	private SchedulerTaskDao dao;

	public SchedulerTaskDao getDao() {
		return dao;
	}

	/**
	 * 查询版本最大的调度任务总数
	 * 
	 * @param page
	 * @return
	 */
	public int queryByCountWithMaxVersion(SchedulerTaskPage page) {
		if(!StringUtils.isBlank(page.getTenantId()) && page.getTenants().size() == 0){
			page.getTenants().add(page.getTenantId());
		}
		return dao.queryByCountWithMaxVersion(page);
	}

	/**
	 * 查询版本最大的调度任务列表
	 * 
	 * @param page
	 * @return
	 */
	public List<SchedulerTask> queryByListWithMaxVersion(SchedulerTaskPage page) {
		if(!StringUtils.isBlank(page.getTenantId()) && page.getTenants().size() == 0){
			page.getTenants().add(page.getTenantId());
		}
		Integer rowCount = queryByCountWithMaxVersion(page);
		page.getPager().setRowCount(rowCount);
		return getDao().queryByListWithMaxVersion(page);
	}
	
	public List<SchedulerTask> querySystemTaskByList(SchedulerTaskPage page) {
		Integer rowCount = dao.querySystemTaskByCount(page);
		page.getPager().setRowCount(rowCount);
		return getDao().querySystemTaskByList(page);
	}
	
	public SchedulerTask updateSchedulerTaskStatus(String schedulerTaskId, String action){
		SchedulerTask schedulerTask = dao.selectByPrimaryKey(schedulerTaskId);
		
		SchedulerTask schedulerTaskTemp = new SchedulerTask();
		int status = schedulerTask.getStatus();
		if (StringUtils.isNotBlank(action) && "disable".equals(action)) {
			if (status != SchedulerTaskConstants.SchedulerTaskStatusConstants.SCHEDULER_TASK_STATUS_ENABLE) {
				throw new BusinessException("调度任务不能禁用，请检查当前状态");
			}
			
			schedulerTaskTemp.setId(schedulerTask.getId());
			schedulerTaskTemp.setStatus(SchedulerTaskConstants.SchedulerTaskStatusConstants.SCHEDULER_TASK_STATUS_DISABLE);
			dao.updateByPrimaryKeySelective(schedulerTaskTemp);
		} else if (StringUtils.isNotBlank(action) && "enable".equals(action)) {
			if (status != SchedulerTaskConstants.SchedulerTaskStatusConstants.SCHEDULER_TASK_STATUS_DISABLE) {
				throw new BusinessException("调度任务不能禁用，请检查当前状态");
			}
			
			schedulerTaskTemp.setId(schedulerTask.getId());
			schedulerTaskTemp.setStatus(SchedulerTaskConstants.SchedulerTaskStatusConstants.SCHEDULER_TASK_STATUS_ENABLE);
			dao.updateByPrimaryKeySelective(schedulerTaskTemp);
		} else {
			throw new BusinessException("不符合要求的操作");
		}
		schedulerTask.setStatus(schedulerTaskTemp.getStatus());
		return schedulerTask;
	}
	
	/**
	 * 更新调度任务
	 * 
	 * @param schedulerTask
	 * @return
	 */
	public SchedulerTask updateWithTenant(SchedulerTask schedulerTask){
		schedulerTask.setUpdateTime(new Date());
		dao.updateByPrimaryKey(schedulerTask);
		
		return schedulerTask;
	}
	
	public List<SchedulerTask> queryBySchedulerTaskWithMaxVersion(SchedulerTask schedulerTask){
		return dao.queryBySchedulerTaskWithMaxVersion(schedulerTask);
	}
	
	public SchedulerTask findByCodeWithMaxVersion(String code,String azkabanProjectName){
		return dao.findByCodeWithMaxVersion(code,azkabanProjectName);
	}
	
	public List<Map<String, String>> dropDownSchedulerTasks(Map<String, Object> dropDownCondition) {
		return dao.dropDownSchedulerTasks(dropDownCondition);
	}

	public boolean updatePublishTime(String pipelineCode,String projectCode,Date createTime,Date updateTime){
		SchedulerTask schedulerTask = dao.findByCodeWithMaxVersion(pipelineCode,projectCode);
        if(schedulerTask!=null){
            schedulerTask.setCreateTime(createTime);
            schedulerTask.setUpdateTime(updateTime);
            dao.updateByPrimaryKey(schedulerTask);
            logger.info(String.format("publish post process reset publish datapipeline date,datapipline code=%s,date=%s,taskId=%d",pipelineCode,createTime.toString(),schedulerTask.getId()));
            return true;
        }
        return false;
	}
}
