package com.talkingdata.datacloud.entity;

import java.util.Date;

public class AzkabanContext {
	
	private Integer status;//azkaban状态，运行中，结束，异常，超时  AzkabanConstants.AzkabanCalcStatusConstants
	private Date startTime;
	private Date endTime;
	private String errorInfo;
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public Date getStartTime() {
		return startTime;
	}
	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}
	public Date getEndTime() {
		return endTime;
	}
	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	public String getErrorInfo() {
		return errorInfo;
	}
	public void setErrorInfo(String errorInfo) {
		this.errorInfo = errorInfo;
	}

}
