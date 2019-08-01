package com.talkingdata.datacloud.visual.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * 
 * @author fei.wang
 * @date 2016年12月13日
 */
public class Chart {

	private Integer id;
	private String uuid;
	private Integer type;
	private Integer dataSourceId;
	private Style style;
	private DataSource dataSource;
	private Integer styleConfigDefinitionId;
	private Integer dataSourceConfigDefinitionId;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

//	public String getStyle() {
//		try{
//			return JSONUtils.writeValueAsString(style);
//		}catch (Exception e){
//			e.printStackTrace();
//		}
//		return null;
//	}
	public Style getStyle() {
	return style;
}

	@JsonIgnore
	public Style getStyle2() {
		return style;
	}

	public void setStyle(Style style) {
		this.style = style;
	}

//	public String getDataSource() {
//		try{
//			return JSONUtils.writeValueAsString(dataSource);
//		}catch (Exception e){
//			e.printStackTrace();
//		}
//		return null;
//	}
	public DataSource getDataSource() {
	return dataSource;
}

	@JsonIgnore
	public DataSource getDataSource2() {
		return dataSource;
	}

	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	public Integer getStyleConfigDefinitionId() {
		return styleConfigDefinitionId;
	}

	public void setStyleConfigDefinitionId(Integer styleConfigDefinitionId) {
		this.styleConfigDefinitionId = styleConfigDefinitionId;
	}

	public Integer getDataSourceConfigDefinitionId() {
		return dataSourceConfigDefinitionId;
	}

	public void setDataSourceConfigDefinitionId(Integer dataSourceConfigDefinitionId) {
		this.dataSourceConfigDefinitionId = dataSourceConfigDefinitionId;
	}

	public Integer getDataSourceId() {
		return dataSourceId;
	}

	public void setDataSourceId(Integer dataSourceId) {
		this.dataSourceId = dataSourceId;
	}
}
