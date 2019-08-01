package td.enterprise.dao;

import java.util.List;

import td.enterprise.entity.BsExecLog;

/**
 * <br>
 * <b>功能：</b>绫致店铺接口执行日志表 BsExecLogDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-16 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface BsExecLogDao extends BaseDao<BsExecLog> {
	
	List<BsExecLog> queryLogByList(BsExecLog bsExecLog);
	
}
