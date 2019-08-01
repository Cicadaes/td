package com.talkingdata.datacloud.visual.dao.report;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.visual.entity.report.ReportPageChartRel;
/**
 *
 * <br>
 * <b>功能：</b>TD_DC_VISUAL_REPORT_PAGE_CHART_REL ReportPageChartRelDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface ReportPageChartRelDao extends BaseDao<ReportPageChartRel> {
    public int deleteRecordNoPageAndChart();
}
