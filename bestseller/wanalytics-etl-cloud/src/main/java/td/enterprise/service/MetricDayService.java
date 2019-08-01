package td.enterprise.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.ibatis.session.SqlSession;

import td.enterprise.dao.MetricDayDao;
import td.enterprise.entity.BsShopSales;
import td.enterprise.entity.MetricDay;

/**
 *
 */
@SuppressWarnings("unchecked")
public class MetricDayService {

  public static int insert(SqlSession session, MetricDay metricDay) {
    MetricDayDao dao = session.getMapper(MetricDayDao.class);
    int insert = dao.insert(metricDay);
    session.commit();
    return insert;
  }

  public static int insertOrUpdateUserMetrics(SqlSession session, MetricDay metricDay){
    MetricDayDao dao = session.getMapper(MetricDayDao.class);
    int insert = dao.insertOrUpdateUserMetrics(metricDay);
    session.commit();
    return insert;
  }



  public static List<MetricDay> findByProjectIds(SqlSession sqlSession, List<String> projectIdList) {
    MetricDayDao dao = sqlSession.getMapper(MetricDayDao.class);
    return dao.findByProjectIds(projectIdList);
  }

  public static void deleteByProjectId(SqlSession sqlSession, String projectId, String date) {
    MetricDayDao dao = sqlSession.getMapper(MetricDayDao.class);

    HashMap map = new HashMap();
    map.put("parentProjectId", Integer.valueOf(projectId));
    map.put("date", date);
    dao.deleteByProjectId(map);
    sqlSession.commit(true);
  }

  public static void insertAndDeleteDataByParentId(SqlSession sqlSession, String parentProjectId, String date) {
    MetricDayDao dao = sqlSession.getMapper(MetricDayDao.class);
    HashMap map = new HashMap();
    map.put("parentProjectId", Integer.valueOf(parentProjectId));
    map.put("date", date);
    dao.deleteByProjectId(map);
    dao.insertDataByParentId(map);
    sqlSession.commit(true);
  }

  public static List<MetricDay> queryByProjectIdListAndDate(SqlSession session, List<Integer> projectIdList, String date) {
    MetricDayDao dao = session.getMapper(MetricDayDao.class);
    Map<String, Object> params = new HashMap<>();
    params.put("projectIdList", projectIdList);
    params.put("date", date);
    return dao.queryByProjectIdList(params);
  }

  public static void batchUpdateByProjectNumAndDate(SqlSession session, List<MetricDay> list) {
    MetricDayDao dao = session.getMapper(MetricDayDao.class);
    dao.batchUpdateByProjectNumAndDate(list);
    session.commit(true);
  }
  
	public static void batchUpdateShopSales(SqlSession session, List<BsShopSales> list) {
		MetricDayDao dao = session.getMapper(MetricDayDao.class);
		dao.batchUpdateShopSales(list);
		session.commit(true);
	}
  
  public static int batchUpdateByMemberAndPotential(SqlSession session, String runDate) {
	  MetricDayDao dao = session.getMapper(MetricDayDao.class);
	  int result = dao.batchUpdateByMemberAndPotential(runDate);
	  session.commit();
	  return result;
  }
 
  public static List<MetricDay> queryMetricMonthByDate(SqlSession session, String startDate, String endDate) {
	  MetricDayDao dao = session.getMapper(MetricDayDao.class);
	  Map<String, Object> params = new HashMap<>();
	  params.put("startDate", startDate);
	  params.put("endDate", endDate);
	  return dao.queryMetricMonthByDate(params);
  }
  
  public static List<MetricDay> queryMetricWeekByDate(SqlSession session, String startDate, String endDate) {
	  MetricDayDao dao = session.getMapper(MetricDayDao.class);
	  Map<String, Object> params = new HashMap<>();
	  params.put("startDate", startDate);
	  params.put("endDate", endDate);
	  return dao.queryMetricWeekByDate(params);
  }
  
  public static List<BsShopSales> listShopSalesByDateList(SqlSession session, List<String> dates) {
	  MetricDayDao dao = session.getMapper(MetricDayDao.class);
	  return dao.listShopSalesByDateList(dates);
  }

}
