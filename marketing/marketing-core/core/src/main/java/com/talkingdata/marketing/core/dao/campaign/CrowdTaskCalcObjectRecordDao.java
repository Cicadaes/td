package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.CrowdTaskCalcObjectRecord;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CROWD_TASK_CALC_OBJECT_RECORD CrowdTaskCalcObjectRecordDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-05-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public interface CrowdTaskCalcObjectRecordDao extends BaseDao<CrowdTaskCalcObjectRecord> {

    /**
     * Query by calc status list.
     *
     * @param status the status
     * @return the list
     */
    List<CrowdTaskCalcObjectRecord> queryByCalcStatus(Integer status);

    /**
     * Query by crowd id crowd task calc object record.
     *
     * @param crowdId the crowd id
     * @return the crowd task calc object record
     */
    CrowdTaskCalcObjectRecord queryByCrowdId(Integer crowdId);

    /**
     * Querylatest by crowd id crowd task calc object record.
     *
     * @param crowdId the crowd id
     * @return the crowd task calc object record
     */
    CrowdTaskCalcObjectRecord querylatestByCrowdId(Integer crowdId);

    /**
     * Query all by crowd id list.
     *
     * @param crowdId the crowd id
     * @return the list
     */
    List<CrowdTaskCalcObjectRecord> queryAllByCrowdId(Integer crowdId);

    /**
     * Find scene by ref id list.
     *
     * @param refIds the ref ids
     * @return the list
     */
    List<CrowdTaskCalcObjectRecord> findSceneByRefId(List<Integer> refIds);

    /**
     * Gets today already calc record.
     *
     * @param date the date
     * @return the today already calc record
     */
    List<CrowdTaskCalcObjectRecord> getTodayAlreadyCalcRecord(@Param("date") Date date);

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);
}
