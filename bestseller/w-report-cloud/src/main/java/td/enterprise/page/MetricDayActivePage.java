package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.Integer;
import java.lang.String;
import java.util.Date;

/**
 * <br>
 * <b>功能：</b>排行榜周表 MetricDayActivePage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class MetricDayActivePage extends BasePage {

	private Integer id;
	private String brand;
	private String region;
	private String city;
	private String province;
	private String channel;
	private String mall;
	private String projectName;
	private Integer projectType;
	private Integer projectId;
	private String projectNum;
	private String date;
	private String weekOfYear;
	private String month;
	private Integer activeNewUsers;
	private Integer activeOldUsers;
	private Integer activeUsers;
	private Integer stayNewUsers;
	private Integer stayOldUsers;
	private Integer stayUsers;
	private Integer frontUsers;
	private Integer jumpUsers;
	private Integer highActiveUsers;
	private Integer middleActiveUsers;
	private Integer lowActiveUsers;
	private Integer sleepActiveUsers;
	private Integer highStayUsers;
	private Integer middleStayUsers;
	private Integer lowStayUsers;
	private Integer sleepStayUsers;
	private Integer recent7Users;
	private Integer recent30HighRate;
	private Integer activeDuration;
	private Integer activeTimes;
	private Integer stayDuration;
	private Integer stayTimes;
	private Integer interval2;
	private Integer interval5;
	private Integer interval10;
	private Integer interval15;
	private Integer interval30;
	private Integer durationNew5;
	private Integer durationNew15;
	private Integer durationNew30;
	private Integer durationNew60;
	private Integer durationOld5;
	private Integer durationOld15;
	private Integer durationOld30;
	private Integer durationOld60;
	private Integer highActive5;
	private Integer highActive15;
	private Integer highActive30;
	private Integer highActive60;
	private Integer middleActive5;
	private Integer middleActive15;
	private Integer middleActive30;
	private Integer middleActive60;
	private Integer lowActive5;
	private Integer lowActive15;
	private Integer lowActive30;
	private Integer lowActive60;
	private Integer sleepActive5;
	private Integer sleepActive15;
	private Integer sleepActive30;
	private Integer sleepActive60;
	private Integer timeOld1;
	private Integer timeOld2;
	private Integer timeOld3;
	private Integer timeOld5;
	private Integer oldInterval;
	private Integer visitCycle;
	private Integer newActiveDuration;
	private Integer newActiveTime;
	private Integer oldActiveDuration;
	private Integer oldActiveTime;
	private Integer cityLevel;
	private Date updateTime;

}
