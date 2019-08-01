package td.enterprise.dao;

import td.enterprise.entity.TenantDeviceCount;

import java.util.List;
import java.util.Map;

/**
 * 
 * <br>
 * <b>功能：</b>人群标签 TenantDeviceCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-08-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface TenantDeviceCountDao extends BaseDao<TenantDeviceCount> {
	int insertList(List<TenantDeviceCount> items);
	List<TenantDeviceCount> selectByCodesIn(Map params);
	TenantDeviceCount selectLatestDataByCodesIn(Map params);
	int deleteByParams(TenantDeviceCount tenantDeviceCount);
	List<TenantDeviceCount> queryChildrenSum(TenantDeviceCount page);
	void batchDeleteByProjectAndDate(TenantDeviceCount page);
	void batchInsert(List<TenantDeviceCount> list);
	void batchSelectAndInsert(TenantDeviceCount page);

}
