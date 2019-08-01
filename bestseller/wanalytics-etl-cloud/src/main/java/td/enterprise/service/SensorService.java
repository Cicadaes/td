package td.enterprise.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import td.enterprise.dao.SensorDao;
import td.enterprise.entity.Sensor;

/**
 * TODO 待封装，封装为对dao 的代码，实现自动打开和关闭
 */
public class SensorService {

    public static List<Sensor> queryByList(SqlSession sqlSession, Sensor q) {
        SensorDao dao = sqlSession.getMapper(SensorDao.class);
        return dao.queryByList(q);
    }

}
