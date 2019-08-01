package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>相似人群 LookalikeCrowdPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-09-29 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class LookalikeCrowdPage extends BasePage {

    private Integer id;
    private String crowdName;
    private String execId;  //azkaban任务id
    private Integer predictNum;
    private String predictRate;
    private String seedType;
    private Integer seedCrowdId;
    private String seedCrowdName;
    private Integer seedCrowdNum;
    private String seedCrowdStartDate;
    private String seedCrowdEndDate;
    private Boolean isExcludeSeedCrowd;
    private Integer status;
    private Integer calcStatus;
    private String projectCityName;
    private Integer projectId;
    private String tenantId;
    private Date updateDataTime;

}
