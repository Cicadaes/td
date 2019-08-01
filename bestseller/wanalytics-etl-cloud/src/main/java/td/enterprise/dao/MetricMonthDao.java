package td.enterprise.dao;

import java.util.List;
import java.util.Map;

import td.enterprise.entity.MetricMonth;

/**
 * <br>
 * <b>功能：</b>TD_METRIC_MONTH MetricMonthDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-12-21 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface MetricMonthDao extends BaseDao<MetricMonth> {
	
	int insertOrUpdate(Map<String, Object> params);
	
	List<MetricMonth> queryListByDate(Map<String, Object> params);
	
	void updateBySelective(MetricMonth metricMonth);
	
}
