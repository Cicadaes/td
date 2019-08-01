package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>wifiPix标签统计 WifiPixTagCountEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class WifiPixTagCount extends BaseEntity {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer corwdId;
    private Integer type;
    private String businessName;
    private String runDate;
    private String startDate;
    private String endDate;
    private Integer metricValue;
    private Integer cycleStatistics;
}

