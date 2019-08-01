package td.enterprise.page.mapper;

import org.springframework.stereotype.Component;
import td.enterprise.entity.BaseEntity;
import td.enterprise.entity.ProjectUserRelation;
import td.enterprise.page.ProjectUserRelationPage;

/**
 * <br>
 * <b>功能：</b>用户项目关系表 ProjectUserRelationEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Component
public class ProjectUserRelationMapper extends BaseEntity {

    public ProjectUserRelation projectUserRelationPageToProjectUserRelation(ProjectUserRelationPage page) {

        ProjectUserRelation projectUserRelation = new ProjectUserRelation();

        if (page == null) {
            return projectUserRelation;
        }

        projectUserRelation.setId(page.getId());
        projectUserRelation.setProjectId(page.getProjectId());
        projectUserRelation.setLogin(page.getLogin());
        projectUserRelation.setStatus(page.getStatus());
        projectUserRelation.setType(page.getType());
        projectUserRelation.setOrderIndex(page.getOrderIndex());

        return projectUserRelation;
    }

}

