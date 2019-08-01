package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>交叉分析表 CrossAnalysisEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-15 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CrossAnalysis extends BaseEntity {

    private Integer id;
    private String projectId;
    private String analysisName;
    private String xAxis;
    private String yAxis;
    private String startDate;
    private String endDate;
    private Integer status;

}

