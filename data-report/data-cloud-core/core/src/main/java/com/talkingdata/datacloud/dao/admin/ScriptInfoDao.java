package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.ScriptInfo;
import com.talkingdata.datacloud.page.admin.ScriptInfoPage;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>脚本信息 ScriptInfoDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-08-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface ScriptInfoDao extends BaseDao<ScriptInfo> {

	ScriptInfo findScriptInfoByCode(String scriptCode);
	
	public List<ScriptInfo> queryByScriptInfo(ScriptInfo scriptInfo);
	
	public List<ScriptInfo> checkScriptInfoNameAndCode(ScriptInfo scriptInfo);
	
	public Integer queryWithSearchByCount(ScriptInfoPage page);
	
	public List<ScriptInfo> queryWithSearchByList(ScriptInfoPage page);
}
