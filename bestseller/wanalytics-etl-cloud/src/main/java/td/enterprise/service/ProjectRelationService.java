package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import td.enterprise.dao.ProjectRelationDao;
import td.enterprise.entity.ProjectRelation;
import td.enterprise.wanalytics.etl.util.MyBatisUtil;

import java.util.List;

/**
 *
 */
public class ProjectRelationService {

   public static  List<String> getAllTopParentProjectIds(SqlSession sqlSession, ProjectRelation p){
       ProjectRelationDao  dao = sqlSession.getMapper(ProjectRelationDao.class);
       return  dao.getAllTopParentProjectIds(p);

    }

    public static  List<ProjectRelation> getAllProjectRelations(SqlSession sqlSession, ProjectRelation p){
        ProjectRelationDao  dao = sqlSession.getMapper(ProjectRelationDao.class);
        return  dao.getAllProjectRelations(p);

    }

}
