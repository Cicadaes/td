package td.enterprise.entity;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>排行榜周表 MetricDayActiveEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class MetricDayActive extends BaseEntity {

    private Integer id;
    private String  brand;
    private String  region;
    private String  city;
    private String  province;
    private String  channel;
    private String  mall;
    private String  projectName;
    private int     projectType;
    private int     projectId;
    private String  projectNum;
    private String  date;
    private String  weekOfYear;
    private String  month;
    private int     activeNewUsers;
    private int     activeOldUsers;
    private int     activeUsers;
    private int     stayNewUsers;
    private int     stayOldUsers;
    private int     stayUsers;
    private int     frontUsers;
    private int     jumpUsers;
    private int     highActiveUsers;
    private int     middleActiveUsers;
    private int     lowActiveUsers;
    private int     sleepActiveUsers;
    private int     highStayUsers;
    private int     middleStayUsers;
    private int     lowStayUsers;
    private int     sleepStayUsers;
    private int     recent7Users;
    private int     recent30HighRate;
    private int     activeDuration;
    private int     activeTimes;
    private int     stayDuration;
    private int     stayTimes;
    private int     interval2;
    private int     interval5;
    private int     interval10;
    private int     interval15;
    private int     interval30;
    private int     durationNew5;
    private int     durationNew15;
    private int     durationNew30;
    private int     durationNew60;
    private int     durationOld5;
    private int     durationOld15;
    private int     durationOld30;
    private int     durationOld60;
    private int     highActive5;
    private int     highActive15;
    private int     highActive30;
    private int     highActive60;
    private int     middleActive5;
    private int     middleActive15;
    private int     middleActive30;
    private int     middleActive60;
    private int     lowActive5;
    private int     lowActive15;
    private int     lowActive30;
    private int     lowActive60;
    private int     sleepActive5;
    private int     sleepActive15;
    private int     sleepActive30;
    private int     sleepActive60;
    private int     timeOld1;
    private int     timeOld2;
    private int     timeOld3;
    private int     timeOld5;
    private int     oldInterval;
    private int     visitCycle;
    private int     newActiveDuration;
    private int     newActiveTime;
    private int     oldActiveDuration;
    private int     oldActiveTime;
    private Date    updateTime;
    private int     cityLevel;
    private String  logicalCity;
    private String  tenantId;
    private String  cCityCnName;

}
