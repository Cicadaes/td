package com.talkingdata.datacloud.service.monitor;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.dao.monitor.SubCalcObjectLogDao;
import com.talkingdata.datacloud.entity.monitor.SubCalcObjectLog;
import com.talkingdata.datacloud.page.monitor.SubCalcObjectLogPage;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>子计算对象日志 SubCalcObjectLogService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-21 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("subCalcObjectLogService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SubCalcObjectLogService extends BaseService<SubCalcObjectLog,Integer> {
	public final static Logger logger = Logger.getLogger(SubCalcObjectLogService.class);
	
	@Autowired
	private SubCalcObjectLogDao dao;

	public SubCalcObjectLogDao getDao() {
		return dao;
	}

	
	/**
	 * 查询指定计算对象历史执行记录总数
	 * 
	 * @param page
	 * @return
	 */
	public int queryWithCalcObjectLogIdByCount(SubCalcObjectLogPage page) {
		return dao.queryWithCalcObjectLogIdByCount(page);
	}
	
	public void updateStatus(Integer targetStatus, Date endTime,Integer schedulerTaskLogId,Integer azkabanExecutorId,Integer status) {
		dao.updateStatus(targetStatus, endTime, schedulerTaskLogId, azkabanExecutorId, status);
	};
	
	public void updateStatusAndException(Integer targetStatus, String exception, Date endTime,Integer schedulerTaskLogId,Integer azkabanExecutorId,Integer status) {
		dao.updateStatusAndException(targetStatus, exception, endTime, schedulerTaskLogId, azkabanExecutorId, status);
	};
	
	public int deleteByExcludesTenantIds(String[] tenantIds) {
		return dao.deleteByExcludesTenantIds(tenantIds);
	}
}
