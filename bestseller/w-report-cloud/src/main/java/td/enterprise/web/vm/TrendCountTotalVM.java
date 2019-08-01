package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：客流缺少图标汇总</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class TrendCountTotalVM {
    private String total; //总计
    private String daily; //日均
    private String rate; //环比 绝对值
    private String newDaily;//新客占比
    private TrendEnum trend; //趋势
}
