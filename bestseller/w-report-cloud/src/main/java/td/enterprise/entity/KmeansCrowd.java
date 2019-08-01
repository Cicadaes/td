package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>聚类客群参数表 KmeansCrowdEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-03 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class KmeansCrowd {

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
    private String creator;
    private Date createTime;
    private String updator;
    private Date updateTime;
    private Integer execId;

}

