package com.talkingdata.datacloud.entity.monitor;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>调度任务计算日志详情 CalcObjectLogDetailEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-02-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CalcObjectLogDetail extends BaseEntity {
	
	private Integer id;
	private Integer calcObjectLogId;
	private String content;
	private Date logTime;
	private String code;
	private String name;
	private Integer status;
	private Integer schedulerTaskLogId;
	

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getCalcObjectLogId() {
		return this.calcObjectLogId;
	}

	public void setCalcObjectLogId(Integer calcObjectLogId) {
		this.calcObjectLogId = calcObjectLogId;
	}

	public String getContent() {
		return this.content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getLogTime() {
		return this.logTime;
	}

	public void setLogTime(Date logTime) {
		this.logTime = logTime;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}


	public Integer getSchedulerTaskLogId() {
		return schedulerTaskLogId;
	}

	public void setSchedulerTaskLogId(Integer schedulerTaskLogId) {
		this.schedulerTaskLogId = schedulerTaskLogId;
	}
}

