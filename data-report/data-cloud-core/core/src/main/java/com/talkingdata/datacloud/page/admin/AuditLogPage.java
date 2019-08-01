package com.talkingdata.datacloud.page.admin;

import org.apache.commons.lang.StringUtils;
import com.talkingdata.datacloud.base.page.BasePage;
import com.talkingdata.datacloud.util.DateUtil;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>审计日志表 AuditLogPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-09-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class AuditLogPage extends BasePage {

	private Integer id;
	private String systemCode;
	private Date createTime;
	private String actorUmId;
	private String actorName;
	private String operationType;
	private String targetType;
	private String targetId;
	private String result;
	private String description;

	private String createTimeStart;
	private String createTimeEnd;
	
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getSystemCode() {
		return this.systemCode;
	}

	public void setSystemCode(String systemCode) {
		this.systemCode = systemCode;
	}

	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getActorUmId() {
		return this.actorUmId;
	}

	public void setActorUmId(String actorUmId) {
		this.actorUmId = actorUmId;
	}

	public String getActorName() {
		return this.actorName;
	}

	public void setActorName(String actorName) {
		this.actorName = actorName;
	}

	public String getOperationType() {
		return this.operationType;
	}

	public void setOperationType(String operationType) {
		this.operationType = operationType;
	}

	public String getTargetType() {
		return this.targetType;
	}

	public void setTargetType(String targetType) {
		this.targetType = targetType;
	}

	public String getTargetId() {
		return this.targetId;
	}

	public void setTargetId(String targetId) {
		this.targetId = targetId;
	}

	public String getResult() {
		return this.result;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getCreateTimeStart() {
		return createTimeStart;
	}

	public void setCreateTimeStart(String createTimeStart) {
		if(StringUtils.isNotEmpty(createTimeStart)){
			this.createTimeStart = DateUtil.formatDate2NN(new Date(Long.valueOf(createTimeStart))) + " 00:00:00";
		}else{
			this.createTimeStart = createTimeStart;
		}
	}

	public String getCreateTimeEnd() {
		return createTimeEnd;
	}

	public void setCreateTimeEnd(String createTimeEnd) {
		if(StringUtils.isNotEmpty(createTimeEnd)){
			this.createTimeEnd = DateUtil.formatDate2NN(new Date(Long.valueOf(createTimeEnd))) + " 23:59:59";
		}else{
			this.createTimeEnd = createTimeEnd;
		}
	}
}
