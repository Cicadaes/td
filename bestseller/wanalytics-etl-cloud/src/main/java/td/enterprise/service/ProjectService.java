package td.enterprise.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import td.enterprise.dao.ProjectDao;
import td.enterprise.entity.Project;

/**
 * TODO 待封装，封装为对dao 的代码，实现自动打开和关闭
 */
public class ProjectService {

   public static List<Project> queryByList(SqlSession sqlSession, Project p){
       ProjectDao dao = sqlSession.getMapper(ProjectDao.class);
       return  dao.queryByList(p);
    }

    public static Project selectByPrimaryKey(SqlSession sqlSession, String projectId) {
        ProjectDao dao = sqlSession.getMapper(ProjectDao.class);
        return  dao.selectByPrimaryKey(projectId);
    }

  public static List<Integer> findProjectIdsByType(SqlSession sqlSession, List<Integer> types){
     ProjectDao dao = sqlSession.getMapper(ProjectDao.class);
     return dao.findProjectIdsByType(types);
  }

  public static List<String> findProjectNumByType(SqlSession sqlSession, List<Integer> types){
    ProjectDao dao = sqlSession.getMapper(ProjectDao.class);
    return dao.findProjectNumByType(types);
  }
  
  public static List<Project> findProjectsByType(SqlSession sqlSession, List<Integer> types){
    ProjectDao dao = sqlSession.getMapper(ProjectDao.class);
    return dao.findProjectsByType(types);
  }

}
