package td.enterprise.dao;

import td.enterprise.entity.MetricDayParty;

/**
 * <br>
 * <b>功能：</b>一方数据日指标 MetricDayPartyDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-08 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface MetricDayPartyDao extends BaseDao<MetricDayParty> {
	
	int batchInsert(String runDate);
	
	int deleteByRunDate(String runDate);
	
}
