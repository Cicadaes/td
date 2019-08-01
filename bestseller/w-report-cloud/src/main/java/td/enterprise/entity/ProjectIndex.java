package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>项目指标 ProjectIndexEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-29 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectIndex extends BaseEntity {

    private Integer id;
    private Integer projectId;
    private String projectName;
    private Integer projectType;
    private String projectNum;
    private Integer status;
    private Integer todayFlow;
    private Integer sevenDaysFlow;
    private Integer thirtyDaysFlow;
    private String sevenChain;
    private String thirtyChain;
    private Integer sensorNum;
    private Double healthRate;
    private Double noLogDuration;
    private Double thirtyNoLogDuration;
    private Integer ssidCount;
    private Integer roomCount;

}

