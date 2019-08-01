package com.talkingdata.marketing.core.task;

import com.fasterxml.jackson.core.type.TypeReference;
import com.talkingdata.marketing.core.constant.ChannelConstants;
import com.talkingdata.marketing.core.constant.PushConstants;
import com.talkingdata.marketing.core.constant.SegmentTaskCalcObjectRecordConstant;
import com.talkingdata.marketing.core.entity.admin.ChannelDefinition;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.dto.CalcObjectResult;
import com.talkingdata.marketing.core.entity.thirdmodel.push.PushStatModel;
import com.talkingdata.marketing.core.enums.PushMetric;
import com.talkingdata.marketing.core.middleware.PushMessageApi;
import com.talkingdata.marketing.core.service.admin.ChannelDefinitionService;
import com.talkingdata.marketing.core.service.campaign.SegmentTaskCalcObjectRecordService;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.util.SpringContextUtil;
import org.apache.commons.lang.StringUtils;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * The type Segment stat task.
 * @author armeng
 */
public class SegmentStatTask implements Job, StatefulJob {

    private static Logger logger = LoggerFactory.getLogger(SegmentStatTask.class);
    /**
     * The Segment task calc object record service.
     */
    SegmentTaskCalcObjectRecordService segmentTaskCalcObjectRecordService;
    /**
     * The Channel definition service.
     */
    ChannelDefinitionService channelDefinitionService;

    //    /**
    //     * The Segment task calc object record metric service.
    //     */
    //    SegmentTaskCalcObjectRecordMetricService segmentTaskCalcObjectRecordMetricService;
    private PushMessageApi pushMessageApi;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        initDependence();

