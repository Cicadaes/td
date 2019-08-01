package td.enterprise.entity;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br> <b>功能：</b>metric MetricFactEntity<br> <b>作者：</b>code generator<br> <b>日期：</b> 2017-11-08
 * <br> <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class MetricFact extends BaseEntity {

  private Integer id;
  private String brand;
  private String region;
  private String city;
  private String province;
  private String channel;
  private String mall;
  private String projectName;
  private int projectType;
  private int projectId;
  private String date;
  private int hour;
  private int hourUsers;
  private int endHourUsers;
  private Date updateTime;
  private String projectNum;
  private String logicalCity;
  private String tenantId;
}

