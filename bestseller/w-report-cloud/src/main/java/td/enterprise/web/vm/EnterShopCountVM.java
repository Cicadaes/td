package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>进店数量<br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class EnterShopCountVM {
    private String activeCount; //客均进店数量
    private String oldCount;    //老客客均进店数量
    private String newCount;    //新客客均进店数量
    private String date;
    private String monthRate; //同比
    private double monthRateValue;
    private TrendEnum trend;
}
