package td.enterprise.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import td.enterprise.dao.MetricDayActiveDao;
import td.enterprise.entity.MetricDayActive;

/**
 *
 */
@SuppressWarnings("unchecked")
public class MetricDayActiveService {

    public static int insert(SqlSession session, MetricDayActive metricDay) {
        MetricDayActiveDao dao = session.getMapper(MetricDayActiveDao.class);
        int insert = dao.insert(metricDay);
        session.commit();
        return insert;
    }

    public static void update(SqlSession session, MetricDayActive metricDay) {
        MetricDayActiveDao dao = session.getMapper(MetricDayActiveDao.class);
        dao.update(metricDay);
        session.commit();
    }

    public static List<MetricDayActive> queryByProjectIdListAndDate(SqlSession session, List<Integer> projectIdList, String date) {
        MetricDayActiveDao dao = session.getMapper(MetricDayActiveDao.class);
        Map<String, Object> params = new HashMap<>();
        params.put("projectIdList", projectIdList);
        params.put("date", date);
        return dao.queryByProjectIdList(params);
    }

}
