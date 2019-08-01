package td.enterprise.service;

import org.apache.ibatis.session.SqlSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import td.enterprise.dao.MetricDayDao;
import td.enterprise.dao.MetricFactDao;
import td.enterprise.dao.MetricHourRealTimeDao;
import td.enterprise.entity.MetricDay;
import td.enterprise.entity.MetricFact;
import td.enterprise.entity.MetricHourRealTime;

/**
 *
 */
@SuppressWarnings({"unchecked", "Duplicates"})
public class MetricHourRealTimeService {

  public static int insert(SqlSession session, MetricHourRealTime metricHourRealTime) {
    MetricHourRealTimeDao dao = session.getMapper(MetricHourRealTimeDao.class);
    int insert = dao.insert(metricHourRealTime);
    session.commit();
    return insert;
  }

  private static Map<String, Object> createParam(List<Integer> projectIdList, String date, String hour) {
    Map<String, Object> params = new HashMap<>();
    params.put("projectIdList", projectIdList);
    params.put("date", date);
    params.put("hour", hour);
    return params;
  }

  public static List<MetricHourRealTime> queryByProjectIdListAndDate(SqlSession session, List<Integer> projectIdList, String date, String hour) {
    MetricHourRealTimeDao dao = session.getMapper(MetricHourRealTimeDao.class);
    Map<String, Object> params = createParam(projectIdList, date, hour);
    return dao.queryByProjectIdList(params);
  }
}
