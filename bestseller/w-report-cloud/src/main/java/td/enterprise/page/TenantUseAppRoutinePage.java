package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>APP使用作息 TenantUseAppRoutinePage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-06-02 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class TenantUseAppRoutinePage extends BasePage {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer crowdId;
    private String runDate;
    private Integer hour;
    private Integer metricValue;
    private Integer cycleStatistics;
    private String startDate;
    private String endDate;

}
