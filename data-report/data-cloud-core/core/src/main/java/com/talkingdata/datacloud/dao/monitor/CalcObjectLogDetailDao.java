package com.talkingdata.datacloud.dao.monitor;

import org.apache.ibatis.annotations.Param;
import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.monitor.CalcObjectLogDetail;

/**
 * 
 * <br>
 * <b>功能：</b>调度任务计算日志详情 CalcObjectLogDetailDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-02-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface CalcObjectLogDetailDao extends BaseDao<CalcObjectLogDetail> {
	CalcObjectLogDetail selectBySchedulerLogIdAndNameAndCode(@Param(value = "schedulerTaskLogId") String scheduleLogId, @Param(value = "code") String code);
}
