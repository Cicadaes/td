package com.talkingdata.datacloud.service.monitor;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.dao.monitor.CalcObjectLogDao;
import com.talkingdata.datacloud.entity.monitor.CalcObjectLog;
import com.talkingdata.datacloud.page.monitor.CalcObjectLogPage;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 
 * <br>
 * <b>功能：</b>调度任务计算日志 CalcObjectLogService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-02-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
@Service("calcObjectLogService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CalcObjectLogService extends BaseService<CalcObjectLog,Integer> {
	public final static Logger logger = Logger.getLogger(CalcObjectLogService.class);

	@Autowired
	private CalcObjectLogDao dao;

	public CalcObjectLogDao getDao() {
		return dao;
	}
	
	public Integer queryWithSearchByCount(CalcObjectLogPage page) throws Exception{
		return dao.queryWithSearchByCount(page);
	}
	
	public Integer queryHistoryCalcIsFinishOrSkipped(CalcObjectLogPage page) throws Exception{
		return dao.queryHistoryCalcIsFinishOrSkipped(page);
	} 

	public List<CalcObjectLog> queryWithSearchByList(CalcObjectLogPage page) throws Exception{
		Integer rowCount = queryWithSearchByCount(page);
		page.getPager().setRowCount(rowCount);
		return dao.queryWithSearchByList(page);
	}

	public void startCalc(Integer shcedulerTaskLogId) {
		CalcObjectLog calcObjectLog = new CalcObjectLog();
		calcObjectLog.setSchedulerTaskLogId(shcedulerTaskLogId);
		logger.info("增加计算对象日志");
	}

	public void finishCalc(Integer calcObjectLogId, Integer status) {
		CalcObjectLog calcObjectLog = new CalcObjectLog();
		calcObjectLog.setId(calcObjectLogId);
		logger.info("更新计算对象日志");
	}

	public CalcObjectLog selectBySchedulerLogIdAndAzkabanExecId(String scheduleLogId, String azkabanExecutionId) {
		return dao.selectBySchedulerLogIdAndAzkabanExecId(scheduleLogId, azkabanExecutionId);
	}

	public CalcObjectLog selectBySchedulerLogIdAndNameAndCode(String scheduleLogId, String code) {
		return dao.selectBySchedulerLogIdAndNameAndCode(scheduleLogId, code);
	}
	
	public Integer queryWithSchedulerTaskByCount(CalcObjectLogPage page){
		return dao.queryWithSchedulerTaskByCount(page);
	}

	public List<CalcObjectLog> queryWithSchedulerTaskByList(CalcObjectLogPage page){
		Integer rowCount = queryWithSchedulerTaskByCount(page);
		page.getPager().setRowCount(rowCount);
		return dao.queryWithSchedulerTaskByList(page);
	}

	/**
	 * 根据计算对象ID和指定租户查询计算对象信息
	 * 
	 * @param id
	 * @param tenantId
	 * @return
	 */
	public CalcObjectLog findWithIdAndTenantId(Integer id, String tenantId) throws Exception{
		return dao.findWithIdAndTenantId(id, tenantId);
	}
	
	public void updateStatus(Integer targetStatus, Date endTime,Integer schedulerTaskLogId,Integer azkabanExecutorId,Integer status) {
		dao.updateStatus(targetStatus, endTime, schedulerTaskLogId, azkabanExecutorId, status);
	}
	
	public void updateStatusAndException(Integer targetStatus, String exception, Date endTime,Integer schedulerTaskLogId,Integer azkabanExecutorId,Integer status) {
		dao.updateStatusAndException(targetStatus, exception, endTime, schedulerTaskLogId, azkabanExecutorId, status);
	}
	
	public void updateException(String exception, Integer schedulerTaskLogId, Integer azkabanExecutorId, Integer status) {
		dao.updateException(exception, schedulerTaskLogId, azkabanExecutorId, status);
	};
	
	/**
	 * 查询计算对象日志
	 * 
	 * @param calcObjectLog
	 * @return
	 */
	public List<CalcObjectLog> queryByCalcObjectLog(CalcObjectLog calcObjectLog){
		return dao.queryByCalcObjectLog(calcObjectLog);
	}
	
	/**
	 * 根据指定调度任务日志ID，并按照执行ID分组，获取计算对象数
	 * 
	 * @param schedulerTaskLogId
	 * @param tenantId 租户为null不限租户查询
	 * @return
	 */
	public List<CalcObjectLog> queryWithExecutorIdGroupBySchedulerTaskLogId(Integer schedulerTaskLogId, String tenantId){
		return dao.queryWithExecutorIdGroupBySchedulerTaskLogId(schedulerTaskLogId, tenantId);
	}
	
	/**
	 * 计算对象日志分组展示
	 * 
	 * @param schedulerTaskLogId
	 * @param tenantId
	 * @return
	 */
	public Map<String, Object> queryWithGroupByExecutorId(Integer schedulerTaskLogId, String tenantId){
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<CalcObjectLog> resultList = new ArrayList<CalcObjectLog>();
		
		boolean isGroup = false;
		
		List<CalcObjectLog> calcObjectLogGroupList= queryWithExecutorIdGroupBySchedulerTaskLogId(schedulerTaskLogId,tenantId);
		if(calcObjectLogGroupList == null || calcObjectLogGroupList.size() == 0){
			resultMap.put("isGroup", isGroup);
			resultMap.put("datas", resultList);
			return resultMap;
		}else if(calcObjectLogGroupList.size() > 1){
			isGroup = true;
		}
		
		CalcObjectLog calcObjectLogForQ = new CalcObjectLog();
		calcObjectLogForQ.setSchedulerTaskLogId(schedulerTaskLogId);
		calcObjectLogForQ.setTenantId(tenantId);
		List<CalcObjectLog> calcObjectLogList = queryByCalcObjectLog(calcObjectLogForQ);
		
		Map<Integer,CalcObjectLog> map = new LinkedHashMap<Integer,CalcObjectLog>();
		for(int i=0;i<calcObjectLogGroupList.size();i++){
			CalcObjectLog tempCol = calcObjectLogGroupList.get(i);
			CalcObjectLog parent = new CalcObjectLog();
			if(i == 0){
				parent.setParentDesc("首次执行计算日志");
			} else {
				parent.setParentDesc("第" + i + "次重试执行计算日志");
			}
			map.put(tempCol.getAzkabanExecutorId(), parent);
		}
		
		for(CalcObjectLog col : calcObjectLogList){
			map.get(col.getAzkabanExecutorId()).getCalcObjectLogList().add(col);
		}
		
		for(Map.Entry<Integer, CalcObjectLog> entry : map.entrySet()){
			resultList.add(entry.getValue());
		}
		
		
		if(calcObjectLogGroupList.size() == 1){
			resultList = resultList.get(0).getCalcObjectLogList();
		}
		
		resultMap.put("isGroup", isGroup);
		resultMap.put("datas", resultList);
		
		return resultMap;
	}
	
	/**
	 * 查询具体业务对象计算日志：标签计算日志，人群放大计算日志等
	 * 
	 * @param bizObjectTableName
	 * @param bizObjectId
	 * @param objectCode
	 * @param tenantId
	 * @return
	 */
	public CalcObjectLog queryByBizObject(String bizObjectTableName, Integer bizObjectId, String objectCode, String tenantId){
		return dao.queryByBizObject(bizObjectTableName, bizObjectId, objectCode, tenantId);
	}
	
	public List<CalcObjectLog> queryDistinctName(String tenantId, String objectType){
		return dao.queryDistinctName(tenantId, objectType);
	}

	public int deleteByExcludesTenantIds(String[] tenantIds) {
		return dao.deleteByExcludesTenantIds(tenantIds);
	}
	
}
