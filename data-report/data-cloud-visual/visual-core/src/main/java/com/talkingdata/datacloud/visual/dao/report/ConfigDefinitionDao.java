package com.talkingdata.datacloud.visual.dao.report;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinition;
/**
 *
 * <br>
 * <b>功能：</b>TD_DC_CONFIG_DEFINITION ConfigDefinitionDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-05-08 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface ConfigDefinitionDao extends BaseDao<ConfigDefinition> {
    public ConfigDefinition queryByAdapterId(Integer id);
    public int deleteByConfigDefinitionName(String name);
    public ConfigDefinition selectByConfigDefinitionName(String name);
    public ConfigDefinition selectByAdapterConfigId(Integer id);
}
