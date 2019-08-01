package td.enterprise.wanalytics.etl.bean;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>城市区域地理位置范围 CityRegionEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-28 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CityRegion  {

    private Integer id;
    private String cityName;
    private String regionName;
    private String regionType;
    private String longitudeBd;
    private String latitudeBd;
    private Integer orderNo;
    private String creator;
    private String createBy;
    private Date createTime;
    private String updater;
    private String updateBy;
    private Date updateTime;
    private String longitudeGoogle;
    private String latitudeGoogle;

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

    public String getRegionName() {
        return this.regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }

    public String getRegionType() {
        return this.regionType;
    }

    public void setRegionType(String regionType) {
        this.regionType = regionType;
    }

    public String getLongitudeBd() {
        return this.longitudeBd;
    }

    public void setLongitudeBd(String longitudeBd) {
        this.longitudeBd = longitudeBd;
    }

    public String getLatitudeBd() {
        return this.latitudeBd;
    }

    public void setLatitudeBd(String latitudeBd) {
        this.latitudeBd = latitudeBd;
    }

    public Integer getOrderNo() {
        return this.orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }

    public String getCreator() {
        return this.creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getCreateBy() {
        return this.createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public Date getCreateTime() {
        return this.createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getUpdater() {
        return this.updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Date getUpdateTime() {
        return this.updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getLongitudeGoogle() {
        return longitudeGoogle;
    }

    public void setLongitudeGoogle(String longitudeGoogle) {
        this.longitudeGoogle = longitudeGoogle;
    }

    public String getLatitudeGoogle() {
        return latitudeGoogle;
    }

    public void setLatitudeGoogle(String latitudeGoogle) {
        this.latitudeGoogle = latitudeGoogle;
    }
}

