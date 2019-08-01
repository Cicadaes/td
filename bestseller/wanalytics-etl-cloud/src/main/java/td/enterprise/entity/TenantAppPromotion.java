package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>App提升度计算 TenantAppPromotionEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-23 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */

@Getter
@Setter
@ToString
public class TenantAppPromotion extends BaseEntity {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private Integer crowdId;
    private String runDate;
    private String platform;
    private String appHash;
    private String activeHourNumber;
    private String activeAllNumber;
    private String activeProportion;
    private String activeCityProportion;
    private Float significanceValue;
    private String appType;
    private Integer hour;
    private Integer cycleStatistics;
    private String startDate;
    private String endDate;
    private Integer typeId;
    private String typeName;

}

