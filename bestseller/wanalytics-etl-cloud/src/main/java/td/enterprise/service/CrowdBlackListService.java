package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.CrowdBlackListDao;
import td.enterprise.entity.CrowdBlackList;

/**
 * TODO 待封装，封装为对dao 的代码，实现自动打开和关闭
 */
public class CrowdBlackListService {

   public static int queryByCount(SqlSession sqlSession, CrowdBlackList p){
       CrowdBlackListDao dao = sqlSession.getMapper(CrowdBlackListDao.class);
       return dao.queryByCount(p);

   }


    public static int insert(SqlSession sqlSession, CrowdBlackList p) {
        CrowdBlackListDao dao = sqlSession.getMapper(CrowdBlackListDao.class);
        int insert = dao.insert(p);
        sqlSession.commit(true);
        return insert;

    }

}
