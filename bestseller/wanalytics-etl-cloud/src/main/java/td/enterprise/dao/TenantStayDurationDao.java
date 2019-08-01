package td.enterprise.dao;

import td.enterprise.entity.TenantStayDuration;

/**
 * 
 * <br>
 * <b>功能：</b>项目新老客停留时长 TenantStayDurationDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-09 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface TenantStayDurationDao extends BaseDao<TenantStayDuration> {
	
	void batchDeleteByProjectAndDate(TenantStayDuration page);
	
	void batchSelectAndInsert(TenantStayDuration page);
	

}
