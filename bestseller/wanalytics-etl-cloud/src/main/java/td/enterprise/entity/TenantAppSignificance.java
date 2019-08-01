package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>App显著性计算 TenantAppSignificanceEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-29 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class TenantAppSignificance {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer crowdId;
    private String runDate;
    private String platform;
    private String appHash;
    private String appProportion;
    private String cityAppProportion;
    private String significanceValue;
    private String appType;
    private Integer hour;
    private Integer cycleStatistics;
    private String startDate;
    private String endDate;
    private String appName;
    private String appIcon;
    private String typeId;
    private String typeName;
}

