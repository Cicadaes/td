package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.Dic;
import com.talkingdata.datacloud.entity.admin.DicItemColl;
import com.talkingdata.datacloud.page.admin.DicPage;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>数据字典 DicDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface DicDao extends BaseDao<Dic> {
	
	public List<DicItemColl> queryDicItemCollByDicName(String dicName);
	
	public Dic findByDicName(String dicName);
	
	public Integer queryWithSearchByCount(DicPage page);
	
	public List<Dic> queryWithSearchByList(DicPage page);
}
