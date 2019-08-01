package td.enterprise.entity;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>城市围栏 CityAoiEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-23 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class CityAoi extends BaseEntity {

    private Integer id;
    private String rating;
    private String tel;
    private String cityname;
    private String displayBrand;
    private String shapeRegion;
    private String address;
    private String poiId;
    private String name;
    private String adcode;
    private Double locationLat;
    private Double locationLng;
    private String templatedataTag;
    private String templatedataPrice;
    private String templatedataAoi;
    private Date addtime;
    private Date updatetime;
    private String areaType;
    private Double bd09LocationLat;
    private Double bd09LocationLng;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRating() {
        return this.rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getTel() {
        return this.tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getCityname() {
        return this.cityname;
    }

    public void setCityname(String cityname) {
        this.cityname = cityname;
    }

    public String getDisplayBrand() {
        return this.displayBrand;
    }

    public void setDisplayBrand(String displayBrand) {
        this.displayBrand = displayBrand;
    }

    public String getShapeRegion() {
        return this.shapeRegion;
    }

    public void setShapeRegion(String shapeRegion) {
        this.shapeRegion = shapeRegion;
    }

    public String getAddress() {
        return this.address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPoiId() {
        return this.poiId;
    }

    public void setPoiId(String poiId) {
        this.poiId = poiId;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAdcode() {
        return this.adcode;
    }

    public void setAdcode(String adcode) {
        this.adcode = adcode;
    }

    public Double getLocationLat() {
        return this.locationLat;
    }

    public void setLocationLat(Double locationLat) {
        this.locationLat = locationLat;
    }

    public Double getLocationLng() {
        return this.locationLng;
    }

    public void setLocationLng(Double locationLng) {
        this.locationLng = locationLng;
    }

    public String getTemplatedataTag() {
        return this.templatedataTag;
    }

    public void setTemplatedataTag(String templatedataTag) {
        this.templatedataTag = templatedataTag;
    }

    public String getTemplatedataPrice() {
        return this.templatedataPrice;
    }

    public void setTemplatedataPrice(String templatedataPrice) {
        this.templatedataPrice = templatedataPrice;
    }

    public String getTemplatedataAoi() {
        return this.templatedataAoi;
    }

    public void setTemplatedataAoi(String templatedataAoi) {
        this.templatedataAoi = templatedataAoi;
    }

    public Date getAddtime() {
        return this.addtime;
    }

    public void setAddtime(Date addtime) {
        this.addtime = addtime;
    }

    public Date getUpdatetime() {
        return this.updatetime;
    }

    public void setUpdatetime(Date updatetime) {
        this.updatetime = updatetime;
    }

    public String getAreaType() {
        return this.areaType;
    }

    public void setAreaType(String areaType) {
        this.areaType = areaType;
    }

    public Double getBd09LocationLat() {
        return this.bd09LocationLat;
    }

    public void setBd09LocationLat(Double bd09LocationLat) {
        this.bd09LocationLat = bd09LocationLat;
    }

    public Double getBd09LocationLng() {
        return this.bd09LocationLng;
    }

    public void setBd09LocationLng(Double bd09LocationLng) {
        this.bd09LocationLng = bd09LocationLng;
    }
}

