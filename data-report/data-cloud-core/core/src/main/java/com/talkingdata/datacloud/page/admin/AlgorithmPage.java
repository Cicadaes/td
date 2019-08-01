package com.talkingdata.datacloud.page.admin;

import org.apache.commons.lang.StringUtils;
import com.talkingdata.datacloud.base.page.BasePage;
import com.talkingdata.datacloud.util.DateUtil;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>机器学习模型 AlgorithmPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class AlgorithmPage extends BasePage {

	private Integer id;
	private String name;
	private String code;
	private Integer preHandleScriptId;
	private Integer handleScriptId;
	private Integer postHandleScriptId;
	private String handleType;
	private String type;
	private String description;
	private String createBy;
	private String creator;
	private String updateBy;
	private Date createTime;
	private Date updateTime;
	
	private String createTimeStart;
	private String createTimeEnd;

	private String[] tenants;
	
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

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
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

	public String getHandleType() {
		return handleType;
	}

	public void setHandleType(String handleType) {
		this.handleType = handleType;
	}

	public Integer getPreHandleScriptId() {
		return preHandleScriptId;
	}

	public void setPreHandleScriptId(Integer preHandleScriptId) {
		this.preHandleScriptId = preHandleScriptId;
	}

	public Integer getHandleScriptId() {
		return handleScriptId;
	}

	public void setHandleScriptId(Integer handleScriptId) {
		this.handleScriptId = handleScriptId;
	}

	public Integer getPostHandleScriptId() {
		return postHandleScriptId;
	}

	public void setPostHandleScriptId(Integer postHandleScriptId) {
		this.postHandleScriptId = postHandleScriptId;
	}

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
	
	public String getCreateTimeStart() {
		return createTimeStart;
	}

	public void setCreateTimeStart(String createTimeStart) {
		if (StringUtils.isNotEmpty(createTimeStart)) {
			this.createTimeStart = DateUtil.formatDate2NN(new Date(Long.valueOf(createTimeStart))) + " 00:00:00";
		} else {
			this.createTimeStart = createTimeStart;
		}
	}

	public String getCreateTimeEnd() {
		return createTimeEnd;
	}

	public void setCreateTimeEnd(String createTimeEnd) {
		if (StringUtils.isNotEmpty(createTimeEnd)) {
			this.createTimeEnd = DateUtil.formatDate2NN(new Date(Long.valueOf(createTimeEnd))) + " 23:59:59";
		} else {
			this.createTimeEnd = createTimeEnd;
		}
	}

	public String[] getTenants() {
		return tenants;
	}

	public void setTenants(String[] tenants) {
		this.tenants = tenants;
	}
	
}
