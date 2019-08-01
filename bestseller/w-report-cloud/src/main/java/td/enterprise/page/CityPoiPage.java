package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>城市区域地理位置范围 CityPoiPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-19 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CityPoiPage extends BasePage {

    private Integer id;
    private String cityName;
    private String name;
    private String type;
    private String longitudeBd;
    private String latitudeBd;
}
