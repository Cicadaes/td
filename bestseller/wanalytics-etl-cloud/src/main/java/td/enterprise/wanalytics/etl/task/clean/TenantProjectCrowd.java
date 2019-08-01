package td.enterprise.wanalytics.etl.task.clean;

/**
 * 保存中间结果
 * 
 * @author junmin.li
 *
 */
public class TenantProjectCrowd {
	private String tenantId;
	private int projectId;
	private String crowdId;
	private int cycleStatistics;
	private String runDate ;
	private String startDate;
	private String endDate;
	private String crowdType;

	public String getTenantId() {
		return tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public int getProjectId() {
		return projectId;
	}

	public void setProjectId(int projectId) {
		this.projectId = projectId;
	}

	public String getCrowdId() {
		return crowdId;
	}

	public void setCrowdId(String crowdId) {
		this.crowdId = crowdId;
	}

	public int getCycleStatistics() {
		return cycleStatistics;
	}

	public void setCycleStatistics(int cycleStatistics) {
		this.cycleStatistics = cycleStatistics;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getRunDate() {
		return runDate;
	}

	public void setRunDate(String runDate) {
		this.runDate = runDate;
	}

	public String getCrowdType() {
		return crowdType;
	}

	public void setCrowdType(String crowdType) {
		this.crowdType = crowdType;
	}

}
