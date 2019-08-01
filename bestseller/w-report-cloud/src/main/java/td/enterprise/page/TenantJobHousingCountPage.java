package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>职住来源 TenantJobHousingCountPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-25 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class TenantJobHousingCountPage extends BasePage {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer crowdId;
    private String longitude;
    private String latitude;
    private String runDate;
    private Integer dayType;
    private Integer hour;
    private Integer hourType;
    private Integer metricValue;
    private Integer cycleStatistics;
    private String startDate;
    private String endDate;

}
