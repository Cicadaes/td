package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>项目每天跨店老客 OfflineCrossOlderUserDayPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class OfflineCrossOlderUserDayPage extends BasePage {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private String month;
    private String date;
    private Integer crossUsers;
}
