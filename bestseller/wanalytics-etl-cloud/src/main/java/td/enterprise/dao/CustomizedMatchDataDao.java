package td.enterprise.dao;


import td.enterprise.entity.CustomizedMatchData;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>用户日志扩展标签数据表 CustomizedMatchDataDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-06 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface CustomizedMatchDataDao extends BaseDao<CustomizedMatchData> {
	
	int batchInsert(List <CustomizedMatchData> customizedMatchData);
	
	void batchDeleteByBusinessId(CustomizedMatchData customizedMatchData);
}
