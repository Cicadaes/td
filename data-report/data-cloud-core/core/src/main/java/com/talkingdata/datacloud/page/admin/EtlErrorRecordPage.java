package com.talkingdata.datacloud.page.admin;

import org.apache.commons.lang.StringUtils;
import com.talkingdata.datacloud.base.page.BasePage;
import com.talkingdata.datacloud.util.DateUtil;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>ETL错误记录 EtlErrorRecordPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-08-17 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class EtlErrorRecordPage extends BasePage {

	private Integer id;
	private String jobId;
	private String targetDate;
	private String className;
	private String tableName;
	private String categoryCode;
	private Integer errorCount;
	private Date runDate;
	private String createBy;
	private String creator;
	private String updateBy;
	private Date createTime;
	private Date updateTime;
	
	/**
	 * 租户id add by cmh 20160225 
	 */
	private String tenantId;
	
	private String runDateStart;
	private String runDateEnd;
	private String targetDateStart;
	private String targetDateEnd;

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getJobId() {
		return jobId;
	}

	public void setJobId(String jobId) {
		this.jobId = jobId;
	}

	public String getTargetDate() {
		return this.targetDate;
	}

	public void setTargetDate(String targetDate) {
		this.targetDate = targetDate;
	}

	public String getClassName() {
		return this.className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public String getTableName() {
		return this.tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getCategoryCode() {
		return this.categoryCode;
	}

	public void setCategoryCode(String categoryCode) {
		this.categoryCode = categoryCode;
	}

	public Integer getErrorCount() {
		return this.errorCount;
	}

	public void setErrorCount(Integer errorCount) {
		this.errorCount = errorCount;
	}

	public Date getRunDate() {
		return this.runDate;
	}

	public void setRunDate(Date runDate) {
		this.runDate = runDate;
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

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public String getRunDateStart() {
		return runDateStart;
	}

	public void setRunDateStart(String runDateStart) {
		if (StringUtils.isNotEmpty(runDateStart)) {
			this.runDateStart = DateUtil.formatDate2NN(new Date(Long.valueOf(runDateStart))) + " 00:00:00";
		} else {
			this.runDateStart = runDateStart;
		}
	}

	public String getRunDateEnd() {
		return runDateEnd;
	}

	public void setRunDateEnd(String runDateEnd) {
		if (StringUtils.isNotEmpty(runDateEnd)) {
			this.runDateEnd = DateUtil.formatDate2NN(new Date(Long.valueOf(runDateEnd))) + " 23:59:59";
		} else {
			this.runDateEnd = runDateEnd;
		}
	}

	public String getTargetDateStart() {
		return targetDateStart;
	}

	public void setTargetDateStart(String targetDateStart) {
		if (StringUtils.isNotEmpty(targetDateStart)) {
			this.targetDateStart = DateUtil.formatDate2NNEnhance(new Date(Long.valueOf(targetDateStart)));
		} else {
			this.targetDateStart = targetDateStart;
		}
	}

	public String getTargetDateEnd() {
		return targetDateEnd;
	}

	public void setTargetDateEnd(String targetDateEnd) {
		if (StringUtils.isNotEmpty(targetDateEnd)) {
			this.targetDateEnd = DateUtil.formatDate2NNEnhance(new Date(Long.valueOf(targetDateEnd)));
		} else {
			this.targetDateEnd = targetDateEnd;
		}
	}
}
