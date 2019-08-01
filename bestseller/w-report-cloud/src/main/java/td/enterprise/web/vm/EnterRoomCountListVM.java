package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>人均停留时长趋势图<br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class EnterRoomCountListVM {
    private String total; //总计
    private String daily; //日均
    private String rate; //环比 绝对值
    private String newDaily;
    private TrendEnum trend;

    private List<EnterRoomCountVM> list;

    private List<EnterRoomCountVM> beforeList;

}
