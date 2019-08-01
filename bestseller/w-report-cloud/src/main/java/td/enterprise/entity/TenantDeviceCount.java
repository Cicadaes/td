package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>人群标签 TenantDeviceCountEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-08-11 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantDeviceCount implements Comparable<TenantDeviceCount> {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer crowdId;
    private String runDate;
    private Integer deviceAttrType;
    private String deviceAttrName;
    private Integer metricValue;
    private Integer cycleStatistics;
    private String startDate;
    private String endDate;

    public TenantDeviceCount() {
        super();
    }

    public TenantDeviceCount(String tenantId, Integer projectId,
                             Integer crowdId, String runDate, Integer cycleStatistics,
                             String startDate, String endDate) {
        super();
        this.tenantId = tenantId;
        this.projectId = projectId;
        this.crowdId = crowdId;
        this.runDate = runDate;
        this.cycleStatistics = cycleStatistics;
        this.startDate = startDate;
        this.endDate = endDate;
    }

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

    public Integer getDeviceAttrType() {
        return this.deviceAttrType;
    }

    public void setDeviceAttrType(Integer deviceAttrType) {
        this.deviceAttrType = deviceAttrType;
    }

    public String getDeviceAttrName() {
        return this.deviceAttrName;
    }

    public void setDeviceAttrName(String deviceAttrName) {
        this.deviceAttrName = deviceAttrName;
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

    public int compareTo(TenantDeviceCount o) {
        return this.getMetricValue() - o.getMetricValue();
    }


}

