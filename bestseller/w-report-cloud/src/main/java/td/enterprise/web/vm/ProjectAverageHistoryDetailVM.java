package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：房店指标,指标详情</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectAverageHistoryDetailVM {
    private String activeUsers;     //店均到店客流
    private String newUsers;        //店均新客
    private String oldUsers;        //店均老客
    private String stayUsers;       //停留客流
    private String stayRate;        //停留率
    private String averageStayDuration;

    private String startDate;
    private String endDate;
}
