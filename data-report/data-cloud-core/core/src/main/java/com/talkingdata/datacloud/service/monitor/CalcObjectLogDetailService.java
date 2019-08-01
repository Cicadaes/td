package com.talkingdata.datacloud.service.monitor;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.dao.monitor.CalcObjectLogDetailDao;
import com.talkingdata.datacloud.entity.monitor.CalcObjectLogDetail;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * 
 * <br>
 * <b>功能：</b>调度任务计算日志详情 CalcObjectLogDetailService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-02-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("calcObjectLogDetailService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CalcObjectLogDetailService extends BaseService<CalcObjectLogDetail,Integer> {
	public final static Logger logger = Logger.getLogger(CalcObjectLogDetailService.class);
	
	@Autowired
	private CalcObjectLogDetailDao dao;

	public CalcObjectLogDetailDao getDao() {
		return dao;
	}
	
	public CalcObjectLogDetail selectBySchedulerLogIdAndNameAndCode(String scheduleLogId, String code) {
	    return dao.selectBySchedulerLogIdAndNameAndCode(scheduleLogId,code);
    }
}
