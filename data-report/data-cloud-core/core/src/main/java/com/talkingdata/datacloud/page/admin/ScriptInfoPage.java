package com.talkingdata.datacloud.page.admin;

import org.apache.commons.lang.StringUtils;
import com.talkingdata.datacloud.base.page.BasePage;
import com.talkingdata.datacloud.util.DateUtil;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>脚本信息 ScriptInfoPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-08-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class ScriptInfoPage extends BasePage {

	private Integer id;
	private String scriptName;
	private String scriptCode;
	private String scriptPath;
	private String type;
	private String description;
	private String scriptInfoInterval;
	private String createBy;
	private String creator;
	private String updateBy;
	private Date createTime;
	private Date updateTime;

	private String createTimeStart;
	private String createTimeEnd;
	
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getScriptName() {
		return this.scriptName;
	}

	public void setScriptName(String scriptName) {
		this.scriptName = scriptName;
	}

	public String getScriptCode() {
		return this.scriptCode;
	}

	public void setScriptCode(String scriptCode) {
		this.scriptCode = scriptCode;
	}

	public String getScriptPath() {
		return this.scriptPath;
	}

	public void setScriptPath(String scriptPath) {
		this.scriptPath = scriptPath;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getScriptInfoInterval() {
		return this.scriptInfoInterval;
	}

	public void setScriptInfoInterval(String scriptInfoInterval) {
		this.scriptInfoInterval = scriptInfoInterval;
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
