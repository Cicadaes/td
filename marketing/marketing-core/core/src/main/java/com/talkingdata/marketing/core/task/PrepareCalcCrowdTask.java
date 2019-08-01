package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcStatus;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType;
import com.talkingdata.marketing.core.constant.TriggerConstants;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.CrowdTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.service.campaign.CampaignLaunchUnitService;
import com.talkingdata.marketing.core.service.campaign.CrowdService;
import com.talkingdata.marketing.core.service.campaign.CrowdTaskCalcObjectRecordService;
import com.talkingdata.marketing.core.service.campaign.SegmentService;
import com.talkingdata.marketing.core.util.CronDateUtils;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.core.util.SpringContextUtil;
import org.apache.commons.collections.CollectionUtils;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * The type Prepare calc crowd task.
 * @author armeng
 */
public class PrepareCalcCrowdTask implements Job, StatefulJob {
    private Logger logger = LoggerFactory.getLogger(getClass());

    private CrowdTaskCalcObjectRecordService crowdTaskCalcObjectRecordService;

    private CrowdService crowdService;

    private SegmentService segmentService;

    private CampaignLaunchUnitService campaignLaunchUnitService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        initDependence();
        logger.info("cron prepare calc crowd task start");
        Set<Integer> todayAlreadyCalcCrowdId = loadTodayAlreadyCalcCrowdId();
        logger.info("今天已经计算过的人群id={}",todayAlreadyCalcCrowdId);
        List<Crowd> sceneCrowdList = findSceneCrowd();
        logger.info("需要计算的场景人群id={}",sceneCrowdList.stream().map(o->o.getId()).collect(Collectors.toSet()));
        List<Integer> needUpdateCrowdIdList = new ArrayList();
        for (Crowd sceneCrowd : sceneCrowdList) {
            if (todayAlreadyCalcCrowdId.contains(sceneCrowd.getId())) {
                logger.info("{}人群当天已经创建过人群计算对象", sceneCrowd.getId());
                continue;
            }
            needUpdateCrowdIdList.add(sceneCrowd.getId());
        }
        List<Segment> segmentList = findSegmentList();
        List<Integer> needUpdateSegmentIdList = new ArrayList();
        List<Integer> needUpdateUnitIdList = new ArrayList();
        for (Segment segment:segmentList) {
            if (todayAlreadyCalcCrowdId.contains(segment.getCrowdId())) {
                logger.info("{}人群当天已经创建过人群计算对象", segment.getCrowdId());
                continue;
            }
            needUpdateSegmentIdList.add(segment.getId());
            needUpdateUnitIdList.add(segment.getCampaignLaunchUnitId());
            needUpdateCrowdIdList.add(segment.getCrowdId());
        }
        try {
            //清除人群version
            crowdService.resetCrowdVersion(needUpdateCrowdIdList, CrowdCalcStatus.STATUS_NOT_START);
            //清除unit version
            campaignLaunchUnitService.resetCrowdVersion(needUpdateUnitIdList);
            //添加计算对象
            addRecordByCrowdIdList(needUpdateCrowdIdList);
        } catch (Exception e) {
            logger.error("update crowd error:",e);
        }
        logger.info("cron prepare calc crowd task done");
    }

    private Set<Integer> loadTodayAlreadyCalcCrowdId() {
        logger.info("begin_of_the_day:"+DateUtil.getBeginOfToday().getTime());
        List<CrowdTaskCalcObjectRecord> records = crowdTaskCalcObjectRecordService.getTodayAlreadyCalcRecord(DateUtil.getBeginOfToday());
        Set<Integer> crowdIdSet = new HashSet();
        for (CrowdTaskCalcObjectRecord record : records) {
            crowdIdSet.add(record.getCrowdId());
        }
        return crowdIdSet;
    }

    private void addRecordByCrowdIdList(List<Integer> crowdIdList) throws Exception{
        logger.info("需要计算的人群Id={}",crowdIdList);
        if (CollectionUtils.isEmpty(crowdIdList)) {
            return;
        }
        List<Crowd> crowdList = crowdService.selectByIds(crowdIdList);
        for (Crowd crowd : crowdList) {
            crowdTaskCalcObjectRecordService.insertByCrowd(crowd, CrowdCalcStatus.STATUS_NOT_START);
        }
    }

    private List<Crowd> findSceneCrowd() {
        List<Integer> statusList = new ArrayList();
        statusList.add(CrowdCalcStatus.STATUS_FINISH);
        statusList.add(CrowdCalcStatus.STATUS_NOT_START);
        statusList.add(CrowdCalcStatus.STATUS_UNUSUAL);

        List<Crowd> crowdList = crowdService.queryByType(statusList, CrowdType.CROWD_TYPE_SCENE, new Date());
        if (crowdList == null) {
            return Collections.emptyList();
        }
        return crowdList;
    }

    private List<Segment> findSegmentList() {
        List<Segment> segmentList = segmentService.getProcessSegment();
        Date now = new Date();
        List<Segment> requireUpdateCrowdSegmentList = new ArrayList();
        for (Segment segment:segmentList) {
            if (segment.getTriggerType() == null) {
                continue;
            }
            if (TriggerConstants.TriggerTypeConstants.LOOP == segment.getTriggerType()){
                Date nextTriggerTime = CronDateUtils.getNextByCron(segment.getCronExpression(), now);
                if (DateUtil.isToday(nextTriggerTime)) {
                    requireUpdateCrowdSegmentList.add(segment);
                }
            }
        }
        return requireUpdateCrowdSegmentList;
    }

    private void initDependence() {
        crowdService = SpringContextUtil.getBean(CrowdService.class);
        crowdTaskCalcObjectRecordService = SpringContextUtil.getBean(CrowdTaskCalcObjectRecordService.class);
        segmentService = SpringContextUtil.getBean(SegmentService.class);
        campaignLaunchUnitService = SpringContextUtil.getBean(CampaignLaunchUnitService.class);
        crowdTaskCalcObjectRecordService = SpringContextUtil.getBean(CrowdTaskCalcObjectRecordService.class);
    }
}
