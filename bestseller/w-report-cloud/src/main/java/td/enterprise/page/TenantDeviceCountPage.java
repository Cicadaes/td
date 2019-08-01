package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>人群标签 TenantDeviceCountPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-08-11 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class TenantDeviceCountPage extends BasePage {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer crowdId;
    private String runDate;
    private Integer deviceAttrType;
    private String deviceAttrName;
    private Integer metricValue;
    private Integer cycleStatistics;
    private String startDate;
    private String endDate;

}
