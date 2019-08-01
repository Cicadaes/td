package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * 月均光顾日数，月均光顾次数，停留率，停留时长统计
 */
@Setter
@Getter
@ToString
public class DepthSummaryVM {

    private String monthAverageDays; //月均到访日数 日均客流
    private String averageDaysMonthRate; //环比比例
    private TrendEnum averageDaysMonthTrend;//环比趋势
    private String averageDaysYearRate;//同步比例
    private TrendEnum averageDaysYearTrend;//同步趋势

    private String monthAverageTimes;  //月均到访次数 均环比
    private String averageTimesMonthRate;  //环比
    private TrendEnum averageTimesMonthTrend;
    private String averageTimesYearRate;// 环比
    private TrendEnum averageTimesYearTrend;

    private String stayRate;   //停留率
    private String stayRateMonthRate;
    private TrendEnum stayRateMonthTrend;
    private String stayRateYearRate;
    private TrendEnum stayRateYearTrend;

    private String stayTimesDuration;  //次均停留时长
    private String stayTimesDurationMonthRate;
    private TrendEnum stayTimesDurationMonthTrend;
    private String stayTimesDurationYearRate;
    private TrendEnum stayTimesDurationYearTrend;


}
