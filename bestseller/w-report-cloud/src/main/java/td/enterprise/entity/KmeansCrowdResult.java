package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>聚类客群任务计算结果 KmeansCrowdResultEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-03 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class KmeansCrowdResult {

    private Integer id;
    private Integer kmeansCrowdId;
    private String classificationName;
    private String classificationDescription;
    private String classificationValue;
    private String dataName;
    private Integer projectId;
    private Integer tenantId;
    private String creator;
    private Date createTime;
    private String updator;
    private Date updateTime;
    private Integer execId;
    private Double percent;
    private String percentStr;

}

