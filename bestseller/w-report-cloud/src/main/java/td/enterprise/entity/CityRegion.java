package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>城市区域地理位置范围 CityRegionEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-28 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CityRegion extends BaseEntity {

    private Integer id;
    private String cityName;
    private String regionName;
    private String regionType;
    private String longitudeBd;
    private String latitudeBd;
    private Integer orderNo;

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

}

