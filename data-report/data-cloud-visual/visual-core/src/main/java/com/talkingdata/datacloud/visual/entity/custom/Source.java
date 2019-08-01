package com.talkingdata.datacloud.visual.entity.custom;

import com.talkingdata.datacloud.visual.util.JSONUtils;
import org.apache.commons.lang.StringUtils;

import java.util.Map;

/**
 * 
 * @author fei.wang
 * @date 2016年12月13日
 */
public class Source {

	private Integer id;
	private Integer dataSourceId;
	private String params;
	
	private Map<String, Object> paramsMap;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getDataSourceId() {
		return dataSourceId;
	}

	public void setDataSourceId(Integer dataSourceId) {
		this.dataSourceId = dataSourceId;
	}

	public String getParams() {
		return params;
	}

	public void setParams(String params) throws Exception {
		this.params = params;
		if (StringUtils.isNotBlank(params)) {
			this.paramsMap = JSONUtils.readValueToMap(params);
		}
	}
	
	public Map<String, Object> getParamsMap() {
		return paramsMap;
	}

	public void setParamsMap(Map<String, Object> paramsMap) {
		this.paramsMap = paramsMap;
	}
}
