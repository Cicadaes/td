package com.talkingdata.datacloud.visual.vo;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author fei.wang
 * @date 2016年12月13日
 */
public class Style {

	private Object data;
	private List<Parameter> parameters=new ArrayList<>();
	private Box box;


	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public void setParameters(List<Parameter> parameters) {
		this.parameters = parameters;
	}

	public List<Parameter> getParameters() {
		return parameters;
	}

	public Box getBox() {
		return box;
	}

	public void setBox(Box box) {
		this.box = box;
	}
}
