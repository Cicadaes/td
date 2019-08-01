package com.talkingdata.datacloud.page.monitor;

import org.apache.commons.lang.StringUtils;
import com.talkingdata.datacloud.base.page.BasePage;
import com.talkingdata.datacloud.util.DateUtil;

import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>调度任务计算日志 CalcObjectLogPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-02-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co.,
 * Ltd.<br>
 */
public class CalcObjectLogPage extends BasePage {

	private Integer id;
	private Integer objectId;
	private String objectName;
	private String objectType;
	private Integer schedulerTaskLogId;
	private Integer azkabanExecutorId;
	private String execptionInfo;
	private String createBy;
	private String creator;
	private String updateBy;
	private Date createTime;
	private Date updateTime;
	private Date startTime;
	private Date endTime;
	private String objectCode;
	private Integer status;

	/**
	 * 租户id add by cmh 20160225
	 */
	private String dataAppId;
	private String tenantId;

	private String startTimeStart;
	private String startTimeEnd;
	private String endTimeStart;
	private String endTimeEnd;
	private Integer schedulerTaskId;
	private String schedulerTaskCode;//调度任务代码
	
    private String objectNameLike;
    private String objectTypeLike;
    private String creatorLike;
    private String schedulerTaskNameLike; // t.name
    private String startTime1;
    private String startTime2;
    private String endTime1;
    private String endTime2;

    public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getObjectId() {
		return this.objectId;
	}

	public void setObjectId(Integer objectId) {
		this.objectId = objectId;
	}

	public String getObjectName() {
		return this.objectName;
	}

	public void setObjectName(String objectName) {
		this.objectName = objectName;
	}

	public String getObjectType() {
		return this.objectType;
	}

	public void setObjectType(String objectType) {
		this.objectType = objectType;
	}

	public Integer getSchedulerTaskLogId() {
		return this.schedulerTaskLogId;
	}

	public void setSchedulerTaskLogId(Integer schedulerTaskLogId) {
		this.schedulerTaskLogId = schedulerTaskLogId;
	}

	public Integer getAzkabanExecutorId() {
		return this.azkabanExecutorId;
	}

	public void setAzkabanExecutorId(Integer azkabanExecutorId) {
		this.azkabanExecutorId = azkabanExecutorId;
	}

	public String getExecptionInfo() {
		return this.execptionInfo;
	}

	public void setExecptionInfo(String execptionInfo) {
		this.execptionInfo = execptionInfo;
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

	public Date getStartTime() {
		return this.startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return this.endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getObjectCode() {
		return objectCode;
	}

	public void setObjectCode(String objectCode) {
		this.objectCode = objectCode;
	}

	public Integer getStatus() {
		return this.status;
	}

	public void setStatus(Integer status) {
		this.status = status;
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

	public String getStartTimeStart() {
		return startTimeStart;
	}

	public void setStartTimeStart(String startTimeStart) {
		if (StringUtils.isNotEmpty(startTimeStart)) {
			this.startTimeStart = DateUtil.formatDate2NN(new Date(Long.valueOf(startTimeStart))) + " 00:00:00";
		} else {
			this.startTimeStart = startTimeStart;
		}
	}

	public String getStartTimeEnd() {
		return startTimeEnd;
	}

	public void setStartTimeEnd(String startTimeEnd) {
		if (StringUtils.isNotEmpty(startTimeEnd)) {
			this.startTimeEnd = DateUtil.formatDate2NN(new Date(Long.valueOf(startTimeEnd))) + " 23:59:59";
		} else {
			this.startTimeEnd = startTimeEnd;
		}
	}

	public String getEndTimeStart() {
		return endTimeStart;
	}

	public void setEndTimeStart(String endTimeStart) {
		if (StringUtils.isNotEmpty(endTimeStart)) {
			this.endTimeStart = DateUtil.formatDate2NN(new Date(Long.valueOf(endTimeStart))) + " 00:00:00";
		} else {
			this.endTimeStart = endTimeStart;
		}

	}

	public String getEndTimeEnd() {
		return endTimeEnd;
	}

	public void setEndTimeEnd(String endTimeEnd) {
		if (StringUtils.isNotEmpty(endTimeEnd)) {
			this.endTimeEnd = DateUtil.formatDate2NN(new Date(Long.valueOf(endTimeEnd))) + " 23:59:59";
		} else {
			this.endTimeEnd = endTimeEnd;
		}
	}

	public Integer getSchedulerTaskId() {
		return schedulerTaskId;
	}

	public void setSchedulerTaskId(Integer schedulerTaskId) {
		this.schedulerTaskId = schedulerTaskId;
	}

	public String getSchedulerTaskCode() {
		return schedulerTaskCode;
	}

	public void setSchedulerTaskCode(String schedulerTaskCode) {
		this.schedulerTaskCode = schedulerTaskCode;
	}

    public String getObjectNameLike() {
        return objectNameLike;
    }

    public void setObjectNameLike(String objectNameLike) {
        this.objectNameLike = objectNameLike;
    }

    public String getObjectTypeLike() {
        return objectTypeLike;
    }

    public void setObjectTypeLike(String objectTypeLike) {
        this.objectTypeLike = objectTypeLike;
    }

    public String getCreatorLike() {
        return creatorLike;
    }

    public void setCreatorLike(String creatorLike) {
        this.creatorLike = creatorLike;
    }

    public String getSchedulerTaskNameLike() {
        return schedulerTaskNameLike;
    }

    public void setSchedulerTaskNameLike(String schedulerTaskNameLike) {
        this.schedulerTaskNameLike = schedulerTaskNameLike;
    }

    public String getStartTime1() {
        return startTime1;
    }

    public void setStartTime1(String startTime1) {
        this.startTime1 = startTime1;
    }

    public String getStartTime2() {
        return startTime2;
    }

    public void setStartTime2(String startTime2) {
        this.startTime2 = startTime2;
    }

    public String getEndTime1() {
        return endTime1;
    }

    public void setEndTime1(String endTime1) {
        this.endTime1 = endTime1;
    }

    public String getEndTime2() {
        return endTime2;
    }

    public void setEndTime2(String endTime2) {
        this.endTime2 = endTime2;
    }
	
}
