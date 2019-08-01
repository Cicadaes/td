package td.enterprise.dao;

import java.util.List;

import td.enterprise.entity.BsDeviceRlt;

/**
 * <br>
 * <b>功能：</b>绫致店铺与设备关系(AP、小贝) BsDeviceRltDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-16 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface BsDeviceRltDao extends BaseDao<BsDeviceRlt> {
	
	int batchInsert(List<BsDeviceRlt> bsDeviceRltList);
	
	List<BsDeviceRlt> queryListByRecent(String runDate) throws Exception;
	
	int deleteByRunDate(String runDate) throws Exception;
	
}
