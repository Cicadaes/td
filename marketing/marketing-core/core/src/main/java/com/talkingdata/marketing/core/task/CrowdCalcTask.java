package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.constant.CrowdConstants;
import com.talkingdata.marketing.core.constant.CrowdDmpApiConstants;
import com.talkingdata.marketing.core.constant.CrowdTaskCalcObjectRecordConstants;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.CrowdTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdEstimateResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdInfoResp;
import com.talkingdata.marketing.core.middleware.CrowdApi;
import com.talkingdata.marketing.core.page.campaign.CrowdTaskCalcObjectRecordPage;
import com.talkingdata.marketing.core.service.campaign.CrowdService;
import com.talkingdata.marketing.core.service.campaign.CrowdTaskCalcObjectRecordService;
import com.talkingdata.marketing.core.service.campaign.SegmentService;
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
import java.util.List;

/**
 * 人群计算任务
 *
 * @author armeng
 */
public class CrowdCalcTask implements Job, StatefulJob {
    private Logger logger = LoggerFactory.getLogger(getClass());

    private CrowdApi crowdApi;

    private CrowdService crowdService;

    private SegmentService segmentService;

    private CrowdTaskCalcObjectRecordService calcObjectRecordService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {

        crowdApi = SpringContextUtil.getBean(CrowdApi.class);
        crowdService = SpringContextUtil.getBean(CrowdService.class);
        calcObjectRecordService = SpringContextUtil.getBean(CrowdTaskCalcObjectRecordService.class);
        segmentService = SpringContextUtil.getBean(SegmentService.class);

        logger.info("======================人群计算任务开始======================");
        List<CrowdTaskCalcObjectRecord> crowdTaskCalcObjectRecordList = getNotStartObjectRecords();
        if (crowdTaskCalcObjectRecordList == null || crowdTaskCalcObjectRecordList.size() == 0) {
            logger.info("未查询到需要计算的人群,终止执行人群计算任务");
            return;
        }
        logger.info("查询人群计算任务状态为未开始计算的任务,查询到需要计算的计算任务条数为：" + crowdTaskCalcObjectRecordList.size() + "条");
        List<Segment> segmentList = segmentService.getProcessSegment();
        for (CrowdTaskCalcObjectRecord record : crowdTaskCalcObjectRecordList) {
            try {
                Crowd crowd = crowdService.selectByPrimaryKey(record.getCrowdId());
                if (crowd == null) {
                    logger.info("人群计算任务的人群未找到,更新该计算任务状态为异常, 人群计算任务id为" + record.getId());
                    calcObjectRecordService.updateCalcObjectRecordStatusById(record, CrowdTaskCalcObjectRecordConstants.FAIL);
                    continue;
                }
                if (crowdTodayAlreadyUpdate(crowd.getLastUpdateTime())) {
                    logger.info("crowd id:{}人群已经是最新状态，无需要进行计算。", crowd.getId());
                    record.setStatus(CrowdConstants.CrowdCalcStatus.STATUS_FINISH);
                    updateCrowdTaskCalcObjectRecord(record);
                    continue;
                }
                if (CrowdConstants.CrowdCalcStatus.STATUS_DELETE == crowd.getStatus()) {
                    logger.info("crowd id:{}人群已经被删除，无需要进行计算。", crowd.getId());
                    continue;
                }
                if (CrowdConstants.CrowdCalcStatus.STATUS_IN_PROGRESS == (crowd.getCalcStatus())) {
                    logger.info("crowd id:{}人群计算中，无需要进行计算。", crowd.getId());
                    continue;
                }
                if (CrowdConstants.CrowdCalcStatus.STATUS_UNUSUAL == (crowd.getCalcStatus())
                    || CrowdConstants.CrowdCalcStatus.STATUS_NOT_START == (crowd.getCalcStatus())) {
                    recountAndUpdateRelateRecord(record, crowd);
                    continue;
                }
                // 人群已完成状态，但可能不是当天更新

                switch (crowd.getCrowdType()) {
                    case CrowdConstants.CrowdType.CROWD_TYPE_ACCURATE_FILE:
                    case CrowdConstants.CrowdType.CROWD_TYPE_LOOKLIKE:
                    case CrowdConstants.CrowdType.CROWD_TYPE_SCENE:
                        recountAndUpdateRelateRecord(record, crowd);
                        break;
                    case CrowdConstants.CrowdType.CROWD_TYPE_ACCURATE_HISTORY:
                        CrowdInfoResp crowdInfo = crowdApi.getCrowdInfo(record.getRefId());
                        if (crowdInfo == null) {
                            continue;
                        }
                        if (crowdTodayAlreadyUpdate(new Date(crowdInfo.getUpdateDataTime()))) {
                            logger.info("用户运营平台返回的最后更新时间为{}无需进行计算。", new Date(crowdInfo.getUpdateDataTime()));
                            saveFinishCrowdAndRecord(crowd, record, crowdInfo);
                            updateSegmentCrowdVersion(segmentList, crowd);
                            break;
                        }
                        if (CrowdConstants.CrowdCalcStatus.STATUS_NOT_START == (crowdInfo.getCalcStatus())
                            || CrowdConstants.CrowdCalcStatus.STATUS_IN_PROGRESS == (crowdInfo.getCalcStatus())) {
                            record.setStatus(CrowdConstants.CrowdCalcStatus.STATUS_IN_PROGRESS);
                            updateCrowdTaskCalcObjectRecord(record);
                            resetCrowd(crowd);
                        }
                        if (CrowdConstants.CrowdCalcStatus.STATUS_FINISH == (crowdInfo.getCalcStatus())) {
                            recountAndUpdateRelateRecord(record, crowd);
                        }
                    default:
                        logger.info("状态不正常");
                }
            } catch (Exception e) {
                logger.error("人群计算任务异常,人群计算任务为:" + record.getId(), e);
                try {
                    calcObjectRecordService.updateCalcObjectRecordStatusById(record, CrowdTaskCalcObjectRecordConstants.FAIL);
                } catch (Exception e1) {
                    logger.error("人群计算任务异常,人群计算任务为:" + record.getId(), e1);
                }
            }
        }
        logger.info("======================人群计算任务结束======================");

    }

