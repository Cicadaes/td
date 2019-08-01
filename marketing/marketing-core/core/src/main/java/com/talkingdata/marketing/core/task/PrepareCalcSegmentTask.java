package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.constant.SegmentConstant.SegmentStatusConstant;
import com.talkingdata.marketing.core.constant.SegmentTaskCalcObjectRecordConstant;
import com.talkingdata.marketing.core.constant.TriggerConstants;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.middleware.UserCloudApi;
import com.talkingdata.marketing.core.service.campaign.CampaignService;
import com.talkingdata.marketing.core.service.campaign.CrowdService;
import com.talkingdata.marketing.core.service.campaign.SegmentService;
import com.talkingdata.marketing.core.service.campaign.SegmentTaskCalcObjectRecordService;
import com.talkingdata.marketing.core.util.CronDateUtils;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.core.util.SpringContextUtil;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static com.talkingdata.marketing.core.constant.CampaignConstant.CampaignStatusConstant;


/**
 * @author armeng
 */
public class PrepareCalcSegmentTask implements Job, StatefulJob {
    private Logger logger = LoggerFactory.getLogger(getClass());

    private SegmentService segmentService;

    private UserCloudApi userCloudApi;

    private CrowdService crowdService;

    private CampaignService campaignService;

    private SegmentTaskCalcObjectRecordService segmentTaskCalcObjectRecordService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        initDependence();
        logger.info("======================投放准备任务开始======================");
        Set<Segment> segmentList = loadTodayNeedCalcSegment();
        logger.info("======================投放准备任务.共找到{}条投放,segmentIds={},开始检查segments是否可以进行投放.",segmentList.size(),segmentList.stream().map(o->o.getId()).collect(Collectors.toSet()));
        for (Segment segment : segmentList) {
            try {
                Campaign campaign = campaignService.selectByPrimaryKey(segment.getCampaignId());
                if (campaign == null) {
                    logger.error("======================投放准备任务.没有找到对应的营销活动,投放名称为" + segment.getName() + " 投放ID" + segment.getId()+"营销活动ID="+segment.getCampaignId());
                    continue;
                }
                if (campaign.getStatus() != null && Objects.equals(CampaignStatusConstant.CAMPAIGN_DELETE, campaign.getStatus())) {
                    logger.info("======================投放准备任务.投放名称为" + segment.getName() + " 投放ID" + segment.getId() + "对应的活动" + campaign.getName() + " ID=" + campaign.getId() + "状态为" + campaign.getStatus() + "已删除,更新投放状态为已删除");
                    updateSegmentStatusById(segment.getId(), SegmentStatusConstant.SEGMENT_STATUS_DELETE);
                    continue;
                }

                Date now = new Date();
                boolean campaignStartFlag = campaign.getStartTime().before(now);
                if (!campaignStartFlag) {
                    logger.info("======================投放准备任务.活动{}的时间为：{} - {},投放名称：{} 不能进行投放。",campaign.getName(),DateUtil.format(campaign.getStartTime()),DateUtil.format(campaign.getEndTime()),segment.getName());
                    continue;
                }
                boolean campaignEndFlag = campaign.getEndTime().before(now);
                if (campaignEndFlag) {
                    logger.info("======================投放准备任务.活动时间为：{} - {},投放名称：{}不能继续进行投放，更新投放状态为：已结束",DateUtil.format(campaign.getStartTime()),DateUtil.format(campaign.getEndTime()),segment.getName());
                    updateSegmentStatusById(segment.getId(),SegmentStatusConstant.SEGMENT_STATUS_FINISH);
                    continue;
                }
                Crowd crowd = crowdService.selectByPrimaryKey(segment.getCrowdId());
                if (crowd == null) {
                    logger.info("======================投放准备任务.投放名称：{} 对应的人群ID: {} 人群不存在，更新投放任务状态为异常。",segment.getName(),segment.getCrowdId());
                    updateSegmentStatusById(segment.getId(),SegmentStatusConstant.SEGMENT_STATUS_FAIL);
                    continue;
                }
                if (segmentService.isType(segment, TriggerConstants.TriggerTypeConstants.NOW)) {
                    logger.info("======================投放准备任务.投放名称：{}为立即投放,在创建投放时已经创建投放任务，因此在本任务中直接忽略。",segment.getName());
                    continue;
                } else if (segmentService.isType(segment, TriggerConstants.TriggerTypeConstants.APPOINTEDTIME)) {
                    if (sendNeedless(segment)) {
                        continue;
                    }
                    if (now.before(segment.getAppointedTime())) {
                        logger.info("======================投放准备任务.投放名称: {}的指定投放时间为: {}，未到指定投放时间，不进行创建投放任务。",segment.getName(),DateUtil.format(segment.getAppointedTime()));
                        continue;
                    }
                } else {
                    //循环推送 得到当天的推送时间
                    Date nextTriggerTime = CronDateUtils.getNextByCron(segment.getCronExpression(), DateUtil.getBeginOfToday());
                    if (nextTriggerTime == null) {
                        //如果nextTriggerTime未获取，建议抛出异常较好
                        logger.error("======================投放准备任务.循环投放未计算出下次投放时间.投放Id: {}",segment.getId());
                        throw new MktException("======================投放准备任务.循环投放未计算出下次投放时间.segmentId="+segment.getId());
                    }
                    boolean reachTimeToSend = now.after(nextTriggerTime);
                    if (!reachTimeToSend) {
                        logger.info("======================投放准备任务.循环投放,投放Id: {},尚未到达下次投放时间: {},本次跳过。",segment.getId(),DateUtil.format(nextTriggerTime));
                        continue;
                    }
                }

                //开始办正事
                addCalcObjectRecordWithSegment(segment);

            } catch (Exception e) {
                logger.error("======================投放准备任务.检查投放名称：{},投放ID {}的投放活动是可以执行任务，出错，异常为：",segment.getName(),segment.getId(), e);
                // TODO 异常日志需要写入config的异常日志模块。可以通过前端查看到
            }
        }
        logger.info("======================投放准备任务结束========================");
    }

    private Set<Segment> loadTodayNeedCalcSegment() {
        List<Integer> statusList = new ArrayList();
        statusList.add(SegmentStatusConstant.SEGMENT_STATUS_WAITING);
        statusList.add(SegmentStatusConstant.SEGMENT_STATUS_LOOP);
        //今天需要安排的投放
        List<Segment> segmentList = segmentService.queryByStatusList(statusList);
        //今天已经安排的投放
        List<SegmentTaskCalcObjectRecord> records = segmentTaskCalcObjectRecordService.getTodayAlreadyCalcRecord(DateUtil.getBeginOfToday());

        //剩下的.
        Set<Segment> needCalcSet = new HashSet<>();
        Set<Integer> existIdSet = records.stream().map(o -> o.getSegmentId()).collect(Collectors.toSet());
        for(Segment seg : segmentList){
            if(existIdSet.contains(seg.getId())){
                continue;
            }else{
                needCalcSet.add(seg);
            }
        }
        return needCalcSet;
    }

    private void addCalcObjectRecordWithSegment(Segment segment) throws Exception {
        SegmentTaskCalcObjectRecord segmentTaskCalcObjectRecord = segmentTaskCalcObjectRecordService.buildWithSegment(segment);
        Date now = new Date();
        segmentTaskCalcObjectRecord.setCreateTime(now);
        segmentTaskCalcObjectRecord.setStartTime(now);
        segmentTaskCalcObjectRecord.setStatus(SegmentTaskCalcObjectRecordConstant.Status.WAITING);
        segmentTaskCalcObjectRecord.setType(SegmentTaskCalcObjectRecordConstant.Type.SEGMENT_CALC_TYPE_SEND);
        segmentTaskCalcObjectRecordService.insert(segmentTaskCalcObjectRecord);
    }

    private void updateSegmentStatusById(Integer id, Integer status) throws Exception {
        Segment updateSegment = new Segment();
        updateSegment.setId(id);
        updateSegment.setStatus(status);
        segmentService.updateByPrimaryKeySelective(updateSegment);
    }

    private boolean sendNeedless(Segment segment) {
        if (SegmentStatusConstant.SEGMENT_STATUS_FAIL == segment.getStatus()) {
            return true;
        }
        return false;
    }


    private void initDependence() {
        segmentService = SpringContextUtil.getBean(SegmentService.class);
        campaignService = SpringContextUtil.getBean(CampaignService.class);
        userCloudApi = SpringContextUtil.getBean(UserCloudApi.class);
        crowdService = SpringContextUtil.getBean(CrowdService.class);
        segmentTaskCalcObjectRecordService = SpringContextUtil.getBean(SegmentTaskCalcObjectRecordService.class);
    }
}
