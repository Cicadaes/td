package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：停留率详细结构</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class StayRateDetailVM {
    private String activeUsers; //到访客流
    private String enterUsers;  //进店客流
    private String stayUsers;   //停留客流
    private String stayRate;    //停留率
    private String enterPercent; //进店占比
    private String stayPercent; //停留占比
    private String date;
}
