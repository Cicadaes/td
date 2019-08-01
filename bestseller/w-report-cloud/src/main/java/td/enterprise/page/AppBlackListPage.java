package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>App黑名单 AppBlackListPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-06-20 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class AppBlackListPage extends BasePage {

    private Integer id;
    private String appHash;
    private String appName;
    private String appVersion;
    private String platform;
    private Integer source;
    private Integer status;
    private String tenantId;

}
