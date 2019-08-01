package td.enterprise.dao;

import td.enterprise.entity.ProjectRelation;

import java.util.List;

/**
 * Created by Yan on 2017/5/8.
 */
public interface ProjectRelationDao extends BaseDao{

    boolean deleteByParentId(String id);

    boolean deleteByChildId(String id);

    List<ProjectRelation> getAllProjectRelations(ProjectRelation p);

    List<String> getAllTopParentProjectIds(ProjectRelation p);
}
