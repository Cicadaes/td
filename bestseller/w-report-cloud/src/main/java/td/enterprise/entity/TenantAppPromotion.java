package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>App提升度计算 TenantAppPromotionEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-23 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantAppPromotion extends BaseEntity {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer crowdId;
    private String runDate;
    private String platform;
    private String appHash;
    private String activeHourNumber;
    private String activeAllNumber;
    private String activeProportion;
    private String activeCityProportion;
    private Float significanceValue;
    private String appType;
    private Integer hour;
    private Integer cycleStatistics;
    private String startDate;
    private String endDate;
    private Integer typeId;
    private String typeName;

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

    public String getPlatform() {
        return this.platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getAppHash() {
        return this.appHash;
    }

    public void setAppHash(String appHash) {
        this.appHash = appHash;
    }

    public String getActiveHourNumber() {
        return this.activeHourNumber;
    }

    public void setActiveHourNumber(String activeHourNumber) {
        this.activeHourNumber = activeHourNumber;
    }

    public String getActiveAllNumber() {
        return this.activeAllNumber;
    }

    public void setActiveAllNumber(String activeAllNumber) {
        this.activeAllNumber = activeAllNumber;
    }

    public String getActiveProportion() {
        return this.activeProportion;
    }

    public void setActiveProportion(String activeProportion) {
        this.activeProportion = activeProportion;
    }

    public String getActiveCityProportion() {
        return this.activeCityProportion;
    }

    public void setActiveCityProportion(String activeCityProportion) {
        this.activeCityProportion = activeCityProportion;
    }

    public Float getSignificanceValue() {
        return this.significanceValue;
    }

    public void setSignificanceValue(Float significanceValue) {
        this.significanceValue = significanceValue;
    }

    public String getAppType() {
        return this.appType;
    }

    public void setAppType(String appType) {
        this.appType = appType;
    }

    public Integer getHour() {
        return this.hour;
    }

    public void setHour(Integer hour) {
        this.hour = hour;
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

    public Integer getTypeId() {
        return this.typeId;
    }

    public void setTypeId(Integer typeId) {
        this.typeId = typeId;
    }

    public String getTypeName() {
        return this.typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }
}

