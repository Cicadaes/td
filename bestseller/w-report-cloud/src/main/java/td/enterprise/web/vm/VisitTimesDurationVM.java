package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：驻留时长分布</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class VisitTimesDurationVM {

    private int type;

    private int minute15;
    private int minute30;
    private int minute60;
    private int minute100;

    private int hour30;
    private int hour60;
    private int hour120;
    private int hour240;
    private int hour999;
}
