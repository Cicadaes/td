package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.entity.campaign.EquityRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.EquityRecordHistoryDao;
import com.talkingdata.marketing.core.entity.campaign.EquityRecordHistory;

import java.util.ArrayList;
import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_EQUITY_RECORD_HISTORY EquityRecordHistoryService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("equityRecordHistoryService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class EquityRecordHistoryService extends BaseService<EquityRecordHistory, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(EquityRecordHistoryService.class);

    @Autowired
    private EquityRecordHistoryDao dao;

    @Override
    public EquityRecordHistoryDao getDao() {
        return dao;
    }

    private void batchInsertHistoryEquityRecord(List<EquityRecord> equityRecordList) throws Exception{
        List<EquityRecordHistory> equityRecordHistoryList = new ArrayList();
        BeanUtils.copyProperties(equityRecordList, equityRecordHistoryList);
        batchInsert(equityRecordHistoryList);
    }

    public void batchInsert(List<EquityRecordHistory> equityRecordHistoryList) throws Exception{
        getDao().batchInsert(equityRecordHistoryList);
    }

}
