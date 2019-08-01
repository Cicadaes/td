package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>应用偏好提升度 CityAppIntrestCountEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-10-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class CityAppIntrestCount extends BaseEntity {

    private Integer id;
    private String cityName;
    private String runDate;
    private String tagName;
    private Integer metricValue;

}

