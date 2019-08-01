package td.enterprise.page;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>项目关系表 ProjectRelationPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-23 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectRelationPage extends BasePage {

    private Integer id;
    private String projectParentId;
    private String projectId;

    private Integer noProjectType;
}
