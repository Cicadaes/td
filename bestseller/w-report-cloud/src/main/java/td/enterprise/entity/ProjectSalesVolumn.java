package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>项目销售额 ProjectSalesVolumnEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class ProjectSalesVolumn extends BaseEntity {

    private Integer id;
    private String code;
    private String date;
    private Double value;
    private String unit;
    private Integer status;
    private String type;
    private String projectId;
    private String tenantId;
    private Integer crossAnalysisId;
    private Long passengerFlow;

}

