package td.enterprise.dao;

import td.enterprise.entity.TenantHousingCoverageCount;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>客群辐射范围 TenantHousingCoverageCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-12-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface TenantHousingCoverageCountDao extends BaseDao<TenantHousingCoverageCount> {
	
	List<TenantHousingCoverageCount> queryCustomerDistribution(TenantHousingCoverageCount tenantHousingCoverageCountPage);
	
	List<TenantHousingCoverageCount> queryChildrenSum(TenantHousingCoverageCount page);
	
	void batchDeleteByProjectAndDate(TenantHousingCoverageCount page);
	
	void batchInsert(List<TenantHousingCoverageCount> list);
	
	void batchSelectAndInsert(TenantHousingCoverageCount page);

}
