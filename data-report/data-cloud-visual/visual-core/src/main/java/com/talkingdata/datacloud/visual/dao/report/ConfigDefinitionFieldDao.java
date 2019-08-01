package com.talkingdata.datacloud.visual.dao.report;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.visual.entity.report.ConfigDefinitionField;

import java.util.List;

/**
 *
 * <br>
 * <b>功能：</b>TD_DC_CONFIG_DEFINITION_FIELD ConfigDefinitionFieldDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-06-23 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface ConfigDefinitionFieldDao extends BaseDao<ConfigDefinitionField> {
    public int deleteByConfigDefinitionName(String name);
    public int deleteByConfigDefinitionId(Integer configDefinitionId);
    public List<ConfigDefinitionField> queryRootFieldByConfigDefinitionId(Integer id);
}
