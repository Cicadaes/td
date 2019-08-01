package com.talkingdata.datacloud.page.admin;

import org.apache.commons.lang.StringUtils;
import com.talkingdata.datacloud.base.page.BasePage;
import com.talkingdata.datacloud.util.DateUtil;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>系统的缓存信息 CacheinfoPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CacheinfoPage extends BasePage {

	private Integer id;
	private String cacheName;
	private Integer maxEntity;
	private Integer maxLiveTime;
	private String description;
	private String systemCode;
	private String createBy;
	private String creator;
	private String updateBy;
	private Date createTime;
	private Date updateTime;
	
	private String updateTimeStart;
	private String updateTimeEnd;

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getCacheName() {
		return this.cacheName;
	}

	public void setCacheName(String cacheName) {
		this.cacheName = cacheName;
	}

	public Integer getMaxEntity() {
		return this.maxEntity;
	}

	public void setMaxEntity(Integer maxEntity) {
		this.maxEntity = maxEntity;
	}

	public Integer getMaxLiveTime() {
		return this.maxLiveTime;
	}

	public void setMaxLiveTime(Integer maxLiveTime) {
		this.maxLiveTime = maxLiveTime;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getSystemCode() {
		return this.systemCode;
	}

	public void setSystemCode(String systemCode) {
		this.systemCode = systemCode;
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

	public String getUpdateTimeStart() {
		return updateTimeStart;
	}

	public void setUpdateTimeStart(String updateTimeStart) {
		if (StringUtils.isNotEmpty(updateTimeStart)) {
			this.updateTimeStart = DateUtil.formatDate2NN(new Date(Long.valueOf(updateTimeStart))) + " 00:00:00";
		} else {
			this.updateTimeStart = updateTimeStart;
		}
	}

	public String getUpdateTimeEnd() {
		return updateTimeEnd;
	}

	public void setUpdateTimeEnd(String updateTimeEnd) {
		if (StringUtils.isNotEmpty(updateTimeEnd)) {
			this.updateTimeEnd = DateUtil.formatDate2NN(new Date(Long.valueOf(updateTimeEnd))) + " 23:59:59";
		} else {
			this.updateTimeEnd = updateTimeEnd;
		}
	}
}
