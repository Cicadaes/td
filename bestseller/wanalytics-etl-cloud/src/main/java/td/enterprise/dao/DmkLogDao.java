package td.enterprise.dao;

import td.enterprise.entity.DmkLog;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>调用dmk日志 DmkLogDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-06-27 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface DmkLogDao extends BaseDao<DmkLog> {

    List<DmkLog> batchPositionQuery(DmkLog dmkLog);
    void batchInsert(List<DmkLog> list);

	
}
