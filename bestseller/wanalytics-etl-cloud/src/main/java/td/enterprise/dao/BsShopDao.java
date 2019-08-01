package td.enterprise.dao;

import java.util.List;

import td.enterprise.entity.BsShop;

/**
 * <br>
 * <b>功能：</b>绫致店铺 BsShopDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-15 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface BsShopDao extends BaseDao<BsShop> {
	
	int batchInsert(List<BsShop> bsShopList);
	
	List<BsShop> queryListByRunDate(String runDate) throws Exception;
	
	List<BsShop> queryListByRecent(String runDate) throws Exception;
	
	int deleteByRunDate(String runDate) throws Exception;
	
}
