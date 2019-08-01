package com.talkingdata.datacloud.entity.monitor;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>调度任务计算日志 CalcObjectLogEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-02-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
public class CalcObjectLog extends BaseEntity {

	private Integer id;
	private Integer objectId;
	private String objectName;
	private String objectType;
	private Integer schedulerTaskLogId;
	private Integer azkabanExecutorId;
	private String execptionInfo;
	private String createBy;
	private String creator;
	private String updateBy;
	private Date createTime;
	private Date updateTime;
	private Date startTime;
	private Date endTime;
	private String objectCode;
	private Integer status;

	/**
	 * 租户id add by cmh 20160225
	 */
	private String dataAppId;
	private String tenantId;

	private String startTimeStart;
	private String startTimeEnd;
	private String endTimeStart;
	private String endTimeEnd;
	
	private String schedulerTaskName;//调度任务名
	private String schedulerTaskCode;//调度任务代码
	private String schedulerInputParam;//调度任务参数
	
	private String parentDesc;//分组使用，组信息说明：第1次重试，第2次重试......
	
	private List<CalcObjectLog> calcObjectLogList = new ArrayList<CalcObjectLog>();//相同azkabanExecutorId为一组

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getObjectId() {
		return this.objectId;
	}

	public void setObjectId(Integer objectId) {
		this.objectId = objectId;
	}

	public String getObjectName() {
		return this.objectName;
	}

	public void setObjectName(String objectName) {
		this.objectName = objectName;
	}

	public String getObjectType() {
		return this.objectType;
	}

	public void setObjectType(String objectType) {
		this.objectType = objectType;
	}

	public Integer getSchedulerTaskLogId() {
		return this.schedulerTaskLogId;
	}

	public void setSchedulerTaskLogId(Integer schedulerTaskLogId) {
		this.schedulerTaskLogId = schedulerTaskLogId;
	}

	public Integer getAzkabanExecutorId() {
		return this.azkabanExecutorId;
	}

	public void setAzkabanExecutorId(Integer azkabanExecutorId) {
		this.azkabanExecutorId = azkabanExecutorId;
	}

	public String getExecptionInfo() {
		return this.execptionInfo;
	}

	public void setExecptionInfo(String execptionInfo) {
		this.execptionInfo = execptionInfo;
	}

	public String getCreateBy() {
		return this.createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public String getCreator() {
		return this.creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getUpdateBy() {
		return this.updateBy;
	}

	public void setUpdateBy(String updateBy) {
		this.updateBy = updateBy;
	}

	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getUpdateTime() {
		return this.updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public Date getStartTime() {
		return this.startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return this.endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getObjectCode() {
		return objectCode;
	}

	public void setObjectCode(String objectCode) {
		this.objectCode = objectCode;
	}

	public Integer getStatus() {
		return this.status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getDataAppId() {
		return dataAppId;
	}

	public void setDataAppId(String dataAppId) {
		this.dataAppId = dataAppId;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public String getStartTimeStart() {
		return startTimeStart;
	}

	public void setStartTimeStart(String startTimeStart) {
		this.startTimeStart = startTimeStart;
	}

	public String getStartTimeEnd() {
		return startTimeEnd;
	}

	public void setStartTimeEnd(String startTimeEnd) {
		this.startTimeEnd = startTimeEnd;
	}

	public String getEndTimeStart() {
		return endTimeStart;
	}

	public void setEndTimeStart(String endTimeStart) {
		this.endTimeStart = endTimeStart;
	}

	public String getEndTimeEnd() {
		return endTimeEnd;
	}

	public void setEndTimeEnd(String endTimeEnd) {
		this.endTimeEnd = endTimeEnd;
	}

	public String getSchedulerTaskName() {
		return schedulerTaskName;
	}

	public void setSchedulerTaskName(String schedulerTaskName) {
		this.schedulerTaskName = schedulerTaskName;
	}

	public String getSchedulerTaskCode() {
		return schedulerTaskCode;
	}

	public void setSchedulerTaskCode(String schedulerTaskCode) {
		this.schedulerTaskCode = schedulerTaskCode;
	}

	public List<CalcObjectLog> getCalcObjectLogList() {
		return calcObjectLogList;
	}

	public void setCalcObjectLogList(List<CalcObjectLog> calcObjectLogList) {
		this.calcObjectLogList = calcObjectLogList;
	}

	public String getParentDesc() {
		return parentDesc;
	}

	public void setParentDesc(String parentDesc) {
		this.parentDesc = parentDesc;
	}

	public String getSchedulerInputParam() {
		return schedulerInputParam;
	}

	public void setSchedulerInputParam(String schedulerInputParam) {
		this.schedulerInputParam = schedulerInputParam;
	}
}
