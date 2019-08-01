package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

/**
 * <br>
 * <b>功能：指标对比返回结果</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class TargetCompareVM {
    private int projectId;
    List<TargetVM> values;

}
