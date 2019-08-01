package td.enterprise.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import td.enterprise.entity.Project;
import td.enterprise.page.ProjectPage;
import td.enterprise.web.vm.ProjectDetailVM;
import td.enterprise.web.vm.ProjectLatLngVM;
import td.enterprise.web.vm.ProjectUserRelationVM;
import td.enterprise.web.vm.ProjectListVM;

/**
 * <br>
 * <b>功能：</b>项目 ProjectDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-12 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface ProjectDao extends BaseDao<Project> {

    Project selectWithParentNameByPrimaryKey(String id);

    Integer queryByCountWithSingleParentName(ProjectPage page);

    List<Project> queryByListWithSingleParentName(ProjectPage page);

    Integer queryCount4Shop(ProjectPage page);

    List<ProjectListVM> queryList4Shop(ProjectPage page);

    void updatePicUrlById(Project page);

    void updatePicUrlByProId(Project page);

    List<Project> findAll(ProjectPage page);


    List<ProjectUserRelationVM> queryByListWithUserRelation(ProjectPage page);

    Integer queryByListWithUserRelationCount(ProjectPage page);

    List<Project> queryByListIds(ProjectPage page);

    List<Project> getDirectChildrenByParam(ProjectPage page);

    Integer getDirectChildrenByParamCount(ProjectPage page);

    List<Project> getParentProjectByParam(ProjectPage page);

    int querySumAreaByProjectIds(List<String> projectIds);

    List<ProjectDetailVM> queryProjectPrincipalList(ProjectPage page);

    int getProjectPrincipalCount(ProjectPage page);

    List<Project> getNotDirectChildrenByParam(ProjectPage comPage);

    Integer getChildrenByParamCount(ProjectPage comPage);

    List<Project> getChildrenByParam(ProjectPage comPage);
    
    List<ProjectLatLngVM> queryProjectLatLngList(ProjectPage page);
}

