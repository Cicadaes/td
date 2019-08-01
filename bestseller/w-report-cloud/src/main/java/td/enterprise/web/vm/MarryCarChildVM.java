package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Getter
@Setter
@ToString
public class MarryCarChildVM {
    private String marriedPercent;    //已婚
    private String unmarriedPercent;  //未婚
    private String haveChildrenPercent; //有车比例
    private String noChildrenPercent;   //无车比例
    private String haveCarPercent;//有车比例
    private String noCarPercent;  //无车比例
}
