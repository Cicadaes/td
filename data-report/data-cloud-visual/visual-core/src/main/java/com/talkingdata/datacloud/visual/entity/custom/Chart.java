package com.talkingdata.datacloud.visual.entity.custom;

/**
 *
 * @author fei.wang
 * @date 2016年12月13日
 */
public class Chart {

	private Integer id;
	private String index;
	private Integer sourceId;
	private Integer reportPropertyId;
	private Integer styleId;
	private Integer pageId;

	private Source source;
	private ChartProperty chartProperty;
	private Style style;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getIndex() {
		return index;
	}

	public void setIndex(String index) {
		this.index = index;
	}

	public Integer getSourceId() {
		return sourceId;
	}

	public void setSourceId(Integer sourceId) {
		this.sourceId = sourceId;
	}

	public Integer getReportPropertyId() {
		return reportPropertyId;
	}

	public void setReportPropertyId(Integer reportPropertyId) {
		this.reportPropertyId = reportPropertyId;
	}

	public Integer getStyleId() {
		return styleId;
	}

	public void setStyleId(Integer styleId) {
		this.styleId = styleId;
	}

	public Integer getPageId() {
		return pageId;
	}

	public void setPageId(Integer pageId) {
		this.pageId = pageId;
	}

	public Source getSource() {
		return source;
	}

	public void setSource(Source source) {
		this.source = source;
	}

	public ChartProperty getChartProperty() {
		return chartProperty;
	}

	public void setChartProperty(ChartProperty chartProperty) {
		this.chartProperty = chartProperty;
	}

	public Style getStyle() {
		return style;
	}

	public void setStyle(Style style) {
		this.style = style;
	}

}
