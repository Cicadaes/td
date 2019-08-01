package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.Cacheinfo;
import com.talkingdata.datacloud.page.admin.CacheinfoPage;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>系统的缓存信息 CacheinfoDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface CacheinfoDao extends BaseDao<Cacheinfo> {
	
	public List<Cacheinfo> queryByCacheinfo(Cacheinfo cacheinfo);
	
	public Integer queryWithSearchByCount(CacheinfoPage page);
	
	public List<Cacheinfo> queryWithSearchByList(CacheinfoPage page);
	
}
