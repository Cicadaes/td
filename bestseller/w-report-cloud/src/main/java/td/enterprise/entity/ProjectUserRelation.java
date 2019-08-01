package td.enterprise.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <br>
 * <b>功能：</b>用户项目关系表 ProjectUserRelationEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Setter
@Getter
@ToString
public class ProjectUserRelation extends BaseEntity {

    private Integer id;
    private String projectId;
    private String login;
    private Integer status;
    private Integer type;
    private Integer orderIndex;

}

