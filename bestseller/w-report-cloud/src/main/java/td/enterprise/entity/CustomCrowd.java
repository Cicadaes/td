package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>客户围群表 CustomCrowdEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-03 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class CustomCrowd {

    private Integer id;
    private Integer projectId;
    private String crowdName;
    private Integer recordType;
    private Integer calcStatus;
    private Integer execId;
    private Integer crowdRecordId;
    private String creator;
    private Date createTime;
    private Integer status;
    private String startDate;
    private String endDate;
}

