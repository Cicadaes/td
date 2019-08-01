package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>项目参数 ProjectParamPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-08-25 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectParamPage extends BasePage {

    private Integer id;
    private Integer projectId;
    private String key;
    private String value;
    private String description;
}
