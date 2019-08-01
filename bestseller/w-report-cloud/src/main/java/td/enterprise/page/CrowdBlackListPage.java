package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>人群黑名单 CrowdBlackListPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CrowdBlackListPage extends BasePage {

    private Integer id;
    private Integer projectId;
    private String deviceMac;
    private Integer source;
    private Integer status;
    private String tenantId;
}
