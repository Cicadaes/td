package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import td.enterprise.dao.MetricFactDao;
import td.enterprise.entity.MetricFact;

@SuppressWarnings("Duplicates")
public class MetricFactService {

  public static List<MetricFact> queryByProjectIdListAndDate(SqlSession session, List<Integer> projectIdList, String date, int hour) {
    MetricFactDao dao = session.getMapper(MetricFactDao.class);
    Map<String, Object> params = createParam(projectIdList, date, hour);
    return dao.queryByProjectIdList(params);
  }

  private static Map<String, Object> createParam(List<Integer> projectIdList, String date, int hour) {
    Map<String, Object> params = new HashMap<>();
    params.put("projectIdList", projectIdList);
    params.put("date", date);
    params.put("hour", hour);
    return params;
  }

  public static int insert(SqlSession session, MetricFact metricFact) {
    MetricFactDao dao = session.getMapper(MetricFactDao.class);
    int insert = dao.insert(metricFact);
    session.commit();
    return insert;
  }
}
