package td.enterprise.dao;


import java.util.List;
import java.util.Map;

import td.enterprise.entity.MetricHourRealTime;

/**
 * <br>
 * <b>功能：</b>metric hour real time MetricHourRealTimeDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-15 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface MetricHourRealTimeDao extends BaseDao<MetricHourRealTime> {
  List<MetricHourRealTime> queryByProjectIdList(Map<String, Object> params);
}
