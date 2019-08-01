package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Builder;

/**
 * <br>
 * <b>功能：</b>阈值表 ThresholdEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class Threshold extends BaseEntity {

  private Integer id;
  private Integer projectId;
  private Integer crowdCome;
  private Integer crowdBounce;
  private Integer crowdStay;
  private Integer crowdActiveHighBegin;
  private Integer crowdActiveHighEnd;
  private Integer crowdActiveMediumBegin;
  private Integer crowdActiveMediumEnd;
  private Integer crowdActiveLowBegin;
  private Integer crowdActiveLowEnd;
  private Integer crowdSleep;
  private Integer strengthCrowdBefore;
  private Integer strengthCrowdCome;
  private Integer frequencyIntervalTime;
  private Integer salesConsecutiveDay;
  private Integer salesComeDay;
  private Integer salesStayTime;
  private Integer blackConsecutiveDay;
  private Integer blackComeDay;
  private Integer blackStayTime;

}

