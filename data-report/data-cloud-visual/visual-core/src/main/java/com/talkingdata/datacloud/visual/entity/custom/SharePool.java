package com.talkingdata.datacloud.visual.entity.custom;

import java.util.Date;

/**
 * fei.wang 2017年3月9日
 */
public class SharePool {

	private Integer id;
	private String umid;
	private Integer customId;
	private Integer shareId;
	private Date createTime;
	private Date updateTime;

	private boolean selected;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUmid() {
		return umid;
	}

	public void setUmid(String umid) {
		this.umid = umid;
	}

	public Integer getCustomId() {
		return customId;
	}

	public void setCustomId(Integer customId) {
		this.customId = customId;
	}

	public Integer getShareId() {
		return shareId;
	}

	public void setShareId(Integer shareId) {
		this.shareId = shareId;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}

}
