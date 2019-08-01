package com.talkingdata.datacloud.page.admin;

import com.talkingdata.datacloud.base.page.BasePage;

/**
 * 
 * <br>
 * <b>功能：</b>序列 SequenceSubPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class SequenceSubPage extends BasePage {

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
