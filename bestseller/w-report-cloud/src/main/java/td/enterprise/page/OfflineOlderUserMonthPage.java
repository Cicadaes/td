package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>月度老客统计表 OfflineOlderUserMonthPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-10 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class OfflineOlderUserMonthPage extends BasePage {

    private String tenantId;
    private Integer projectId;
    private String month;
    private Integer oldUsers;
    private Integer times;
    private Integer days;
}
