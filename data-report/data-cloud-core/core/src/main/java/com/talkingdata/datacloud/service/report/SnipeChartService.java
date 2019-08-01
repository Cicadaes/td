package com.talkingdata.datacloud.service.report;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.dao.report.SnipeChartDao;
import com.talkingdata.datacloud.entity.report.SnipeChart;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_SNIPE_CHART SnipeChartService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-28 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("snipeChartService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SnipeChartService extends BaseService<SnipeChart, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(SnipeChartService.class);

    @Autowired
    private SnipeChartDao dao;

    public SnipeChartDao getDao() {
        return dao;
    }

}
