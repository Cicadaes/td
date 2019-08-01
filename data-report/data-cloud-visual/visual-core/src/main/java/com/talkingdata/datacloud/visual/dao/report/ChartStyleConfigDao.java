package com.talkingdata.datacloud.visual.dao.report;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.visual.entity.report.ChartStyleConfig;
/**
 *
 * <br>
 * <b>功能：</b>TD_DC_VISUAL_CHART_STYLE_CONFIG ChartStyleConfigDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-14 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface ChartStyleConfigDao extends BaseDao<ChartStyleConfig> {
    public int deleteByChartId(Integer chartid);
}
