package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：房店指标 客流明细</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectSummaryVM implements Comparable<ProjectSummaryVM> {
    private Integer projectId;
    private String projectName;
    private String enterDailyUsers; //日均进店客流
    private String enterPercent;    //日均进店占比
    private String stayDailyUsers;  //日均停留客流
    private String stayPercent;     //日均停留占比
    private Double stayRate;        //停留率

    private String relativeStayRate; // 环比停留率


    private Integer enterUsers;
    private Integer stayUsers;

    private String longitude;
    private String latitude;
    private String city;
    private Integer defaultCrowdId;
    private Integer projectType;

    @Override
    public int compareTo(ProjectSummaryVM o) {
        if (null == this.getStayRate() || o.getStayRate() == null) {
            return 0;
        }
        return o.getStayRate().compareTo(this.getStayRate());
    }
}
