package td.enterprise.wanalytics.etl.task.position;


public class ProjectAreaTopN {
   
	private String projectId; //案场
	private String longtitude ;  //经度 原始值
	private String latitude;     //维度 
	private String metricValue;
	private String startDate;//yyyy-MM-dd  统计开始日期 
	private String endDate; //统计结束日期
	private String cycleStatistics;//统计周期
	
	private String tenantId ;//租户ID
	private String  crowdId;//人群ID
	private String runDate ;//运行日期
	
	private String areaName; // 区域名称
	private String areaType ;// 区域类型
	
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getLongtitude() {
		return longtitude;
	}
	public void setLongtitude(String longtitude) {
		this.longtitude = longtitude;
	}
	public String getLatitude() {
		return latitude;
	}
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	public String getMetricValue() {
		return metricValue;
	}
	public void setMetricValue(String metricValue) {
		this.metricValue = metricValue;
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
	public String getCycleStatistics() {
		return cycleStatistics;
	}
	public void setCycleStatistics(String cycleStatistics) {
		this.cycleStatistics = cycleStatistics;
	}
	public String getTenantId() {
		return tenantId;
	}
	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}
	public String getCrowdId() {
		return crowdId;
	}
	public void setCrowdId(String crowdId) {
		this.crowdId = crowdId;
	}
	public String getRunDate() {
		return runDate;
	}
	public void setRunDate(String runDate) {
		this.runDate = runDate;
	}
	public String getAreaName() {
		return areaName;
	}
	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}
	public String getAreaType() {
		return areaType;
	}
	public void setAreaType(String areaType) {
		this.areaType = areaType;
	}
}
