package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>竞品关联度指标 TenantCorrelationCountPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-12-16 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class TenantCorrelationCountPage extends BasePage {

    private Integer id;
    private String tenantId;
    private String projectId;
    private Integer crowdId;
    private Integer activeCount;
    private Integer compareProjectId;
    private Integer compareCrowdId;
    private Integer compareActiveCount;
    private Integer commonCount;
    private Integer cycleStatistics;
    private String runDate;
    private String startDate;
    private String endDate;

    private String[] projectIds;

}
