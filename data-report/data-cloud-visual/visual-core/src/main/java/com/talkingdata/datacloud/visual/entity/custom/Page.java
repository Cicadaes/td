package com.talkingdata.datacloud.visual.entity.custom;

import java.util.ArrayList;
import java.util.List;

/**
 * @date 2016年12月13日
 */
public class Page {

	private Integer id;
	private String name;
	private Integer index;
	private String bgColor;
	private String bgImg;
	private Boolean customWH;
	private Integer width;
	private Integer height;
	private Integer customId;

	private List<Chart> charts = new ArrayList<Chart>();

	private List<ReportGroup> reportGroups = new ArrayList<ReportGroup>();

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getIndex() {
		return index;
	}

	public void setIndex(Integer index) {
		this.index = index;
	}

	public String getBgColor() {
		return bgColor;
	}

	public void setBgColor(String bgColor) {
		this.bgColor = bgColor;
	}

	public String getBgImg() {
		return bgImg;
	}

	public void setBgImg(String bgImg) {
		this.bgImg = bgImg;
	}

	public Boolean getCustomWH() {
		return customWH;
	}

	public void setCustomWH(Boolean customWH) {
		this.customWH = customWH;
	}

	public Integer getWidth() {
		return width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public Integer getCustomId() {
		return customId;
	}

	public void setCustomId(Integer customId) {
		this.customId = customId;
	}

	public List<Chart> getCharts() {
		return charts;
	}

	public void setCharts(List<Chart> charts) {
		this.charts = charts;
	}

	public List<ReportGroup> getReportGroups() {
		return reportGroups;
	}

	public void setReportGroups(List<ReportGroup> reportGroups) {
		this.reportGroups = reportGroups;
	}

}
