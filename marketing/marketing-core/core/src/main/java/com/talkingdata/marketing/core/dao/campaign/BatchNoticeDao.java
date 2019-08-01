package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.BatchNotice;
import org.apache.ibatis.annotations.Param;

import java.util.Map;
import java.util.Set;

/**
 * <br>
 * <b>功能：</b>TD_MKT_BATCH_NOTICE BatchNoticeDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-11-17 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface BatchNoticeDao extends BaseDao<BatchNotice> {

    /**
     * Update calc status 2 progress by ids.
     *
     * @param ids the ids
     */
    void updateCalcStatus2ProgressByIds(@Param("set") Set<Integer> ids);

    /**
     * Update status by unique index.
     *
     * @param param the param
     */
    void updateStatusByUniqueIndex(Map<String, Object> param);
}
