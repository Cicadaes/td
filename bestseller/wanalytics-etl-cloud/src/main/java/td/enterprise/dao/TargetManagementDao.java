package td.enterprise.dao;

import td.enterprise.entity.TargetManagement;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>目标管理 TargetManagementDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-20 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface TargetManagementDao extends BaseDao<TargetManagement> {

	List<TargetManagement> queryByNotFinishList(TargetManagement page);

	List<TargetManagement> queryByNotFinishListDesc(TargetManagement page);

	List<TargetManagement> queryFinishList(TargetManagement page);

	Integer querybiggerIndex(TargetManagement page);

}
