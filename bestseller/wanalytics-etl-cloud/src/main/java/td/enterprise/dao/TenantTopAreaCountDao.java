package td.enterprise.dao;

import td.enterprise.entity.TenantTopAreaCount;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>TopN小区 TenantTopAreaCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-11-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface TenantTopAreaCountDao extends BaseDao<TenantTopAreaCount> {
	TenantTopAreaCount queryLatestRow(TenantTopAreaCount page);
	List<TenantTopAreaCount> queryByListNew(TenantTopAreaCount page);
	Long queryByListNewSum(TenantTopAreaCount page);
	void batchDeleteByProjectAndDate(TenantTopAreaCount page);
	void batchSelectAndInsert(TenantTopAreaCount page);
}
