package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * 客流趋势上排数据
 */
@Setter
@Getter
@ToString
public class PassengerTrendTopDataVM {
    private String totalUsers; //所选时期总客流，
    private String totalUsersStr; //所选时期总客流，
    private String totalUsersRate; //所选时期总客流环比
    private TrendEnum totalUsersTrend; //趋势

    private String newUsersPercent; //新客占比
    private String newUsersPercentRate; //新客环比
    private TrendEnum newUsersPercentTrend; //趋势

    private String peakHours; //峰值时段
    private String peakPercent; //峰值时段新客占比
    private String peakPercentRate; //峰值时段环比
    private TrendEnum peakPercentTrend; //趋势

    private int  totalHourUsers; //每小时排重后用户总数

    List<HourUsersVM> hourUsersList;//客流到访时段

}
