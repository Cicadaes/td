package com.talkingdata.datacloud.service.report;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.dao.report.SnipeReportChartRelDao;
import com.talkingdata.datacloud.entity.report.SnipeReportChartRel;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_SNIPE_REPORT_CHART_REL SnipeReportChartRelService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-28 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("snipeReportChartRelService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SnipeReportChartRelService extends BaseService<SnipeReportChartRel, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(SnipeReportChartRelService.class);

    @Autowired
    private SnipeReportChartRelDao dao;

    public SnipeReportChartRelDao getDao() {
        return dao;
    }

}
