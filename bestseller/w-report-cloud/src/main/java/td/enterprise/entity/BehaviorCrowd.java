package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

/**
 * <br>
 * <b>功能：</b>行为客群计算参数 BehaviorCrowdEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-10-28 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class BehaviorCrowd {

    private Integer id;
    private String crowdName;
    private int projectId;
    private String tenantId;
    private String paramJson;
    private String creator;
    private String createBy;
    private String updateBy;
    private Date createTime;
    private Date updateTime;
    private Integer execId;
    private Integer status;
    private Integer calcStatus;

}

