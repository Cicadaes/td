package com.talkingdata.datacloud.page.monitor;

import org.apache.commons.lang.StringUtils;
import com.talkingdata.datacloud.base.page.BasePage;
import com.talkingdata.datacloud.util.DateUtil;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>调度任务 SchedulerTaskPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-02-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
public class SchedulerTaskPage extends BasePage {

	private Integer id;
	private String name;
	private String nameLike;
	private String code;
	private String azkabanProjectName;
	private String azkabanProjectNameLike;
	private Integer azkabanProjectId;
	private Integer azkabanProjectVersion;
	private String azkabanJobFlowId;
	private Integer azkabanJobFlowVersion;
	private Integer status;
	private String createBy;
	private String creator;
	private String creatorLike;
	private String updateBy;
	private Date createTime;
	private String createTime1;
	private String createTime2;
	private Date updateTime;
	private String systemCode;
	private String systemCodeLike;
	private String description;

	/**
	 * 租户id add by cmh 20160225
	 */
	private String dataAppId;
	private String tenantId;

	private String createTimeStart;
	private String createTimeEnd;
	
	private List<String> tenants = new ArrayList<String>();//查询使用，租户任务和跨租户任务

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

	public String getAzkabanProjectName() {
		return this.azkabanProjectName;
	}

	public void setAzkabanProjectName(String azkabanProjectName) {
		this.azkabanProjectName = azkabanProjectName;
	}

	public Integer getAzkabanProjectId() {
		return this.azkabanProjectId;
	}

	public void setAzkabanProjectId(Integer azkabanProjectId) {
		this.azkabanProjectId = azkabanProjectId;
	}

	public Integer getAzkabanProjectVersion() {
		return this.azkabanProjectVersion;
	}

	public void setAzkabanProjectVersion(Integer azkabanProjectVersion) {
		this.azkabanProjectVersion = azkabanProjectVersion;
	}

	public String getAzkabanJobFlowId() {
		return this.azkabanJobFlowId;
	}

	public void setAzkabanJobFlowId(String azkabanJobFlowId) {
		this.azkabanJobFlowId = azkabanJobFlowId;
	}

	public Integer getStatus() {
		return this.status;
	}

	public void setStatus(Integer status) {
		this.status = status;
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

	public Integer getAzkabanJobFlowVersion() {
		return azkabanJobFlowVersion;
	}

	public void setAzkabanJobFlowVersion(Integer azkabanJobFlowVersion) {
		this.azkabanJobFlowVersion = azkabanJobFlowVersion;
	}

	public String getDataAppId() {
		return dataAppId;
	}

	public void setDataAppId(String dataAppId) {
		this.dataAppId = dataAppId;
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

	public String getSystemCode() {
		return systemCode;
	}

	public void setSystemCode(String systemCode) {
		this.systemCode = systemCode;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<String> getTenants() {
		return tenants;
	}

	public void setTenants(List<String> tenants) {
		this.tenants = tenants;
	}

    public String getNameLike() {
        return nameLike;
    }

    public void setNameLike(String nameLike) {
        this.nameLike = nameLike;
    }

    public String getAzkabanProjectNameLike() {
        return azkabanProjectNameLike;
    }

    public void setAzkabanProjectNameLike(String azkabanProjectNameLike) {
        this.azkabanProjectNameLike = azkabanProjectNameLike;
    }

    public String getCreatorLike() {
        return creatorLike;
    }

    public void setCreatorLike(String creatorLike) {
        this.creatorLike = creatorLike;
    }

    public String getCreateTime1() {
        return createTime1;
    }

    public void setCreateTime1(String createTime1) {
        this.createTime1 = createTime1;
    }

    public String getCreateTime2() {
        return createTime2;
    }

    public void setCreateTime2(String createTime2) {
        this.createTime2 = createTime2;
    }

    public String getSystemCodeLike() {
        return systemCodeLike;
    }

    public void setSystemCodeLike(String systemCodeLike) {
        this.systemCodeLike = systemCodeLike;
    }
}