    private void recountAndUpdateRelateRecord(CrowdTaskCalcObjectRecord crowdTaskCalcObjectRecord, Crowd crowd) throws Exception {
        logger.info("开始计算人群,人群ID为:{},人群名称为:{}", crowd.getId(), crowd.getRefName());
        Integer status = crowdApi.recount(crowd.getRefId());
        // 远程API返回状态为 成功(1) 人群正在计算中、人群正在重试中、人群正在终止中(-1)时表明当前统计任务正在运行中
        if ((CrowdDmpApiConstants.CrowdDmpApiRestartStatusConstants.SUCCESS == status
            || CrowdDmpApiConstants.CrowdDmpApiRestartStatusConstants.RUNNING == status)) {
            logger.info("人群计算平台重新计算发起成功。人群ID:{} 人群名称:{} 计算任务ID:{} 更新人群计算状态为进行中(1),计算任务的状态为进行中(1)", crowd.getId(), crowd.getRefName(),
                crowdTaskCalcObjectRecord.getId());
            calcObjectRecordService.updateCalcObjectRecordStatusById(crowdTaskCalcObjectRecord, CrowdTaskCalcObjectRecordConstants.PROGRESSING);
            // 同时更新人群的计算状态为 进行中
            updateCrowdCalcStatus(crowd, CrowdConstants.CrowdCalcStatus.STATUS_IN_PROGRESS);
        } else if (status != null && CrowdDmpApiConstants.CrowdDmpApiRestartStatusConstants.CROWD_DETETE == status) {
            logger.info("人群计算平台对应的人群已经删除,重新计算失败。人群ID:{} 人群名称:{} 计算任务ID:{} 更新人群计算状态为异常(-1),计算任务的状态为异常(-1)", crowd.getId(), crowd.getRefName(),
                crowdTaskCalcObjectRecord.getId());
            crowdTaskCalcObjectRecord.setErrorInfo("人群计算平台对应的人群已经删除,重新计算失败。");
            calcObjectRecordService.updateCalcObjectRecordStatusById(crowdTaskCalcObjectRecord, CrowdTaskCalcObjectRecordConstants.FAIL);
            // 同时更新人群的计算状态异常
            updateCrowdCalcStatus(crowd, CrowdConstants.CrowdCalcStatus.STATUS_UNUSUAL);
        } else if (status != null && CrowdDmpApiConstants.CrowdDmpApiRestartStatusConstants.EXCEPTION == status) {
            logger.info("人群计算平台发起重新计算失败。人群ID:{} 人群名称:{} 计算任务ID:{} 更新人群计算状态为异常(-1),计算任务的状态为异常(-1)", crowd.getId(), crowd.getRefName(),
                crowdTaskCalcObjectRecord.getId());
            crowdTaskCalcObjectRecord.setErrorInfo("人群计算平台发起重新计算失败");
            calcObjectRecordService.updateCalcObjectRecordStatusById(crowdTaskCalcObjectRecord, CrowdTaskCalcObjectRecordConstants.FAIL);
            // 同时更新人群的计算状态异常
            updateCrowdCalcStatus(crowd, CrowdConstants.CrowdCalcStatus.STATUS_UNUSUAL);
        } else {
            logger.info("人群计算平台返回未知状态。人群ID:{} 人群名称:{} 计算任务ID:{}更新人群计算状态为异常(-1),计算任务的状态为异常(-1)", crowd.getId(), crowd.getRefName(),
                crowdTaskCalcObjectRecord.getId());
            crowdTaskCalcObjectRecord.setErrorInfo("人群计算平台返回未知状态");
            calcObjectRecordService.updateCalcObjectRecordStatusById(crowdTaskCalcObjectRecord, CrowdTaskCalcObjectRecordConstants.FAIL);
            // 同时更新人群的计算状态异常
            updateCrowdCalcStatus(crowd, CrowdConstants.CrowdCalcStatus.STATUS_UNUSUAL);
        }
        //        if (status == null || status != CrowdConstants.CrowdCalcStatus.STATUS_IN_PROGRESS) {
        //            logger.error("人群重新计算失败, 人群RefId为:" + crowd.getRefId() + ",计算平台返回的计算状态为:" + status + " 人群名称为:" + crowd.getRefName());
        //            crowdTaskCalcObjectRecord.setStatus(CrowdConstants.CrowdCalcStatus.STATUS_UNUSUAL);
        //            crowd.setCalcStatus(CrowdConstants.CrowdCalcStatus.STATUS_UNUSUAL);
        //        } else {
        //            crowdTaskCalcObjectRecord.setStatus(CrowdConstants.CrowdCalcStatus.STATUS_IN_PROGRESS);
        //            updateCrowdTaskCalcObjectRecord(crowdTaskCalcObjectRecord);
        //            crowd.setLastVersion(null);
        //            crowd.setCalcStatus(CrowdConstants.CrowdCalcStatus.STATUS_IN_PROGRESS);
        //        }
        //        if (CrowdConstants.CrowdCalcStatus.STATUS_FINISH != crowd.getStatus()) {
        //            crowd.setStatus(crowd.getCalcStatus());
        //        }
        //        updateCrowd(crowd);
    }

