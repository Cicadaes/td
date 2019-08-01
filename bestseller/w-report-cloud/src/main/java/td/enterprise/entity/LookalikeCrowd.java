package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>相似人群 LookalikeCrowdEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-09-29 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class LookalikeCrowd {

    private Integer id;
    private String crowdName;  //人群名称（自定义）
    private String execId;  //azkaban任务id
    private Integer predictNum;
    private String predictRate;
    private String seedType;
    private Integer seedCrowdId;
    private String seedCrowdName;
    private Integer seedCrowdNum;
    private String seedCrowdStartDate;
    private String seedCrowdEndDate;
    private Integer isExcludeSeedCrowd;
    private Boolean isExcludeSeedCrowdBoolean;
    private Integer status;
    private Integer calcStatus;
    private String projectCityName;
    private Integer projectId;
    private String tenantId;
    private Date updateDataTime;
    private String createBy;
    private String creator;
    private String updateBy;
    private Date createTime;
    private Date updateTime;
    private Integer newSeedCrowdNum;  //扩展后客群数量
    private String fromTable;  //数据来自于

}

