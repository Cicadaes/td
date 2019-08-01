package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>项目APP分类表 ProjectAppTypesPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-01 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectAppTypesPage extends BasePage {

    private Integer id;
    private String typeId;
    private String typeName;
    private Integer projectId;
    private Integer orderNo;
}
