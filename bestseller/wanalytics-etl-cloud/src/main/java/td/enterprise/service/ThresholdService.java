package td.enterprise.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;

import td.enterprise.dao.ThresholdDao;
import td.enterprise.entity.Project;
import td.enterprise.entity.Threshold;

public class ThresholdService {

    public static List<Threshold> queryListByProject(SqlSession sqlSession, Project p) {
        ThresholdDao dao = sqlSession.getMapper(ThresholdDao.class);
        return dao.queryListByProject(p);
    }
}
