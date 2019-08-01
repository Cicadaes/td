package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>聚类客群参数表 KmeansCrowdPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-03 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class KmeansCrowdPage extends BasePage {

    private Integer id;
    private String crowdName;
    private Integer seedCrowdId;
    private String seedCrowdName;
    private String startDate;
    private String endDate;
    private Integer dimensionality;
    private Integer dateType;
    private Integer classification;
    private Integer projectId;
    private Integer tenantId;
}
