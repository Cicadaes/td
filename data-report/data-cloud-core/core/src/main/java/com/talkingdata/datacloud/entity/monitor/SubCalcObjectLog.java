package com.talkingdata.datacloud.entity.monitor;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>子计算对象日志 SubCalcObjectLogEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-21 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
public class SubCalcObjectLog extends BaseEntity {

	private Integer id;
	private Integer calcObjectLogId;
	private Integer objectId;
	private String objectName;
	private String objectCode;
	private String objectType;
	private Integer schedulerTaskLogId;
	private Integer azkabanExecutorId;
	private String content;
	private String execptionInfo;
	private String createBy;
	private String creator;
	private String updateBy;
	private Date createTime;
	private Date updateTime;
	private Date startTime;
	private Date endTime;
	private Integer status;
	private String dataAppId;
	private String tenantId;
	private String verificationResult;

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

	public String getObjectCode() {
		return this.objectCode;
	}

	public void setObjectCode(String objectCode) {
		this.objectCode = objectCode;
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

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
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

	public Integer getStatus() {
		return this.status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public String getDataAppId() {
		return this.dataAppId;
	}

	public void setDataAppId(String dataAppId) {
		this.dataAppId = dataAppId;
	}

	public String getTenantId() {
		return this.tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public String getVerificationResult() {
		return verificationResult;
	}

	public void setVerificationResult(String verificationResult) {
		this.verificationResult = verificationResult;
	}
}
