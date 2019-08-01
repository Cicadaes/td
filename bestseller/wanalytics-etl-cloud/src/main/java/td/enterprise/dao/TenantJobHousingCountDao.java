package td.enterprise.dao;

import td.enterprise.entity.TenantJobHousingCount;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>职住来源 TenantJobHousingCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-25 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface TenantJobHousingCountDao extends BaseDao<TenantJobHousingCount> {

	TenantJobHousingCount queryLatestRow(TenantJobHousingCount page);
	
	void batchDeleteByProjectAndDate(TenantJobHousingCount page);
	
	void batchSelectAndInsert(TenantJobHousingCount page);

}
