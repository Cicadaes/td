package td.enterprise.dao;

import java.util.List;

import td.enterprise.entity.BsAuthHistory;

/**
 * <br>
 * <b>功能：</b>绫致店铺历史认证信息 BsAuthHistoryDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-18 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface BsAuthHistoryDao extends BaseDao<BsAuthHistory> {
	
	int batchInsert(List<BsAuthHistory> bsBsAuthHistoryList);
	
	int deleteByRunDate(String runDate) throws Exception;
	
}
