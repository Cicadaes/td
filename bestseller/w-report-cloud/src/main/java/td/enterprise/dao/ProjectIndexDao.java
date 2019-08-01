package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.ProjectIndex;
import td.enterprise.page.ProjectIndexPage;
import td.enterprise.web.vm.ProjectIndexVM;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>项目指标 ProjectIndexDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-29 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface ProjectIndexDao extends BaseDao<ProjectIndex> {

    List<ProjectIndex> queryListByOrder(ProjectIndexPage page);

    Integer queryListByOrderCount(ProjectIndexPage page);

    List<ProjectIndexVM> queryByListWithUserRelation(ProjectIndexPage page);

    Integer queryByListWithUserRelationCount(ProjectIndexPage page);

}
