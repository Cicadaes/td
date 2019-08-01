package td.enterprise.web.vm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：人群查询参数</b><br>
 * <b>作者：</b>junmin.li<br>
 * <b>日期：</b> 2017-03-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class AppCrowdVM {
    private Integer projectId;
    private String startDate;
    private String endDate;
    private Integer crowdId;
    private String appType;
    private String hour;
    private Integer applistlimit;
    private String appTouchType;

}
