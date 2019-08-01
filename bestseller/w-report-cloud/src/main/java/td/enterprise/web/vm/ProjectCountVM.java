package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;

/**
 * <br>
 * <b>功能：</b>客群概览消息中间类<br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
public class ProjectCountVM {
    private String todayUsers;//今日客流
    private String todayUsersAbsRate;//环比绝对值
    private TrendEnum todayUsersTrend; //今日客流趋势down

    private String weekUsers;//近七日客流
    private String weekUsersAbsRate;//环比绝对值
    private TrendEnum weekUsersTrend;

    private String monthUsers;//近30日客流
    private String monthUsersAbsRate;//环比绝对值
    private TrendEnum monthUsersTrend;

    private String monthNewUsers;//近30日新客
    private String monthNewUsersAbsRate;//环比绝对值
    private TrendEnum monthNewUsersTrend;

    private String monthAverageStayDuration;//近30日客均停留时长
    private String monthAverageStayDurationAbsRate;//环比绝对值
    private TrendEnum monthAverageStayDurationTrend;

    private String totalUsers;//累计总客

    private CountVM todayUsersVM;
    private CountVM weekUsersVM;
    private CountVM monthUsersVM;
    private CountVM monthNewUsersVM;
    private CountVM monthAverageStayDurationVM;

}
