package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.MacCompanyDao;
import td.enterprise.entity.MacCompany;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2017/6/21.
 */
public class MacCompanyService {
    public static int insert(SqlSession sqlSession, MacCompany p){
        MacCompanyDao dao = sqlSession.getMapper(MacCompanyDao.class);
        return dao.insert(p);
    }

    public static List queryByList(SqlSession sqlSession, MacCompany p){
        MacCompanyDao dao = sqlSession.getMapper(MacCompanyDao.class);
        return dao.queryByList(p);
    }
//    public static Map queryByMap(SqlSession sqlSession, MacCompany p){
//        MacCompanyDao dao = sqlSession.getMapper(MacCompanyDao.class);
//        return dao.queryByMap(p);
//    }
}
