package com.talkingdata.datacloud.service.report;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.dao.report.SnipeReportDao;
import com.talkingdata.datacloud.entity.report.SnipeReport;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_SNIPE_REPORT SnipeReportService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-28 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("snipeReportService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SnipeReportService extends BaseService<SnipeReport, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(SnipeReportService.class);

    @Autowired
    private SnipeReportDao dao;

    public SnipeReportDao getDao() {
        return dao;
    }

}
