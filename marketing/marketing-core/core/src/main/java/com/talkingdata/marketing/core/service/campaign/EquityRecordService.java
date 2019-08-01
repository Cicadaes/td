package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.EquityRecordConstants;
import com.talkingdata.marketing.core.dao.campaign.EquityRecordDao;
import com.talkingdata.marketing.core.entity.campaign.EquityRecord;
import com.talkingdata.marketing.core.entity.campaign.EquityRecordHistory;
import com.talkingdata.marketing.core.page.campaign.EquityRecordPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_EQUITY_RECORD EquityRecordService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-08-31 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("equityRecordService")
@Transactional(value = "marketingTransactionManager", propagation = Propagation.REQUIRED, readOnly = false, rollbackFor = Throwable.class)
public class EquityRecordService extends BaseService<EquityRecord, Integer> {

    private final static int BATCH_CLEAN_TOTAL = 2;

    private static final Logger logger = LoggerFactory.getLogger(EquityRecordService.class);

    @Autowired
    private EquityRecordDao dao;
    @Autowired
    private EquityRecordHistoryService equityRecordHistoryService;

    @Override
    public EquityRecordDao getDao() {
        return dao;
    }

    /**
     * 计数流程权益的使用
     *
     * @param campaignId 营销活动ID
     * @param pipelineId 活动流程ID
     * @param equityConfigId 权益ID
     * @return
     * @throws Exception
     */
    public int countUsedForPipelineEquity(Integer campaignId, Integer pipelineId, Integer equityConfigId) throws Exception {
        EquityRecordPage page = new EquityRecordPage();
        page.setCampaignId(String.valueOf(campaignId));
        page.setPipelineDefinitionId(String.valueOf(pipelineId));
        page.setEquityConfigId(String.valueOf(equityConfigId));
        page.setStatus(String.valueOf(EquityRecordConstants.EquityRecordStatusConstants.PIPELINE_EQUITY_USED));
        return queryByCount(page);
    }

    public void deleteNotUsedEquity(Integer pipelineDefinitionId) {
        getDao().deleteNotUsedEquity(pipelineDefinitionId);
    }

    public Integer insertBatch(List<EquityRecord> equityRecordList) throws Exception {
        return getDao().insertBatchEquityRecord(equityRecordList);
    }

    public void deleteExtraEquity(Integer pipelineDefinitionId, Integer equityConfigId, Integer limit) {
        getDao().deleteExtraEquity(pipelineDefinitionId, equityConfigId, limit);
    }

    public void updateEquityUsed(Integer campaignId, Integer pipelineDefinitionId, String equityCode, List<String> equityValueList) {
        getDao().updateEquityUsed(campaignId, pipelineDefinitionId, equityCode, equityValueList);
    }

    public void deleteByIds(List<Integer> ids) throws Exception {
        getDao().deleteByIds(ids);
    }

    public void clean() throws Exception{
        List<EquityRecord> equityRecordList = loadUsedEquityRecordList();
        if (equityRecordList.isEmpty()) {
            return;
        }
        logger.info("need clean " +equityRecordList.size() +" total.");
        List<EquityRecord> batchEquityRecordList = new ArrayList();
        for (EquityRecord record : equityRecordList) {
            batchEquityRecordList.add(record);
            if (batchEquityRecordList.size() >= BATCH_CLEAN_TOTAL) {
                batchOperateEquityRecord(batchEquityRecordList);
                batchEquityRecordList = new ArrayList();
            }
        }

        if (batchEquityRecordList.size() > 0) {
            batchOperateEquityRecord(batchEquityRecordList);
        }
    }

    public void batchOperateEquityRecord(List<EquityRecord> equityRecordList) throws Exception{
        batchDeleteEquityRecord(equityRecordList);
        batchInsertHistoryEquityRecord(equityRecordList);
    }

    private void batchInsertHistoryEquityRecord(List<EquityRecord> equityRecordList) throws Exception{
        List<EquityRecordHistory> equityRecordHistoryList = new ArrayList();
        for (EquityRecord equityRecord:equityRecordList) {
            EquityRecordHistory equityRecordHistory = new EquityRecordHistory();
            BeanUtils.copyProperties(equityRecord, equityRecordHistory);
            equityRecordHistoryList.add(equityRecordHistory);
        }
        equityRecordHistoryService.batchInsert(equityRecordHistoryList);

    }

    private void batchDeleteEquityRecord(List<EquityRecord> equityRecordList) throws Exception{
        List<Integer> ids = new ArrayList();
        for (EquityRecord record : equityRecordList) {
            ids.add(record.getId());
        }
        deleteByIds(ids);
    }

    private List<EquityRecord> loadUsedEquityRecordList() {
        EquityRecordPage page = new EquityRecordPage();
        page.setStatus(String.valueOf(EquityRecordConstants.EquityRecordStatusConstants.PIPELINE_EQUITY_USED));
        page.setPageSize(Integer.MAX_VALUE);
        try {
            return queryByList(page);
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.EMPTY_LIST;
        }
    }

    public List<EquityRecord> findByEquityConfigIdAndStatus(Integer equityConfigId, int status) {
        return getDao().findByEquityConfigIdAndStatus(equityConfigId,status);
    }

    public int countByEquityConfigIdAndStatus(Integer equityConfigId, int status) {
        return getDao().countByEquityConfigIdAndStatus(equityConfigId,status);
    }

    public int countByPipelineDefinitionIdAndStatus(Integer pipelineDefinitionId, int status) {
        return getDao().countByPipelineDefinitionIdAndStatus(pipelineDefinitionId,status);
    }
}
