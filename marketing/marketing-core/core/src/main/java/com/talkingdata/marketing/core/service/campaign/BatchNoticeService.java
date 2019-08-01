package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.BatchNoticeConstants;
import com.talkingdata.marketing.core.dao.campaign.BatchNoticeDao;
import com.talkingdata.marketing.core.entity.campaign.BatchNotice;
import com.talkingdata.marketing.core.page.campaign.BatchNoticePage;
import org.apache.commons.collections.map.HashedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * <br>
 * <b>功能：</b>TD_MKT_BATCH_NOTICE BatchNoticeService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-11-17 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("batchNoticeService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class BatchNoticeService extends BaseService<BatchNotice, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(BatchNoticeService.class);

    @Autowired private BatchNoticeDao dao;

    @Override public BatchNoticeDao getDao() {
        return dao;
    }

    /**
     * 更新一个PIPELINE的通知数据状态，条件为能唯一确认一个PIPELINE的组合
     *
     * @param campaignId 营销活动ID
     * @param pipelineId 活动流程ID
     * @param version    版本号
     * @param status     状态
     * @throws Exception
     */
    public void updateStatusByUniqueIndex(Integer campaignId, Integer pipelineId, String version, Integer status)
        throws Exception {
        Map<String, Object> param = new HashedMap();
        param.put("campaignId", campaignId);
        param.put("pipelineId", pipelineId);
        param.put("version", version);
        param.put("status", status);
        getDao().updateStatusByUniqueIndex(param);
    }

    /**
     * 更新通知时间
     * -目前只有循环推送用到
     *
     * @param id
     * @param noticeTime
     * @throws Exception
     */
    public void updateNoticeTimeByPrimaryKey(Integer id, Date noticeTime) throws Exception {
        BatchNotice notice = new BatchNotice();
        notice.setId(id);
        notice.setNoticeTime(noticeTime);
        updateByPrimaryKeySelective(notice);
    }

    /**
     * 检索当前待未开始、进行中状态的数据
     * 并更新计算状态为计算中
     *
     * @param noticeType
     * @return
     * @throws Exception
     */
    public List<BatchNotice> findCurrentCalcBatchNotices(int noticeType) throws Exception {
        List<BatchNotice> currentCalcBatchNotices = this.listToBeNoticeDataByIdType(noticeType);
        if (!currentCalcBatchNotices.isEmpty()) {
            Set<Integer> batchNoticeIds =
                currentCalcBatchNotices.stream().map(e -> e.getId()).collect(Collectors.toSet());
            this.updateCalcStatus2ProgressByIds(batchNoticeIds);
        }
        return currentCalcBatchNotices;
    }

    /**
     * 更新计算状态为计算中，仅限于计算失败和未开始状态的数据
     *
     * @param ids
     * @throws Exception
     */
    public void updateCalcStatus2ProgressByIds(Set<Integer> ids) throws Exception {
        if (ids != null && !ids.isEmpty()) {
            getDao().updateCalcStatus2ProgressByIds(ids);
        }
    }

    /**
     * 检索待通知的数据，以类型为条件
     *
     * @param noticeType 通知类型
     * @return
     * @throws Exception
     */
    public List<BatchNotice> listToBeNoticeDataByIdType(int noticeType) throws Exception {
        BatchNoticePage page = new BatchNoticePage();
        page.setStatus(String.valueOf(BatchNoticeConstants.BatchNoticeStatusConstants.STATUS_PAUSE));
        page.setStatusOperator("<");
        page.setNoticeType(String.valueOf(noticeType));
        page.setCalcStatus(String.valueOf(BatchNoticeConstants.BatchNoticeStatusConstants.STATUS_PROGRESSING));
        page.setCalcStatusOperator("!=");
        List<BatchNotice> bathNotices = getDao().queryByList(page);
        return bathNotices;
    }
}
