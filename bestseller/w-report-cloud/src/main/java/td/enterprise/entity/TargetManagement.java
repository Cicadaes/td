package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>目标管理 TargetManagementEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */

@Setter
@Getter
@ToString
public class TargetManagement extends BaseEntity {

    private Integer id;
    private String targetName;
    private Integer targetId;
    private Double targetValue;
    private Double currentValue;
    private String startDate;
    private String endDate;
    private String finishDate;
    private Integer pageIndex;
    private Integer isRecurring;
    private Integer duration;
    private String publisher;
    private String tenantId;
    private Integer projectId;
    private Integer operationState;

}

