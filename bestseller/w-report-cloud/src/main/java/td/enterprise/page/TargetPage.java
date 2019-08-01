package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>目标管理标签类 TargetPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class TargetPage extends BasePage {

    private Integer id;
    private String name;
    private String code;
    private String type;
    private String valueType;
    private String startValue;
    private String endValue;
    private Integer status;
    private String tenantId;
    private Integer projectId;
}
