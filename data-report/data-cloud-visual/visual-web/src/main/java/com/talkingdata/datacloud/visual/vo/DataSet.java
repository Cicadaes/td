package com.talkingdata.datacloud.visual.vo;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author fei.wang
 * @date 2016年12月13日
 */
public class DataSet {

	private List<Parameter> parameters=new ArrayList<Parameter>();
	private DataSourceData data;

	public List<Parameter> getParameters() {
		return parameters;
	}

	public void setParameters(List<Parameter> parameters) {
		this.parameters = parameters;
	}

	public DataSourceData getData() {
		return data;
	}

	public void setData(DataSourceData data) {
		this.data = data;
	}
}
