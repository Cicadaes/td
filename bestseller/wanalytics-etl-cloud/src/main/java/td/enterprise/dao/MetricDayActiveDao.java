package td.enterprise.dao;

import java.util.List;
import java.util.Map;

import td.enterprise.entity.MetricDayActive;

/**
 * Created by Yan on 2017/5/8.
 */
public interface MetricDayActiveDao extends BaseDao<MetricDayActive> {
    List<MetricDayActive> queryByProjectIdList(Map<String, Object> params);

    void update(MetricDayActive metricDayActive);

}