    /**
     * @param crowd
     * @param calcStatus
     */
    private void updateCrowdCalcStatus(Crowd crowd, Integer calcStatus) throws Exception {
        if (crowd.getCalcStatus() != CrowdConstants.CrowdCalcStatus.STATUS_NOT_START) {
            logger.info("人群计算状态不为未开始,不允许更新，该人群可能由别的计算任务已经发起计算。人群ID:{} 人群名称:{} 更新人群计算状态为异常(-1),计算任务的状态为异常(-1)", crowd.getId(), crowd.getRefName());
            return ;
        }
        Crowd updateCrowd = new Crowd();
        updateCrowd.setId(crowd.getId());
        updateCrowd.setCalcStatus(calcStatus);
        crowdService.updateByPrimaryKeySelective(updateCrowd);
    }



    private void updateCrowdTaskCalcObjectRecord(CrowdTaskCalcObjectRecord crowdTaskCalcObjectRecord) {
        try {
            calcObjectRecordService.updateByPrimaryKeySelective(crowdTaskCalcObjectRecord);
        } catch (Exception e) {
            logger.error("updateCrowdTaskCalcObjectRecord err:", e);
        }
    }

    private void saveFinishCrowdAndRecord(Crowd crowd, CrowdTaskCalcObjectRecord record, CrowdInfoResp crowdInfoResp) throws Exception {
        String crowdVersion = String.valueOf(System.currentTimeMillis());
        boolean success = crowdApi.snapshotCrowd(crowd.getRefId(), crowdVersion);
        if (success) {
            crowd.setCalcStatus(crowdInfoResp.getCalcStatus());
            crowd.setEstimatedSize(crowdInfoResp.getCrowdCount());
            crowd.setLastVersion(crowdVersion);
            crowd.setLastUpdateTime(new Date(crowdInfoResp.getUpdateDataTime()));
            CrowdEstimateResp estimateResp = crowdApi.getEstimateById(crowd.getRefId());
            if (estimateResp == null) {
                logger.error("crowdApi getEstimateById null,refId:{},crowdId:{}", crowd.getRefId(), crowd.getId());
            } else {
                crowd.setPushEstimatedSize(estimateResp.getTdId());
                crowd.setSmsEstimatedSize(estimateResp.getPhoneNum());
                crowd.setAdEstimatedSize(estimateResp.getIDFA());
            }
            record.setStatus(CrowdConstants.CrowdCalcStatus.STATUS_FINISH);
        } else {
            logger.error("copy crowd fail,crowd id:{}", crowd.getId());
            record.setStatus(CrowdConstants.CrowdCalcStatus.STATUS_UNUSUAL);
            crowd.setLastVersion(null);
            crowd.setCalcStatus(CrowdConstants.CrowdCalcStatus.STATUS_UNUSUAL);
        }
        updateCrowd(crowd);
        updateCrowdTaskCalcObjectRecord(record);
    }

