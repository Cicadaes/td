package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.page.campaign.SegmentTaskCalcObjectRecordPage;
import com.talkingdata.marketing.core.util.DateUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.dao.campaign.SegmentTaskCalcObjectRecordDao;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import org.springframework.util.Assert;

import java.util.*;


/**
 *
 * <br>
 * <b>功能：</b>TD_MKT_SEGMENT_TASK_CALC_OBJECT_RECORD SegmentTaskCalcObjectRecordService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("segmentTaskCalcObjectRecordService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SegmentTaskCalcObjectRecordService extends BaseService<SegmentTaskCalcObjectRecord, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(SegmentTaskCalcObjectRecordService.class);

    @Autowired
    private SegmentTaskCalcObjectRecordDao dao;

    @Override
    public SegmentTaskCalcObjectRecordDao getDao() {
        return dao;
    }
    public List<SegmentTaskCalcObjectRecord> queryByCreateTime(Date statDate) {
        Map map = new HashMap(16);
        map.put("statDate",statDate);
        return dao.queryByCreateTime(map);
    }

    public List<String> getDateList(Integer segmentId) {
        SegmentTaskCalcObjectRecordPage page = new SegmentTaskCalcObjectRecordPage();
        page.setSegmentId(segmentId.toString());
        page.setPageSize(Integer.MAX_VALUE);
        List<SegmentTaskCalcObjectRecord> records = dao.queryByList(page);

        Map<String, Integer> m = new TreeMap<>(Comparator.comparingLong(o -> Long.valueOf(o)));
        for (SegmentTaskCalcObjectRecord record:records) {
            String formatDate = DateUtil.date2String("yyyyMMdd",record.getStartTime());
            m.put(formatDate, 1);
        }
        return new ArrayList(m.keySet());
    }

    public List<String> getDateListByPipelineId(Integer pipelineId, String pipelineNodeId) {
        SegmentTaskCalcObjectRecordPage page = new SegmentTaskCalcObjectRecordPage();
        page.setPipelineId(pipelineId.toString());
        page.setPipelineNodeId(pipelineNodeId);
        page.setPageSize(Integer.MAX_VALUE);
        List<SegmentTaskCalcObjectRecord> records = dao.queryByList(page);

        Map<String, Integer> m = new TreeMap<>(Comparator.comparingLong(o -> Long.valueOf(o)));
        for (SegmentTaskCalcObjectRecord record:records) {
            String formatDate = DateUtil.date2String("yyyyMMdd",record.getStartTime());
            m.put(formatDate, 1);
        }
        return new ArrayList(m.keySet());
    }

    public List<SegmentTaskCalcObjectRecord> getTodayAlreadyCalcRecord(Date date) {
        return getDao().getTodayAlreadyCalcRecord(date);
    }

    public List<SegmentTaskCalcObjectRecord> listByCampaignIds(List<Integer> campaignIds) throws Exception {
        return getDao().selectByCampaignIds(campaignIds);
    }
    public List<SegmentTaskCalcObjectRecord> listBySegmentIds(List<Integer> segmentIds) {
        return getDao().selectBySegmentIds(segmentIds);
    }
    public List<SegmentTaskCalcObjectRecord> listByPipelineId(Integer pipelineId, String pipelineNodeId) {
        return getDao().selectByPipelineId(pipelineId, pipelineNodeId);
    }

    public List<SegmentTaskCalcObjectRecord> queryByStatusAndType(List<Integer> statusList, Integer type) {
        return getDao().queryByStatusAndType(statusList, type);
    }

    public SegmentTaskCalcObjectRecord buildWithSegment(Segment segment) {
        SegmentTaskCalcObjectRecord segmentTaskCalcObjectRecord = new SegmentTaskCalcObjectRecord();
        segmentTaskCalcObjectRecord.setCampaignId(segment.getCampaignId());
        segmentTaskCalcObjectRecord.setCampaignLaunchUnitId(segment.getCampaignLaunchUnitId());
        segmentTaskCalcObjectRecord.setChannelDefinitionId(segment.getChannelDefinitionId());
        segmentTaskCalcObjectRecord.setSegmentId(segment.getId());
        segmentTaskCalcObjectRecord.setTenantId(segment.getTenantId());
        segmentTaskCalcObjectRecord.setCreator(segment.getCreator());
        segmentTaskCalcObjectRecord.setCreateBy(segment.getCreateBy());
        return segmentTaskCalcObjectRecord;
    }

    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }



}
