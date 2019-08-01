package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>竞品关联度指标 TenantCorrelationCountEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-12-16 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantCorrelationCount extends BaseEntity {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer crowdId;
    private Integer activeCount;
    private Integer compareProjectId;
    private Integer compareCrowdId;
    private Integer compareActiveCount;
    private Integer commonCount;
    private Integer cycleStatistics;
    private String runDate;
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

    public Integer getActiveCount() {
        return this.activeCount;
    }

    public void setActiveCount(Integer activeCount) {
        this.activeCount = activeCount;
    }

    public Integer getCompareProjectId() {
        return this.compareProjectId;
    }

    public void setCompareProjectId(Integer compareProjectId) {
        this.compareProjectId = compareProjectId;
    }

    public Integer getCompareCrowdId() {
        return this.compareCrowdId;
    }

    public void setCompareCrowdId(Integer compareCrowdId) {
        this.compareCrowdId = compareCrowdId;
    }

    public Integer getCompareActiveCount() {
        return this.compareActiveCount;
    }

    public void setCompareActiveCount(Integer compareActiveCount) {
        this.compareActiveCount = compareActiveCount;
    }

    public Integer getCommonCount() {
        return this.commonCount;
    }

    public void setCommonCount(Integer commonCount) {
        this.commonCount = commonCount;
    }

    public Integer getCycleStatistics() {
        return this.cycleStatistics;
    }

    public void setCycleStatistics(Integer cycleStatistics) {
        this.cycleStatistics = cycleStatistics;
    }

    public String getRunDate() {
        return this.runDate;
    }

    public void setRunDate(String runDate) {
        this.runDate = runDate;
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

