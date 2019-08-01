package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>App去流行表 CityAppsPopularTopPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CityAppsPopularTopPage extends BasePage {

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

}
