package com.talkingdata.datacloud.entity.admin;

/** 
 * @description: 数据字典集合
 * @author: cmh  2015年7月14日
 * @version: 1.0
 * @modify: 
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DicItemColl {
	private String dicItemKey;
	private String dicItemValue;
	private Integer parentId;
	
	public String getDicItemKey() {
		return dicItemKey;
	}
	
	public void setDicItemKey(String dicItemKey) {
		this.dicItemKey = dicItemKey;
	}
	
	public String getDicItemValue() {
		return dicItemValue;
	}
	
	public void setDicItemValue(String dicItemValue) {
		this.dicItemValue = dicItemValue;
	}
	
	public Integer getParentId() {
		return parentId;
	}
	
	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}
	
	
}