    private void updateSegmentCrowdVersion(List<Segment> segmentList, Crowd crowd) {
        List<Integer> segmentIdList = new ArrayList();
        for (Segment segment : segmentList) {
            if (segment.getCrowdId().equals(crowd.getId())) {
                segmentIdList.add(segment.getId());
            }
        }
        segmentService.updateCrowdVersion(segmentIdList, crowd.getLastVersion());
    }

    private void resetCrowd(Crowd crowd) {
        crowd.setCalcStatus(CrowdConstants.CrowdCalcStatus.STATUS_IN_PROGRESS);
        crowd.setLastVersion(null);
        updateCrowd(crowd);
    }

    private void updateCrowd(Crowd crowd) {
        try {
            crowdService.updateByPrimaryKeySelective(crowd);
        } catch (Exception e) {
            logger.error("updateCrowd err:", e);
        }
    }

    private List<CrowdTaskCalcObjectRecord> getNotStartObjectRecords() {
        CrowdTaskCalcObjectRecordPage page = new CrowdTaskCalcObjectRecordPage();
        page.setStatus(String.valueOf(CrowdConstants.CrowdCalcStatus.STATUS_NOT_START));
        page.getPager().setPageEnabled(false);
        try {
            return calcObjectRecordService.queryByList(page);
        } catch (Exception e) {
            logger.error("get calc object record error", e);
            return null;
        }
    }

    //    private Map<Integer, Crowd> getCrowdMapByIdList(List<Integer> crowdIdList) {
    //        List<Crowd> crowdList;
    //        if (crowdIdList.size() <= 0) {
    //            return Collections.EMPTY_MAP;
    //        }
    //        try {
    //            crowdList = crowdService.selectByIds(crowdIdList);
    //        } catch (Exception e) {
    //            logger.error("get crowd error",e);
    //            return Collections.emptyMap();
    //        }
    //        Map<Integer, Crowd> crowdMap = new HashMap(16);
    //        for (Crowd crowd : crowdList) {
    //            crowdMap.put(crowd.getId(), crowd);
    //        }
    //        return crowdMap;
    //    }

    private boolean crowdTodayAlreadyUpdate(Date date) {
        if (date == null) {
            return false;
        }
        return DateUtil.isToday(date);
    }

}
