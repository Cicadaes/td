package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>应用偏好提升度 CityAppIntrestCountEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-10-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CityAppIntrestCount extends BaseEntity {

    private Integer id;
    private String cityName;
    private String runDate;
    private String tagName;
    private Integer metricValue;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCityName() {
        return this.cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getRunDate() {
        return this.runDate;
    }

    public void setRunDate(String runDate) {
        this.runDate = runDate;
    }

    public String getTagName() {
        return this.tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public Integer getMetricValue() {
        return this.metricValue;
    }

    public void setMetricValue(Integer metricValue) {
        this.metricValue = metricValue;
    }
}

