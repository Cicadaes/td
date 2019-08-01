package td.enterprise.dao;

import td.enterprise.entity.TenantTagsCount;

import java.util.List;
import java.util.Map;

/**
 * 
 * <br>
 * <b>功能：</b>人群设备 TenantTagsCountDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-08-11 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface TenantTagsCountDao extends BaseDao<TenantTagsCount> {
	int insertList(List<TenantTagsCount> items);
	List<TenantTagsCount> selectByCodesIn(Map params);
	List<TenantTagsCount> selectForRadar(Map params);
	TenantTagsCount selectLatestDataByCodesIn(Map params);
	int deleteByParams(TenantTagsCount tenantTagsCount);
	TenantTagsCount queryLatestRow(TenantTagsCount tenantJobHousingCountPage);
	int selectForRadarPeopleNum(Map params);
	List<TenantTagsCount> queryChildrenSum(TenantTagsCount page);
	void batchDeleteByProjectAndDate(TenantTagsCount page);
	void batchInsert(List<TenantTagsCount> list);
	void batchSelectAndInsert(TenantTagsCount page);

}
