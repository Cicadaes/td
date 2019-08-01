package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>人数详情<br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class PassengerVM {
    private String oldUsers;
    private String newUsers;
    private String sumUsers;
    private String dayPercent;//占比
    private String date;
    private String enterUsers;
    private String stayUsers;
    private String enterPercent;
    private String stayPercent;
    private String activePercent;
    private String activeUsers;
    private String enterRate; //进店率
    private String stayRate; // 停留率


}
