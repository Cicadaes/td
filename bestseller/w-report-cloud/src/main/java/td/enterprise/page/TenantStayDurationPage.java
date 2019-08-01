package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>项目新老客停留时长 TenantStayDurationPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-09 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class TenantStayDurationPage extends BasePage {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private String date;
    private Integer stayUsers;
    private Integer newUsers;
    private Integer oldUsers;
    private Integer stayDuration;
    private Integer newDuration;
    private Integer oldDuration;
    private String averageStayDuration;
    private String averageNewDuration;
    private String averageOldDuration;

    private String start;
    private String end;

}
