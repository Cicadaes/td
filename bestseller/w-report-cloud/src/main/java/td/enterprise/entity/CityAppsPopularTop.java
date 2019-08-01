package td.enterprise.entity;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>App去流行表 CityAppsPopularTopEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CityAppsPopularTop extends BaseEntity {

    private Integer id;
    private String city;
    private String platform;
    private String appHash;
    private String activeHour;
    private Integer activeHourNumber;
    private Integer activeAllNumber;
    private Float activeProportion;
    private Date startDate;
    private Date endDate;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCity() {
        return this.city;
    }

    public void setCity(String city) {
        this.city = city;
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

    public String getActiveHour() {
        return this.activeHour;
    }

    public void setActiveHour(String activeHour) {
        this.activeHour = activeHour;
    }

    public Integer getActiveHourNumber() {
        return this.activeHourNumber;
    }

    public void setActiveHourNumber(Integer activeHourNumber) {
        this.activeHourNumber = activeHourNumber;
    }

    public Integer getActiveAllNumber() {
        return this.activeAllNumber;
    }

    public void setActiveAllNumber(Integer activeAllNumber) {
        this.activeAllNumber = activeAllNumber;
    }

    public Float getActiveProportion() {
        return this.activeProportion;
    }

    public void setActiveProportion(Float activeProportion) {
        this.activeProportion = activeProportion;
    }

    public Date getStartDate() {
        return this.startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return this.endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }


    @Override
    public boolean equals(Object obj) {
        if (null == obj)
            return false;
        if (this.getClass() != obj.getClass())
            return false;
        //根据app hash 和 platform 进行判断是相等
        String value1 = this.appHash + this.platform + this.activeHour;
        CityAppsPopularTop dest = (CityAppsPopularTop) obj;
        String value2 = dest.getAppHash() + dest.getPlatform() + dest.getActiveHour();
        return value1.equals(value2);
    }

    @Override
    public int hashCode() {
        String hash = this.appHash + this.platform + this.activeHour;
        return hash.hashCode();
    }
}

