package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>TopN小区 TenantTopAreaCountEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-23 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantTopAreaCount extends BaseEntity {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer crowdId;
    private String runDate;
    private Integer areaType;
    private Integer metricValue;
    private Integer cycleStatistics;
    private String startDate;
    private String endDate;
    private String areaName;

    private long metricTotal; //总数
    private String metricPercent;//百分比

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

    public String getRunDate() {
        return this.runDate;
    }

    public void setRunDate(String runDate) {
        this.runDate = runDate;
    }

    public Integer getAreaType() {
        return this.areaType;
    }

    public void setAreaType(Integer areaType) {
        this.areaType = areaType;
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

    public String getAreaName() {
        return this.areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public long getMetricTotal() {
        return metricTotal;
    }

    public void setMetricTotal(long metricTotal) {
        this.metricTotal = metricTotal;
    }

    public String getMetricPercent() {
        return metricPercent;
    }

    public void setMetricPercent(String metricPercent) {
        this.metricPercent = metricPercent;
    }


}

