package td.enterprise.dao;

import td.enterprise.entity.LookalikeCrowd;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>相似人群 LookalikeCrowdDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2016-09-29 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface LookalikeCrowdDao extends BaseDao<LookalikeCrowd> {
	
	List<LookalikeCrowd> queryByListWithOtherCrowd(LookalikeCrowd page);
	int queryByCountWithOtherCrowd(LookalikeCrowd page);
}