        logger.info("stat push start");
        Map<Integer, ChannelDefinition> channelDefinitionMap = channelDefinitionService.loadChannelDefinition();
        Date statDate = DateUtil.getHoursBefore(new Date(), PushConstants.PUSH_STAT_HOUR_RANGE);
        List<SegmentTaskCalcObjectRecord> records = segmentTaskCalcObjectRecordService.queryByCreateTime(statDate);
        for (SegmentTaskCalcObjectRecord record : records) {
            if (null != record.getType() && record.getType() == SegmentTaskCalcObjectRecordConstant.Type.SEGMENT_CALC_TYPE_SEND) {
                continue;
            }
            if (record.getChannelDefinitionId() == null) {
                logger.error("bad channel definition id,record id:"+record.getId());
                continue;
            }
            ChannelDefinition channelDefinition = channelDefinitionMap.get(record.getChannelDefinitionId());
            if (channelDefinition == null) {
                logger.error("channelDefinition not found,record id:"+record.getId());
                continue;
            }

            if (channelDefinition.getChannelType() == null) {
                logger.error("bad channel type,record id:"+record.getId());
                continue;
            }

            if (channelDefinition.getChannelType() == ChannelConstants.PUSH) {
                String push = parsePushId(record.getAttr1());
                if (push == null) {
                    continue;
                }
                String resp = pushMessageApi.getStatById(push);
                if (!StringUtils.isEmpty(resp)) {

                    try{
                        PushStatModel model = JsonUtil.toObject(resp, PushStatModel.class);
                        // TODO 效果回收统计任务需要重新写
                        //                        createMetric(record, model);
                    }catch (Exception e){
                        e.printStackTrace();
                        continue;
                    }
                }
            } else {
                // todo sms ad stat
            }
        }
        logger.info("stat push done");
    }

    private String parsePushId(String attr) {
        try {
            if (StringUtils.isNotBlank(attr)) {
                Map<String, Object> param = JsonUtil.toObject(attr, new TypeReference<HashMap<String, Object>>() {
                });
                return (String) param.get("push");
            }
        } catch (Exception e) {
            logger.error("parse push error:", e);
        }
        return null;
    }

    //    private void createMetric(SegmentTaskCalcObjectRecord calcObjectRecord, PushStatModel model) throws Exception {
    //        SegmentTaskCalcObjectRecordMetric latestRecordMetric = segmentTaskCalcObjectRecordMetricService.getLatestByCalcObjectId(calcObjectRecord.getId());
    //        SegmentTaskCalcObjectRecordMetric sent = getSegmentTaskCalcObjectRecordMetric(calcObjectRecord, PushMetric.PUSH_SEND_NUMBER);
    //        SegmentTaskCalcObjectRecordMetric impressions = getSegmentTaskCalcObjectRecordMetric(calcObjectRecord, PushMetric.PUSH_IMPRESSIONS_NUMBER);
    //        SegmentTaskCalcObjectRecordMetric click = getSegmentTaskCalcObjectRecordMetric(calcObjectRecord, PushMetric.PUSH_CLICK_NUMBER);
    //        SegmentTaskCalcObjectRecordMetric arrivaled = getSegmentTaskCalcObjectRecordMetric(calcObjectRecord, PushMetric.PUSH_ARRIVALED_NUMBER);
    //        if (latestRecordMetric != null) {
    //            List<CalcObjectResult> calcObjectResults = segmentTaskCalcObjectRecordMetricService.getResultMapByCalcObjectId(calcObjectRecord.getId());
    //            for (CalcObjectResult calcObjectResult : calcObjectResults) {
    //                if (StringUtils.isEmpty(calcObjectResult.getMetricKey())){
    //                    continue;
    //                }
    //                if (calcObjectResult.getSumValue() == null){
    //                    calcObjectResult.setSumValue(0);
    //                }
    //                if (isType(calcObjectResult, PushMetric.PUSH_SEND_NUMBER)) {
    //                    sent.setMetricValue((model.getSent() - calcObjectResult.getSumValue()) + "");
    //                }
    //                if (isType(calcObjectResult, PushMetric.PUSH_CLICK_NUMBER)) {
    //                    click.setMetricValue((model.getRead() - calcObjectResult.getSumValue()) + "");
    //                }
    //                if (isType(calcObjectResult, PushMetric.PUSH_ARRIVALED_NUMBER)) {
    //                    arrivaled.setMetricValue((model.getReceive() - calcObjectResult.getSumValue()) + "");
    //                }
    //                if (isType(calcObjectResult, PushMetric.PUSH_IMPRESSIONS_NUMBER)) {
    //                    impressions.setMetricValue((model.getShow() - calcObjectResult.getSumValue()) + "");
    //                }
    //            }
    //        } else {
    //            sent.setMetricValue(model.getSent() + "");
    //            impressions.setMetricValue(model.getShow() + "");
    //            click.setMetricValue(model.getRead() + "");
    //            arrivaled.setMetricValue(model.getReceive() + "");
    //        }
    //        segmentTaskCalcObjectRecordMetricService.insert(sent);
    //        segmentTaskCalcObjectRecordMetricService.insert(impressions);
    //        segmentTaskCalcObjectRecordMetricService.insert(click);
    //        segmentTaskCalcObjectRecordMetricService.insert(arrivaled);
    //    }

    private boolean isType(CalcObjectResult calcObjectResult, PushMetric keyEnum) {
        return calcObjectResult.getMetricKey().equals(keyEnum.getValue());
    }

    //    private SegmentTaskCalcObjectRecordMetric getSegmentTaskCalcObjectRecordMetric(SegmentTaskCalcObjectRecord record, PushMetric pushMetric) {
    //        SegmentTaskCalcObjectRecordMetric metric = new SegmentTaskCalcObjectRecordMetric();
    //        metric.setCampaignId(record.getCampaignId());
    //        metric.setCampaignLaunchUnitId(record.getCampaignLaunchUnitId());
    //        metric.setSegmentId(record.getSegmentId());
    //        metric.setCalcObjectId(record.getId());
    //        metric.setCreateTime(new Date());
    //        metric.setMetricKey(pushMetric.getValue());
    //        metric.setDate(DateUtil.getSpecificDateFormat()+"");
    //        metric.setTenantId(record.getTenantId());
    //        metric.setCreator(record.getCreator());
    //        metric.setCreateBy(record.getCreateBy());
    //        return metric;
    //    }

    private void initDependence() {
        pushMessageApi = SpringContextUtil.getBean(PushMessageApi.class);
        segmentTaskCalcObjectRecordService = SpringContextUtil.getBean(SegmentTaskCalcObjectRecordService.class);
        //        segmentTaskCalcObjectRecordMetricService = SpringContextUtil.getBean(SegmentTaskCalcObjectRecordMetricService.class);
        channelDefinitionService = SpringContextUtil.getBean(ChannelDefinitionService.class);
    }
}
