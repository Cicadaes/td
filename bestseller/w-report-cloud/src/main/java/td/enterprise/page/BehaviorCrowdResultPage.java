package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>自定义行为客群计算结果表 BehaviorCrowdResultPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-16 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class BehaviorCrowdResultPage extends BasePage {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer crowdId;
    private String runDate;
    private String tagCode;
    private String tagName;
    private Integer metricValue;
    private Integer cycleStatistics;
    private String startDate;
    private String endDate;
    private Integer execId;

}
