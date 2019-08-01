package com.talkingdata.datacloud.visual.dao.report;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.visual.entity.report.Report;

import java.util.List;

/**
 *
 * <br>
 * <b>功能：</b>TD_DC_VISUAL_REPORT ReportDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-04-10 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface ReportDao extends BaseDao<Report> {
    List<Report> queryByDataSourceId(Integer dataSourceId);
}
