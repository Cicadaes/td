package td.enterprise.dao;

import java.util.List;

import td.enterprise.entity.BsDevice;

/**
 * <br>
 * <b>功能：</b>绫致店铺设备(AC、小贝) BsDeviceDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-10-17 <br>
 * <b>版权所有：</b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface BsDeviceDao extends BaseDao<BsDevice> {
	
	int batchInsert(List<BsDevice> bsDeviceList);
	
	List<BsDevice> queryListByRecent(String runDate) throws Exception;
	
	int deleteByRunDate(String runDate) throws Exception;
	
}
