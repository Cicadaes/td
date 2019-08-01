package com.talkingdata.datacloud.visual.entity.custom;

import com.talkingdata.datacloud.visual.util.JSONUtils;
import org.apache.commons.lang.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * 
 * @author fei.wang
 * @date 2016年12月13日
 */
public class ChartProperty {

	private Integer id;
	private String type;
	private String property;

	private Map<String, Object> propertyMap = new HashMap<String, Object>();

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getProperty() {
		return property;
	}

	@SuppressWarnings("unchecked")
	public void setProperty(String property) {
		this.property = property;
		if (StringUtils.isNotBlank(property)) {
			try {
				this.propertyMap = JSONUtils.readValueToBean(property, Map.class);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public Map<String, Object> getPropertyMap() {
		return propertyMap;
	}

	public void setPropertyMap(Map<String, Object> propertyMap) {
		this.propertyMap = propertyMap;
	}

}
