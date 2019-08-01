package com.talkingdata.datacloud.entity.admin;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>ETL规则属性定义 EtlRuleAttributeDefinitionEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-08-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class EtlRuleAttributeDefinition extends BaseEntity {
	
	private Integer id;
	private Integer ruleDefId;
	private String code;
	private String name;
	private String valueType;
	private String dictionary;
	private String description;
	private String createBy;
	private String creator;
	private String updateBy;
	private Date createTime;
	private Date updateTime;

	/**
	 * 租户id add by cmh 20160225 
	 */
	private String tenantId;
	
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getRuleDefId() {
		return this.ruleDefId;
	}

	public void setRuleDefId(Integer ruleDefId) {
		this.ruleDefId = ruleDefId;
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValueType() {
		return this.valueType;
	}

	public void setValueType(String valueType) {
		this.valueType = valueType;
	}

	public String getDictionary() {
		return this.dictionary;
	}

	public void setDictionary(String dictionary) {
		this.dictionary = dictionary;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCreateBy() {
		return this.createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public String getCreator() {
		return this.creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getUpdateBy() {
		return this.updateBy;
	}

	public void setUpdateBy(String updateBy) {
		this.updateBy = updateBy;
	}

	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getUpdateTime() {
		return this.updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
	
	
}

