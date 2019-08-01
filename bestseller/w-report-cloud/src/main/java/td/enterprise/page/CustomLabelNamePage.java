package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>用户自定义标签名 CustomLabelNamePage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class CustomLabelNamePage extends BasePage {

    private Integer id;
    private String label;
    private String name;
    private String projectId;
    private String tenantId;
    private String version;
    private String status;
    private String type;
}