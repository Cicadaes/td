package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.ProjectRelation;
import td.enterprise.page.ProjectRelationPage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>项目关系表 ProjectRelationDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface ProjectRelationDao extends BaseDao<ProjectRelation> {

    // List<ProjectRelation> queryChildrenProject(String projectParentId);

    boolean deleteByParentId(ProjectRelationPage page);

    boolean deleteByChildId(String id);

    List<ProjectRelation> getAllProjectRelations(ProjectRelationPage page);

    List<String> getAllTopParentProjectIds(ProjectRelationPage page);

}
