package com.talkingdata.datacloud.visual.entity.custom;

import org.apache.commons.lang.StringUtils;

import java.util.Arrays;
import java.util.List;

public class ReportGroup {

	private Integer id;
	private Integer pageId;
	private String reportId;
	private List<String> reportIds;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getPageId() {
		return pageId;
	}

	public void setPageId(Integer pageId) {
		this.pageId = pageId;
	}

	public String getReportId() {
		return reportId;
	}

	public void setReportId(String reportId) {
		this.reportId = reportId;
		if (StringUtils.isNotBlank(reportId)) {
			String[] split = reportId.split(",");
			reportIds = Arrays.asList(split);
		}
	}

	public List<String> getReportIds() {
		return reportIds;
	}

	public void setReportIds(List<String> reportIds) {
		this.reportIds = reportIds;
	}

}
