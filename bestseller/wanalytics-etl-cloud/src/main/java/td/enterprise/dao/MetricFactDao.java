package td.enterprise.dao;

import java.util.List;
import java.util.Map;

import td.enterprise.entity.MetricFact;

/**
 * <br>
 * <b>功能：</b>metric MetricFactDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-08 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface MetricFactDao extends BaseDao<MetricFact> {
  List<MetricFact> queryByProjectIdList(Map<String, Object> params);
}
