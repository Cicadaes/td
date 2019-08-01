package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>阈值表 ThresholdPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-09-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ThresholdPage extends BasePage {

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
	private String creator;
	private String createBy;
	private Date createTime;
	private String updater;
	private String updateBy;
	private Date updateTime;

}
