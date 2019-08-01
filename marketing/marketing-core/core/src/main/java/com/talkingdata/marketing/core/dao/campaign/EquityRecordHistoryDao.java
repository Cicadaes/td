package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.EquityRecordHistory;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_EQUITY_RECORD_HISTORY EquityRecordHistoryDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-09-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface EquityRecordHistoryDao extends BaseDao<EquityRecordHistory> {
    /**
     * Batch insert.
     *
     * @param equityRecordHistoryList the equity record history list
     */
    void batchInsert(@Param("equityRecordHistoryList") List<EquityRecordHistory> equityRecordHistoryList);
}
