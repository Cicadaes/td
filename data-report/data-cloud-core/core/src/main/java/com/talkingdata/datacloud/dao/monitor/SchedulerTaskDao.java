package com.talkingdata.datacloud.dao.monitor;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.base.page.BasePage;
import com.talkingdata.datacloud.entity.monitor.SchedulerTask;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * 
 * <br>
 * <b>功能：</b>调度任务 SchedulerTaskDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-02-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
public interface SchedulerTaskDao extends BaseDao<SchedulerTask> {

	public int queryByCountWithMaxVersion(BasePage page);

	public List<SchedulerTask> queryByListWithMaxVersion(BasePage page);
	
	public int querySystemTaskByCount(BasePage page);

	public List<SchedulerTask> querySystemTaskByList(BasePage page);
	
	public Integer queryWithTenantIdByCount();
	
	public List<SchedulerTask> queryBySchedulerTaskWithMaxVersion(SchedulerTask schedulerTask);
	
	public SchedulerTask findByCodeWithMaxVersion(@Param("code") String code, @Param("azkabanProjectName") String azkabanProjectName);
	
	public List<Map<String, String>> dropDownSchedulerTasks(Map<String, Object> dropDownCondition);
}
