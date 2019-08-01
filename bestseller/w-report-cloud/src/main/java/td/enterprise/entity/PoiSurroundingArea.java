package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>区域来源 PoiSurroundingAreaEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-22 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class PoiSurroundingArea extends BaseEntity {

    private String wid;
    private String loc;
    private String brandId;
    private Integer projectId;
    private String name;
    private String addressProvince;
    private String addressCity;
    private String addressDetail;
    private String addressDistrict;
    private String wgs84Lng;
    private String wgs84Lat;
    private String bd09Lng;
    private String bd09Lat;
    private String type;
    private String tenantId;

    public String getWid() {
        return this.wid;
    }

    public void setWid(String wid) {
        this.wid = wid;
    }

    public String getLoc() {
        return this.loc;
    }

    public void setLoc(String loc) {
        this.loc = loc;
    }

    public String getBrandId() {
        return this.brandId;
    }

    public void setBrandId(String brandId) {
        this.brandId = brandId;
    }

    public Integer getProjectId() {
        return this.projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddressProvince() {
        return this.addressProvince;
    }

    public void setAddressProvince(String addressProvince) {
        this.addressProvince = addressProvince;
    }

    public String getAddressCity() {
        return this.addressCity;
    }

    public void setAddressCity(String addressCity) {
        this.addressCity = addressCity;
    }

    public String getAddressDetail() {
        return this.addressDetail;
    }

    public void setAddressDetail(String addressDetail) {
        this.addressDetail = addressDetail;
    }

    public String getAddressDistrict() {
        return this.addressDistrict;
    }

    public void setAddressDistrict(String addressDistrict) {
        this.addressDistrict = addressDistrict;
    }

    public String getWgs84Lng() {
        return this.wgs84Lng;
    }

    public void setWgs84Lng(String wgs84Lng) {
        this.wgs84Lng = wgs84Lng;
    }

    public String getWgs84Lat() {
        return this.wgs84Lat;
    }

    public void setWgs84Lat(String wgs84Lat) {
        this.wgs84Lat = wgs84Lat;
    }

    public String getBd09Lng() {
        return this.bd09Lng;
    }

    public void setBd09Lng(String bd09Lng) {
        this.bd09Lng = bd09Lng;
    }

    public String getBd09Lat() {
        return this.bd09Lat;
    }

    public void setBd09Lat(String bd09Lat) {
        this.bd09Lat = bd09Lat;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTenantId() {
        return this.tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

}

