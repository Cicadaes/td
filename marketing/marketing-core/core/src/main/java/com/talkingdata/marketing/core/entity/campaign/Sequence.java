package com.talkingdata.marketing.core.entity.campaign;


import com.talkingdata.enterprise.base.entity.BaseEntity;

/**
 * 
 * <br>
 * <b>功能：</b>序列 SequenceEntity<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2015-07-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class Sequence extends BaseEntity {
	
	private String seqName;
	private Integer currentValue;
	private String currentDay;
	private Integer increment;
	private String remark;
	private Long currentTime;

	public Long getCurrentTime() {
		return currentTime;
	}

	public void setCurrentTime(Long currentTime) {
		this.currentTime = currentTime;
	}

	public String getSeqName() {
		return this.seqName;
	}

	public void setSeqName(String seqName) {
		this.seqName = seqName;
	}

	public Integer getCurrentValue() {
		return this.currentValue;
	}

	public void setCurrentValue(Integer currentValue) {
		this.currentValue = currentValue;
	}

	public String getCurrentDay() {
		return this.currentDay;
	}

	public void setCurrentDay(String currentDay) {
		this.currentDay = currentDay;
	}

	public Integer getIncrement() {
		return this.increment;
	}

	public void setIncrement(Integer increment) {
		this.increment = increment;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
}

