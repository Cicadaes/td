package td.enterprise.dao;

import td.enterprise.entity.TenantRegionCount;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>区域来源 TenantRegionCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-04-22 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface TenantRegionCountDao extends BaseDao<TenantRegionCount> {

	TenantRegionCount queryLatestRow(TenantRegionCount page);
	
	void batchDeleteByProjectAndDate(TenantRegionCount page);
	
	void batchSelectAndInsert(TenantRegionCount page);

}
