package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;
import td.enterprise.dao.DmkDao;
import td.enterprise.entity.DmkEntity;

import java.util.List;

/**
 * Created by Administrator on 2017/6/26.
 */
public class DmkService {
    public static int insertList(SqlSession sqlSession, List<DmkEntity> p){
        DmkDao dao = sqlSession.getMapper(DmkDao.class);
        return dao.insertList(p);
    }
}
