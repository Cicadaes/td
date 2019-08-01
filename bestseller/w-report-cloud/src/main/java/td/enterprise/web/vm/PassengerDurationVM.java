package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>人均停留时长详情<br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class PassengerDurationVM {
    private String avarageOldDuration;
    private String avarageNewDuration;
    private String avarageDuration;
    private String date;
    private String monthRate;
    private double monthRateValue;//真实值
    private TrendEnum trend;
}
