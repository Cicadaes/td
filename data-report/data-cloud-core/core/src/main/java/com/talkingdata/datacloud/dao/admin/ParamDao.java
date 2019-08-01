package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.Param;
import com.talkingdata.datacloud.page.admin.ParamPage;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>系统配置参数 ParamDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-07-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface ParamDao extends BaseDao<Param> {
	
	public List<Param> queryByParam(Param param);
	
	public Param findByParamKey(String paramKey);
	
	public Integer queryWithSearchByCount(ParamPage page);
	
	public List<Param> queryWithSearchByList(ParamPage page);
	
}
