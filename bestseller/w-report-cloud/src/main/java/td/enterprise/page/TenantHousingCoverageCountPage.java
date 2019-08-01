package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>客群辐射范围 TenantHousingCoverageCountPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-12-16 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class TenantHousingCoverageCountPage extends BasePage {

    private Integer id;
    private String tenantId;
    private String projectId;
    private Integer crowdId;
    private String runDate;
    private Integer hourType;
    private Integer distance;
    private Integer metricValue;
    private Integer cycleStatistics;
    private String startDate;
    private String endDate;

    private String[] projectIds;

}
