package com.talkingdata.datacloud.entity.admin;

import com.talkingdata.datacloud.base.entity.BaseEntity;

/**
 * 
 * <br>
 * <b>功能：</b>序列 SequenceSubEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class SequenceSub extends BaseEntity {
	
	private String seqSubName;
	private Integer currentValue;
	private Integer increment;
	private String remark;

	public String getSeqSubName() {
		return this.seqSubName;
	}

	public void setSeqSubName(String seqSubName) {
		this.seqSubName = seqSubName;
	}

	public Integer getCurrentValue() {
		return this.currentValue;
	}

	public void setCurrentValue(Integer currentValue) {
		this.currentValue = currentValue;
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

