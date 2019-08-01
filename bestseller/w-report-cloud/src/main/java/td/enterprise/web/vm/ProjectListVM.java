package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import td.enterprise.entity.Project;

/**
 * <br>
 * <b>功能：</b>店铺（阈值设置）<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class ProjectListVM extends Project {

    private String crowdCome;	//进店客流
    private String strengthCrowdBefore;	//店前客流强度
    private String strengthCrowdCome;	//入店客流强度
    private String frequencyIntervalTime; // 次数间隔时间
    private String salesConsecutiveDay;  //店员连续天数
    private String salesComeDay;  //店员入店天数
    private String blackConsecutiveDay;  //黑名单连续天数
    private String blackComeDay;  //黑名单入店天数

}

