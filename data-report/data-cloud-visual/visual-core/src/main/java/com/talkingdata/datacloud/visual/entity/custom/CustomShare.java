package com.talkingdata.datacloud.visual.entity.custom;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author fei.wang
 * @date 2016年12月13日
 */
public class CustomShare {

	private Integer id;
	private Integer customId;

	private ShareLink shareLink;
	private List<SharePool> sharePools = new ArrayList<SharePool>();
	private Dashboard dashboard;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getCustomId() {
		return customId;
	}

	public void setCustomId(Integer customId) {
		this.customId = customId;
	}

	public ShareLink getShareLink() {
		return shareLink;
	}

	public void setShareLink(ShareLink shareLink) {
		this.shareLink = shareLink;
	}

	public List<SharePool> getSharePools() {
		return sharePools;
	}

	public void setSharePools(List<SharePool> sharePools) {
		this.sharePools = sharePools;
	}

	public Dashboard getDashboard() {
		return dashboard;
	}

	public void setDashboard(Dashboard dashboard) {
		this.dashboard = dashboard;
	}

}
