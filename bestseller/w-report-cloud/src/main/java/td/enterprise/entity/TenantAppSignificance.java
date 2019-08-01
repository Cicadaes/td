package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>App显著性计算 TenantAppSignificanceEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TenantAppSignificance extends BaseEntity {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer crowdId;
    private String runDate;
    private String platform;
    private String appHash;
    private String appProportion;
    private String cityAppProportion;
    private String significanceValue;
    private String appType;
    private Integer hour;
    private Integer cycleStatistics;
    private String startDate;
    private String endDate;
    private String appName;
    private String appIcon;
    private String typeId;
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

    public String getAppProportion() {
        return this.appProportion;
    }

    public void setAppProportion(String appProportion) {
        this.appProportion = appProportion;
    }

    public String getCityAppProportion() {
        return this.cityAppProportion;
    }

    public void setCityAppProportion(String cityAppProportion) {
        this.cityAppProportion = cityAppProportion;
    }

    public String getSignificanceValue() {
        return this.significanceValue;
    }

    public void setSignificanceValue(String significanceValue) {
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

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getAppIcon() {
        return appIcon;
    }

    public void setAppIcon(String appIcon) {
        this.appIcon = appIcon;
    }

    public String getTypeId() {
        return typeId;
    }

    public void setTypeId(String typeId) {
        this.typeId = typeId;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }
}

