package com.talkingdata.datacloud.service.report;

import com.talkingdata.datacloud.page.report.SnipeChartImgPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.dao.report.SnipeChartImgDao;
import com.talkingdata.datacloud.entity.report.SnipeChartImg;


/**
 *
 * <br>
 * <b>功能：</b>TD_DC_SNIPE_CHART_IMG SnipeChartImgService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-03-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("snipeChartImgService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SnipeChartImgService extends BaseService<SnipeChartImg, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(SnipeChartImgService.class);

    @Autowired
    private SnipeChartImgDao dao;

    public SnipeChartImgDao getDao() {
        return dao;
    }

    public SnipeChartImg getChartImgByChartUUID(String chartUuid) throws Exception{
        SnipeChartImgPage page = new SnipeChartImgPage();
        page.setChartUuid(chartUuid);
        SnipeChartImg chartImg = this.queryBySingle(page);
        if (chartImg == null) {
                throw new IllegalStateException(String.format("Chart IMG data is not identity, chartUUId=%s",chartUuid));
        }
        return chartImg;
    }

}
