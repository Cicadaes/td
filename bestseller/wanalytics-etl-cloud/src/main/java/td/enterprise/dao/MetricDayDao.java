package td.enterprise.dao;

import java.util.List;
import java.util.Map;
import java.util.Set;

import td.enterprise.entity.BsShopSales;
import td.enterprise.entity.MetricDay;

/**
 * Created by Yan on 2017/5/8.
 */
public interface MetricDayDao extends BaseDao<MetricDay> {
  List<MetricDay> queryByProjectIdList(Map<String, Object> params);

  List<MetricDay> findByProjectIds(List<String> idList);

  void insertDataByParentId(Map<String, Object> params);

  int deleteByProjectId(Map<String, Object> params);

  void batchUpdateByProjectNumAndDate(List<MetricDay> list);
  
  void batchUpdateShopSales(List<BsShopSales> list);

  int insertOrUpdateUserMetrics(MetricDay metricDay);
  
  int batchUpdateByMemberAndPotential(String runDate);
  
  List<MetricDay> queryMetricMonthByDate(Map<String, Object> params);
  
  List<MetricDay> queryMetricWeekByDate(Map<String, Object> params);
  
  List<BsShopSales> listShopSalesByDateList(List<String> dates);
  
}
