package com.talkingdata.datacloud.visual.dao.report;

import com.talkingdata.datacloud.base.dao.BaseDao;
import com.talkingdata.datacloud.visual.entity.report.DataSource;

import java.util.List;

/**
 *
 * <br>
 * <b>功能：</b>TD_DC_VISUAL_DATA_SOURCE DataSourceDao<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface DataSourceDao extends BaseDao<DataSource> {
    List<DataSource> queryDataSourceByReportId(Integer reportId);
}