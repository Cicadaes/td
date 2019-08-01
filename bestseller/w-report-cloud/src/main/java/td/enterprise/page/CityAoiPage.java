package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>城市围栏 CityAoiPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-23 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CityAoiPage extends BasePage {

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

}
