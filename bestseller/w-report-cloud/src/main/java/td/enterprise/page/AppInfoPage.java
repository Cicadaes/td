package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>App清单数据 AppInfoPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-05-09 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class AppInfoPage extends BasePage {

    private Integer id;
    private String appHash;
    private String appName;
    private String appVersion;
    private String platform;
    private String appIcon;
    private Integer source;
    private Integer status;
    private String type_id;
    private String type_name;


}
