package td.enterprise.dao;

import org.apache.ibatis.annotations.Mapper;
import td.enterprise.entity.ProjectUserRelation;

/**
 * <br>
 * <b>功能：</b>用户项目关系表 ProjectUserRelationDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-13 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Mapper
public interface ProjectUserRelationDao extends BaseDao<ProjectUserRelation> {

    Integer queryMaxOrderIndex(ProjectUserRelation projectUserRelation);

//    List<ProjectUserRelation> queryListByOrder(ProjectUserRelationPage page);

}
