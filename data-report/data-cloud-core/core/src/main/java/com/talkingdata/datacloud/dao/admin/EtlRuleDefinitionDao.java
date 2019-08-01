package com.talkingdata.datacloud.dao.admin;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.entity.admin.EtlRuleDefinition;

import java.util.List;

/**
 * 
 * <br>
 * <b>功能：</b>ETL规则定义 EtlRuleDefinitionDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2015-08-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface EtlRuleDefinitionDao extends BaseDao<EtlRuleDefinition> {
	public List<EtlRuleDefinition> queryByBusinessType(Integer businessType);
}
