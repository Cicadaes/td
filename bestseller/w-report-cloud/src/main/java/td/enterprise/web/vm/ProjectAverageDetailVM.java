package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：房店指标 指标明细</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectAverageDetailVM {
    private Integer projectId;
    private String projectName;
    private String activeUsers;     //店均到店客流
    private TrendEnum activeTrend;  //
    private String newUsers;        //店均新客
    private TrendEnum newTrend; //
    private String oldUsers;        //店均老客
    private TrendEnum oldTrend;
    private String stayUsers;       //停留客流
    private TrendEnum stayTrend;
    private String stayRate;        //停留率
    private TrendEnum stayRateTrend;
    private String averageStayDuration; //客均停留时长
    private TrendEnum averageStayDurationTrend;

    private String longitude;
    private String latitude;
    private String city;
    private String defaultCrowdId;
    private Integer projectType;



}
