package td.enterprise.entity;


import java.lang.Integer;
import java.lang.String;

/**
 * 
 * <br>
 * <b>功能：</b>职住来源 TenantJobHousingCountEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-25 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantJobHousingCount extends BaseEntity {
	
	private Integer id;
	private String tenantId;
	private Integer projectId;
	private Integer crowdId;
	private String longitude;
	private String latitude;
	private String runDate;
	private Integer dayType;
	private Integer hour;
	private Integer hourType;
	private Integer metricValue;
	private Integer cycleStatistics;
	private String startDate;
	private String endDate;

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTenantId() {
		return this.tenantId;
	}

	public void setTenantId(String tenantId) {
		this.tenantId = tenantId;
	}

	public Integer getProjectId() {
		return this.projectId;
	}

	public void setProjectId(Integer projectId) {
		this.projectId = projectId;
	}

	public Integer getCrowdId() {
		return this.crowdId;
	}

	public void setCrowdId(Integer crowdId) {
		this.crowdId = crowdId;
	}

	public String getLongitude() {
		return this.longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getLatitude() {
		return this.latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String getRunDate() {
		return this.runDate;
	}

	public void setRunDate(String runDate) {
		this.runDate = runDate;
	}

	public Integer getDayType() {
		return this.dayType;
	}

	public void setDayType(Integer dayType) {
		this.dayType = dayType;
	}

	public Integer getHour() {
		return this.hour;
	}

	public void setHour(Integer hour) {
		this.hour = hour;
	}

	public Integer getHourType() {
		return this.hourType;
	}

	public void setHourType(Integer hourType) {
		this.hourType = hourType;
	}

	public Integer getMetricValue() {
		return this.metricValue;
	}

	public void setMetricValue(Integer metricValue) {
		this.metricValue = metricValue;
	}

	public Integer getCycleStatistics() {
		return this.cycleStatistics;
	}

	public void setCycleStatistics(Integer cycleStatistics) {
		this.cycleStatistics = cycleStatistics;
	}

	public String getStartDate() {
		return this.startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return this.endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
}

