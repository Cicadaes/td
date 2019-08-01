package td.enterprise.entity;

/**
 * <br>
 * <b>功能：</b>品牌信息 PoiBrandWifipixEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class PoiBrandWifipix extends BaseEntity {

    private Integer id;
    private String nameCn;
    private String nameEn;
    private String brandType;
    private String brandPosition;
    private String brandOrigin;
    private String firstBrand;
    private String secondBrand;
    private String brandClass;
    private String brandTag;
    private String ssid;
    private String match;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNameCn() {
        return this.nameCn;
    }

    public void setNameCn(String nameCn) {
        this.nameCn = nameCn;
    }

    public String getNameEn() {
        return this.nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public String getBrandType() {
        return this.brandType;
    }

    public void setBrandType(String brandType) {
        this.brandType = brandType;
    }

    public String getBrandPosition() {
        return this.brandPosition;
    }

    public void setBrandPosition(String brandPosition) {
        this.brandPosition = brandPosition;
    }

    public String getBrandOrigin() {
        return this.brandOrigin;
    }

    public void setBrandOrigin(String brandOrigin) {
        this.brandOrigin = brandOrigin;
    }

    public String getFirstBrand() {
        return this.firstBrand;
    }

    public void setFirstBrand(String firstBrand) {
        this.firstBrand = firstBrand;
    }

    public String getSecondBrand() {
        return this.secondBrand;
    }

    public void setSecondBrand(String secondBrand) {
        this.secondBrand = secondBrand;
    }

    public String getBrandClass() {
        return this.brandClass;
    }

    public void setBrandClass(String brandClass) {
        this.brandClass = brandClass;
    }

    public String getBrandTag() {
        return this.brandTag;
    }

    public void setBrandTag(String brandTag) {
        this.brandTag = brandTag;
    }

    public String getSsid() {
        return this.ssid;
    }

    public void setSsid(String ssid) {
        this.ssid = ssid;
    }

    public String getMatch() {
        return this.match;
    }

    public void setMatch(String match) {
        this.match = match;
    }
}

