package td.enterprise.entity;


import java.lang.Integer;
import java.lang.String;
import java.lang.Boolean;
import java.util.Date;

/**
 * 
 * <br>
 * <b>功能：</b>相似人群 LookalikeCrowdEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-09-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class LookalikeCrowd extends BaseEntity {
	
	private Integer id;
	private String crowdName;  //人群名称（自定义）
	private String execId;  //azkaban任务id
	private Integer predictNum;
	private String predictRate;
	private String seedType;
	private Integer seedCrowdId;
	private String seedCrowdName;
	private Integer seedCrowdNum;
	private String seedCrowdStartDate;
	private String seedCrowdEndDate;
	private Integer isExcludeSeedCrowd;
	private Boolean isExcludeSeedCrowdBoolean;
	private Integer status;
	private Integer calcStatus;
	private String projectCityName;
	private Integer projectId;
	private String tenantId;
	private Date updateDataTime;
	private String createBy;
	private String creator;
	private String updateBy;
	private Date createTime;
	private Date updateTime;
	private Integer newSeedCrowdNum;  //扩展后客群数量
	private String fromTable;  //数据来自于 
	
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getPredictNum() {
		return this.predictNum;
	}

	public void setPredictNum(Integer predictNum) {
		this.predictNum = predictNum;
	}

	public String getPredictRate() {
		return this.predictRate;
	}

	public void setPredictRate(String predictRate) {
		this.predictRate = predictRate;
	}

	public String getSeedType() {
		return this.seedType;
	}

	public void setSeedType(String seedType) {
		this.seedType = seedType;
	}

	public Integer getSeedCrowdId() {
		return this.seedCrowdId;
	}

	public void setSeedCrowdId(Integer seedCrowdId) {
		this.seedCrowdId = seedCrowdId;
	}

	public String getSeedCrowdName() {
		return this.seedCrowdName;
	}

	public void setSeedCrowdName(String seedCrowdName) {
		this.seedCrowdName = seedCrowdName;
	}

	public Integer getSeedCrowdNum() {
		return this.seedCrowdNum;
	}

	public void setSeedCrowdNum(Integer seedCrowdNum) {
		this.seedCrowdNum = seedCrowdNum;
	}

	public String getSeedCrowdStartDate() {
		return this.seedCrowdStartDate;
	}

	public void setSeedCrowdStartDate(String seedCrowdStartDate) {
		this.seedCrowdStartDate = seedCrowdStartDate;
	}

	public String getSeedCrowdEndDate() {
		return this.seedCrowdEndDate;
	}

	public void setSeedCrowdEndDate(String seedCrowdEndDate) {
		this.seedCrowdEndDate = seedCrowdEndDate;
	}

	public Integer getIsExcludeSeedCrowd() {
		return this.isExcludeSeedCrowd;
	}

	public void setIsExcludeSeedCrowd(Integer isExcludeSeedCrowd) {
		this.isExcludeSeedCrowd = isExcludeSeedCrowd;
	}

	public Integer getStatus() {
		return this.status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Integer getCalcStatus() {
		return this.calcStatus;
	}

	public void setCalcStatus(Integer calcStatus) {
		this.calcStatus = calcStatus;
	}

	public String getProjectCityName() {
		return this.projectCityName;
	}

	public void setProjectCityName(String projectCityName) {
		this.projectCityName = projectCityName;
	}

	public Integer getProjectId() {
		return this.projectId;
	}

	public void setProjectId(Integer projectId) {
		this.projectId = projectId;
	}

	public String getTenantId() {
		return this.tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public Date getUpdateDataTime() {
		return this.updateDataTime;
	}

	public void setUpdateDataTime(Date updateDataTime) {
		this.updateDataTime = updateDataTime;
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

	public String getCrowdName() {
		return crowdName;
	}

	public void setCrowdName(String crowdName) {
		this.crowdName = crowdName;
	}

	public Boolean getIsExcludeSeedCrowdBoolean() {
		return isExcludeSeedCrowdBoolean;
	}

	public void setIsExcludeSeedCrowdBoolean(Boolean isExcludeSeedCrowdBoolean) {
		this.isExcludeSeedCrowdBoolean = isExcludeSeedCrowdBoolean;
	}

	public String getExecId() {
		return execId;
	}

	public void setExecId(String execId) {
		this.execId = execId;
	}

	public Integer getNewSeedCrowdNum() {
		return newSeedCrowdNum;
	}

	public void setNewSeedCrowdNum(Integer newSeedCrowdNum) {
		this.newSeedCrowdNum = newSeedCrowdNum;
	}

	public String getFromTable() {
		return fromTable;
	}

	public void setFromTable(String fromTable) {
		this.fromTable = fromTable;
	}
}

