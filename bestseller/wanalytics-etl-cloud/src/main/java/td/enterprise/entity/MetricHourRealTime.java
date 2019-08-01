package td.enterprise.entity;

import java.util.Date;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>metric hour real time MetricHourRealTimeEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-15 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Data
public class MetricHourRealTime extends BaseEntity {

  private Integer id;
  private int projectType;
  private int projectId;
  private int activeHourUsers;
  private int frontHourUsers;
  private int stayHourUsers;
  private String projectName;
  private String date;
  private String hour;
  private String projectNum;
  private String logicalCity;
  private String tenantId;
  private Date updateTime;
  private Boolean cityLevel;
}

