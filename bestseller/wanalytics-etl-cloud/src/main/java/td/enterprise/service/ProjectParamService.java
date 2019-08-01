package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.ProjectParamDao;
import td.enterprise.entity.ProjectParam;

import java.util.List;

/**
 * TODO 待封装，封装为对dao 的代码，实现自动打开和关闭
 */
public class ProjectParamService {

   public static ProjectParam queryBySingle(SqlSession sqlSession, ProjectParam p){
       ProjectParam projectParam = null;
       ProjectParamDao dao = sqlSession.getMapper(ProjectParamDao.class);
       List<ProjectParam> projectParams =  dao.queryByList(p);
       if(projectParams.size() > 0) {
           projectParam = projectParams.get(0);
       }
       return projectParam;

    }

}
