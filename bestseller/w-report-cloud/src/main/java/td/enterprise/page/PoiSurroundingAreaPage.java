package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>区域来源 PoiSurroundingAreaPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-22 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class PoiSurroundingAreaPage extends BasePage {

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
}
