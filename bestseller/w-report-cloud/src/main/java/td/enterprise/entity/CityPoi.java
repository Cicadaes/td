package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>城市区域地理位置范围 CityPoiEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-19 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CityPoi extends BaseEntity {

    private Integer id;
    private String cityName;
    private String name;
    private String type;
    private String longitudeBd;
    private String latitudeBd;

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

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
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

}
