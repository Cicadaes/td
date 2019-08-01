package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：进店率详细结构</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class EnterRateDetailVM {
    private String activeUsers; //到访客流
    private String enterUsers;  //进店客流
    private String enterPercent; //进店占比
    private String activePercent; //到访占比
    private String enterRate;   //进店率
    private String date;  // 日期
}
