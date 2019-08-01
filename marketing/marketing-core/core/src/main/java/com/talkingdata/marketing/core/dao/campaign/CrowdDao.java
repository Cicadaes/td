package com.talkingdata.marketing.core.dao.campaign;

import com.talkingdata.enterprise.base.dao.BaseDao;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.page.campaign.CrowdPage;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CROWD CrowdDao<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Component
public interface CrowdDao extends BaseDao<Crowd> {
    /**
     * Query by campaign and name list.
     *
     * @param name       the name
     * @return the list
     */
    @Deprecated
    List<Crowd> queryByCampaignAndName(@Param("name")String name);

    /**
     * Find parent by campaign id list.
     *
     * @param campaignId the campaign id        后续这个值会不存在.
     * @return the list
     */
    @Deprecated
    List<Crowd> findParentByCampaignId(@Param("campaignId") Integer campaignId);

    /**
     * Select by ids list.
     *
     * @param ids the ids
     * @return the list
     */
    List<Crowd> selectByIds(List ids);

    /**
     * Query by status list.
     *
     * @param status the status
     * @return the list
     */
    List<Crowd> queryByStatus(Integer status);

    /**
     * Query by ref id crowd.
     *
     * @param refId the ref id
     * @return the crowd
     */
    Crowd queryByRefId(Integer refId);

    /**
     * Query by type list.
     *
     * @param status the status
     * @param type   the type
     * @param now    the now
     * @return the list
     */
    List<Crowd> queryByType(@Param("list")List<Integer> status, @Param("type") Integer type, @Param("now") Date now);

    /**
     * Query by parent id list.
     *
     * @param parentId the parent id
     * @return the list
     */
    List<Crowd> queryByParentId(Integer parentId);

    /**
     * Update by ref id int.
     *
     * @param crowd the crowd
     * @return the int
     */
    int updateByRefId(Crowd crowd);

    /**
     * Reset crowd version.
     *
     * @param crowdIdList the crowd id list
     * @param calcStatus  the calc status
     */
    void resetCrowdVersion(@Param("crowdIdList") List<Integer> crowdIdList, @Param("calcStatus") Integer calcStatus);

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     */
    void deleteByCreateTime(String createTime);


    /**
     * Query by list available list.
     *
     * @param page the page
     * @return the list
     */
    @Deprecated
    List<Crowd> queryByListAvailable(CrowdPage page);

    /**
     * Query by status in list.
     *
     * @param crowdPage  the crowd page
     * @param statusList the status list
     * @return the list
     */
    List<Crowd> queryByStatusIn(@Param("crowdPage") CrowdPage crowdPage,@Param("statusList") List<Integer> statusList);

    /**
     * Query count by status in integer.
     *
     * @param crowdPage  the crowd page
     * @param statusList the status list
     * @return the integer
     */
    Integer queryCountByStatusIn(@Param("crowdPage") CrowdPage crowdPage,@Param("statusList") List<Integer> statusList);
}
