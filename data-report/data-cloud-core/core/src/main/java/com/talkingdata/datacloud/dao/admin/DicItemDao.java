package com.talkingdata.datacloud.dao.admin;

import org.apache.ibatis.annotations.Param;
import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.DicItem;

import java.util.List;
import java.util.Map;

/**
 * 
 * <br>
 * <b>功能：</b>数据字典子项目 DicItemDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface DicItemDao extends BaseDao<DicItem> {
	public List<DicItem> queryByParentItemKey(String key);
	
	public DicItem getDicItemByItemValueAndDicItemKey(@Param(value = "optionValue") String optionValue, @Param(value = "nodeValue") String nodeValue);
	
	public DicItem getDicItemByKeyAndParentKey(@Param(value = "itemKey") String itemKey, @Param(value = "parentItemKey") String parentItemKey);
	
	public DicItem getCorpRootDicItem(@Param(value = "dicName") String dicName, @Param(value = "corpId") String corpId);
	
	List<String> getNoExistValueList(Map<String, Object> map);
	
	Integer getMaxKeybyDicIdParentId(Map<String, Object> map);
	
	public List<DicItem> queryByDicItem(DicItem dicItem);
	
}
