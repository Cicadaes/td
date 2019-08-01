package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>区域来源 TenantRegionCountPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-22 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class TenantRegionCountPage extends BasePage {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer crowdId;
    private Integer regionType;
    private String regionName;
    private String runDate;
    private Integer dayType;
    private Integer hour;
    private Integer metricValue;
    private Integer cycleStatistics;
    private String startDate;
    private String endDate;

    private String startTime;
    private String endTime;
    private Integer crowdIdTo;
    private String cityName;

}
