package td.enterprise.dao;

import java.util.List;
import java.util.Map;

import td.enterprise.entity.MetricWeek;

/**
 * <br>
 * <b>功能：</b>TD_METRIC_WEEK MetricWeekDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-12-21 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface MetricWeekDao extends BaseDao<MetricWeek> {
	
	int insertOrUpdate(Map<String, Object> params);
	
	List<MetricWeek> queryListByDate(Map<String, Object> params);
	
}
