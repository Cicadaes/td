package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;

/**
 * 到访深度
 */
@Setter
@Getter
public class VisitDepthVM {
    private String averageDayUsers; // 日均客流
    private String averageDayUsersRate;  //日均环比
    private String averageStayDuration;  //人均停留时长
    private String averageStayDurationRate;  //人均停留时长环比
    private String oldUserMonthDays;  //老客30日光顾日数
    private String oldUserMonthDaysRate;  //老客30日光顾环比
    private String averageOldUsers; // 日均老客
    private String averageOldUsersRate;  //日均老客环比
    private String monthOldUsers;   //月均同店老客
    private String monthOldUsersRate; //月均同店老客环比
    private String monthCrossUsers;   //月均跨店老客
    private String monthCrossUsersRate;   //月均跨店老客环比

}
