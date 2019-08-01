package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>租户项目同步offset到hive 表中记录 SyncHiveOffsetPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-12-12 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class SyncHiveOffsetPage extends BasePage {

    private Integer id;
    private String tenantId;
    private Integer projectId;
    private String runDate;
    private String syncDate;
}
