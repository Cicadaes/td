package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.ProjectPlace;
import td.enterprise.page.ProjectPlacePage;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>项目区域 ProjectPlaceDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface ProjectPlaceDao extends BaseDao<ProjectPlace> {
    List<ProjectPlace> quickSearchByList(ProjectPlacePage page);

    int quickSearchGetCount(ProjectPlacePage page);

    ProjectPlace queryByName(ProjectPlacePage page);

    List<ProjectPlace> selectByProjectId(ProjectPlace page);
}
