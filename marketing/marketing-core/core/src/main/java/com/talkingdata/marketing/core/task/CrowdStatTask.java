package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcStatus;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdStatus;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType;
import com.talkingdata.marketing.core.constant.CrowdDmpApiConstants;
import com.talkingdata.marketing.core.constant.CrowdTaskCalcObjectRecordConstants;
import com.talkingdata.marketing.core.constant.ParamConstants;
import com.talkingdata.marketing.core.entity.campaign.CampaignLaunchUnit;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.CrowdTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdEstimateResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdInfoResp;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.middleware.ConfigApi;
import com.talkingdata.marketing.core.middleware.CrowdApi;
import com.talkingdata.marketing.core.service.campaign.CampaignLaunchUnitService;
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

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 人群计算完成任务
 *
 * @author armeng
 */
public class CrowdStatTask implements Job, StatefulJob {

    private static Logger logger = LoggerFactory.getLogger(CrowdStatTask.class);

    private CrowdApi crowdApi;

    private CrowdService crowdService;

    //    private CampaignService campaignService;

    private SegmentService segmentService;

    private ConfigApi configApi;

    //    private EmailSendJobInputService emailSendJobInputService;

    private CampaignLaunchUnitService campaignLaunchUnitService;

    private CrowdTaskCalcObjectRecordService crowdTaskCalcObjectRecordService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        crowdApi = SpringContextUtil.getBean(CrowdApi.class);
        configApi = SpringContextUtil.getBean(ConfigApi.class);
        crowdService = SpringContextUtil.getBean(CrowdService.class);
        segmentService = SpringContextUtil.getBean(SegmentService.class);
        //        campaignService = SpringContextUtil.getBean(CampaignService.class);
        //        emailSendJobInputService = SpringContextUtil.getBean(EmailSendJobInputService.class);
        campaignLaunchUnitService = SpringContextUtil.getBean(CampaignLaunchUnitService.class);
        crowdTaskCalcObjectRecordService = SpringContextUtil.getBean(CrowdTaskCalcObjectRecordService.class);

        logger.info("人群计算完成任务开始执行");

        String taskCalcMaxDuration = configApi.getParam(ParamConstants.MARKETING_TASK_CALC_MAX_DURATION, ParamConstants.SYSTEM_CODE);
        if (taskCalcMaxDuration == null || "".equals(taskCalcMaxDuration)) {
            taskCalcMaxDuration = "16";
        }

        //        Map<Integer, Campaign> processingCampaigns = getAllProcessingCampaigns();
        List<Segment> segmentList = segmentService.getProcessSegment();
        List<CrowdTaskCalcObjectRecord> records = getAllCalculatingRecord();
        for (CrowdTaskCalcObjectRecord record : records) {
            try {
                Crowd crowd = crowdService.selectByPrimaryKey(record.getCrowdId());
                Integer userCloudCrowdId = record.getRefId();
                CrowdInfoResp crowdInfo = crowdApi.getCrowdInfo(userCloudCrowdId);
                if (crowdInfo == null || crowdInfo.getCalcStatus() == null) {
                    logger.info("refId={}人群的在计算平台的计算返回的回执无人群的计算状态,更新计算任务的状态和人群的计算状态为异常", userCloudCrowdId);
                    record.setErrorInfo("人群在计算平台的计算返回的回执无人群的计算状态,任务处理出错");
                    crowdTaskCalcObjectRecordService.updateCalcObjectRecordStatusById(record, CrowdTaskCalcObjectRecordConstants.FAIL);
                    updateCrowdCalcStatus(crowd, CrowdCalcStatus.STATUS_UNUSUAL);
                    continue;
                }

                logger.info("{}人群的在计算平台的计算状态为{}", crowdInfo.getName(), crowdInfo.getCalcStatus());
                // 如果计算平台返回任务正在计算中,则不对任务做任何处理
                if (CrowdDmpApiConstants.CrowdDmpCalcRecordStatusConstants.CALC_STATUS_PENDING == crowdInfo.getCalcStatus()
                    || CrowdDmpApiConstants.CrowdDmpCalcRecordStatusConstants.CALC_STATUS_RUNNING == crowdInfo.getCalcStatus()
                    || CrowdDmpApiConstants.CrowdDmpCalcRecordStatusConstants.CALC_STATUS_STOPING == crowdInfo.getCalcStatus()
                    || CrowdDmpApiConstants.CrowdDmpCalcRecordStatusConstants.CALC_STATUS_RETRYING == crowdInfo.getCalcStatus()) {

                    // 任务开始之后中，如果16小时还未计算成功则强制设置为任务计算超时
                    if (DateUtil.getDiffHours(record.getStartTime(), new Date()) >= Integer.valueOf(taskCalcMaxDuration)) {
                        logger.info("{}人群在计算平台的计算状态为进行中({}),计算发起时间为{} 计算超过{}小时", crowdInfo.getName(), crowdInfo.getCalcStatus(),
                            DateUtil.formatDate2StandradString(record.getStartTime()), taskCalcMaxDuration);
                        record.setErrorInfo(
                            "人群在计算平台的计算状态为进行中(" + crowdInfo.getCalcStatus() + ")计算发起时间为" + DateUtil.formatDate2StandradString(record.getStartTime())
                                + ",计算时间已经超过" + taskCalcMaxDuration + "小时,标记该任务为计算超时");
                        crowdTaskCalcObjectRecordService.updateCalcObjectRecordStatusById(record, CrowdTaskCalcObjectRecordConstants.FAIL);
                        updateCrowdCalcStatus(crowd, CrowdCalcStatus.STATUS_UNUSUAL);
                        continue;
                    }
                    logger.info("{}人群的在计算平台的计算状态为正在计算中,无需执行后续逻辑", crowdInfo.getName());
                    continue;
                }

                // 如果计算平台返回异常,则更新任务状态及人群的计算状态为异常
                if (CrowdDmpApiConstants.CrowdDmpCalcRecordStatusConstants.CALC_STATUS_STOPED == crowdInfo.getCalcStatus()
                    || CrowdDmpApiConstants.CrowdDmpCalcRecordStatusConstants.CALC_STATUS_EXCEPTION == crowdInfo.getCalcStatus()
                    || CrowdDmpApiConstants.CrowdDmpCalcRecordStatusConstants.CALC_STATUS_TIMEOUT == crowdInfo.getCalcStatus()
                    || CrowdDmpApiConstants.CrowdDmpCalcRecordStatusConstants.CALC_STATUS_TORELAUNCH == crowdInfo.getCalcStatus()
                    || CrowdDmpApiConstants.CrowdDmpCalcRecordStatusConstants.CALC_STATUS_RELAUNCH == crowdInfo.getCalcStatus()
                    || CrowdDmpApiConstants.CrowdDmpCalcRecordStatusConstants.CALC_STATUS_SKIPPED == crowdInfo.getCalcStatus()) {
                    logger.info("{}人群在计算平台的计算状态为 {} 为异常状态(4:被终止 -1:计算异常 -2:计算超时 -3:待计算 -4:重新计算 5:无需执行)", crowdInfo.getCalcStatus());
                    record.setErrorInfo("人群在计算平台的计算状态为" + crowdInfo.getCalcStatus() + " 为异常状态(4:被终止 -1:计算异常 -2:计算超时 -3:待计算 -4:重新计算 5:无需执行)。");
                    crowdTaskCalcObjectRecordService.updateCalcObjectRecordStatusById(record, CrowdTaskCalcObjectRecordConstants.FAIL);
                    updateCrowdCalcStatus(crowd, CrowdCalcStatus.STATUS_UNUSUAL);
                    continue;
                }

                // 如果计算平台返回任务计算完成,则更新任务状态及人群信息.
                if (CrowdDmpApiConstants.CrowdDmpCalcRecordStatusConstants.CALC_STATUS_FINISHED == crowdInfo.getCalcStatus()) {
                    logger.info("{}人群的在计算平台的计算状态为计算成功,更新计算任务和人群的计算状态为已完成", crowdInfo.getName());
                    crowdTaskCalcObjectRecordService.updateCalcObjectRecordStatusById(record, CrowdTaskCalcObjectRecordConstants.FINISHED);
                    updateCrowdCalcStatus(crowd, CrowdCalcStatus.STATUS_FINISH);
                    Crowd updateCrowd = syncCrowdStat(record, crowdInfo, crowdInfo.getCalcStatus());
                    updateUnitByCrowd(updateCrowd);
                    updateSegmentCrowdVersion(segmentList, updateCrowd);
                    continue;
                }
                //逻辑删除不存在人群的task
                if (crowdInfo.getStatus() == -100) {
                    logger.info("逻辑删除不存在人群的task,crowdInfo", crowdInfo.toString());
                    record.setStatus(CrowdCalcStatus.STATUS_DELETE);
                    crowdTaskCalcObjectRecordService.updateByPrimaryKeySelective(record);
                    //更新本地库人群状态
                    Crowd updateCrowd = new Crowd();
                    updateCrowd.setId(record.getCrowdId());
                    updateCrowd.setStatus(CrowdStatus.STATUS_DELETE);
                    crowdService.updateByPrimaryKeySelective(updateCrowd);
                    continue;
                }
            } catch (Exception e) {
                logger.error("人群计算完成异常,人群ID:" + record.getCrowdId() + " 人群计算人任务ID:" + record.getId(), e);
                record.setErrorInfo("人群在计算平台的计算返回的回执无人群的计算状态,任务处理出错");
                try {
                    crowdTaskCalcObjectRecordService.updateCalcObjectRecordStatusById(record, CrowdTaskCalcObjectRecordConstants.FAIL);
                    Crowd updateCrowd = new Crowd();
                    updateCrowd.setId(record.getCrowdId());
                    updateCrowdCalcStatus(updateCrowd, CrowdCalcStatus.STATUS_UNUSUAL);
                } catch (Exception e1) {
                    logger.error("人群计算完成异常,更新人群计算状态异常,人群ID:" + record.getCrowdId() + " 人群计算人任务ID:" + record.getId(), e1);
                }
            }
        }
        logger.info("人群计算完成任务计算完成");
    }

    /**
     * @param crowd
     * @param calcStatus
     */
    private void updateCrowdCalcStatus(Crowd crowd, Integer calcStatus) throws Exception {
        Crowd updateCrowd = new Crowd();
        updateCrowd.setId(crowd.getId());
        updateCrowd.setCalcStatus(calcStatus);
        crowdService.updateByPrimaryKeySelective(updateCrowd);
    }

    //    private void sendEmail(Crowd crowd, Map<Integer, Campaign> campaignMap) throws Exception {
    //        CampaignLaunchUnitPage page = new CampaignLaunchUnitPage();
    //        page.setStatus(String.valueOf(CommonConstants.SampleStatusConstants.NORMAL));
    //        page.setCrowdId(String.valueOf(crowd.getId()));
    //        page.setPageSize(Integer.MAX_VALUE);
    //        List<CampaignLaunchUnit> campaignLaunchUnitList = campaignLaunchUnitService.queryByList(page);
    //        String calcResult = "计算异常,请联系管理员!";
    //        if (CrowdCalcStatus.STATUS_FINISH == crowd.getCalcStatus()) {
    //            calcResult = "计算完毕";
    //            if (CrowdType.CROWD_TYPE_SCENE == crowd.getCrowdType()) {
    //                //计算完成的场景人群不需要发送邮件
    //                return;
    //            }
    //        }
    //        for (CampaignLaunchUnit campaignLaunchUnit : campaignLaunchUnitList) {
    //            Campaign campaign = campaignMap.get(campaignLaunchUnit.getCampaignId());
    //            if (campaign == null) {
    //                //单元所属活动已结束
    //                continue;
    //            }
    //            addToEmailSendJob(crowd, campaign, new Date().toString(), calcResult);
    //        }
    //    }

    //    private Map<Integer, Campaign> getAllProcessingCampaigns() {
    //        List<Campaign> campaignList = campaignService.getUnFinishCampaignIdList();
    //        Map<Integer, Campaign> processingCampaigns = new HashMap(16);
    //        for (Campaign campaign : campaignList) {
    //            processingCampaigns.put(campaign.getId(), campaign);
    //        }
    //        return processingCampaigns;
    //    }

    private List<CrowdTaskCalcObjectRecord> getAllCalculatingRecord() {
        return crowdTaskCalcObjectRecordService.queryByCalcStatus(CrowdCalcStatus.STATUS_IN_PROGRESS);
    }

    private Crowd syncCrowdStat(CrowdTaskCalcObjectRecord record, CrowdInfoResp crowdInfo, Integer calcStatus) throws Exception {
        Crowd crowd = crowdService.selectByPrimaryKey(record.getCrowdId());
        if (crowd == null) {
            logger.error("人群不存在, 人群ID: " + record.getCrowdId());
            throw new MktException("人群不存在,人群ID: " + record.getCrowdId());
        }
        crowd = buildCrowdByCrowdInfo(crowd, record, crowdInfo, calcStatus);
        crowdService.updateByPrimaryKeySelective(crowd);
        return crowd;
    }

    private Crowd buildCrowdByCrowdInfo(Crowd crowd, CrowdTaskCalcObjectRecord record, CrowdInfoResp crowdInfo, Integer calcStatus)
        throws IOException {
        crowd.setCalcStatus(calcStatus);
        if (calcStatus != CrowdCalcStatus.STATUS_FINISH) {
            //status fail
            return crowd;
        }
        String crowdVersion = String.valueOf(System.currentTimeMillis());
        boolean copySuccess = crowdApi.snapshotCrowd(crowdInfo.getId(), crowdVersion);
        if (!copySuccess) {
            // copy fail
            logger.error("copy crowd fail,crowd id:{}", crowd.getId());
            crowd.setCalcStatus(CrowdCalcStatus.STATUS_UNUSUAL);
            return crowd;
        }
        // status ok && copy success
        crowd.setStatus(calcStatus);
        crowd.setLastUpdateTime(new Date(crowdInfo.getUpdateDataTime()));
        crowd.setLastVersion(crowdVersion);
        // now CROWD_TYPE_ACCURATE_FILE do not need get their estimate
        if (CrowdType.CROWD_TYPE_ACCURATE_FILE != crowd.getCrowdType()) {
            crowd.setEstimatedSize(crowdInfo.getCrowdCount());
            CrowdEstimateResp estimateResp = crowdApi.getEstimateById(record.getRefId());
            if (estimateResp != null) {
                crowd.setPushEstimatedSize(estimateResp.getTdId());
                crowd.setSmsEstimatedSize(estimateResp.getPhoneNum());
                crowd.setAdEstimatedSize(estimateResp.getIDFA());
            }
        }
        return crowd;
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

    private void updateUnitByCrowd(Crowd crowd) {
        if (crowd == null) {
            return;
        }
        if (CrowdCalcStatus.STATUS_FINISH != crowd.getCalcStatus()) {
            return;
        }
        CampaignLaunchUnit campaignLaunchUnit = new CampaignLaunchUnit();
        campaignLaunchUnit.setCrowdUpdateTime(crowd.getLastUpdateTime());
        campaignLaunchUnit.setCrowdVersion(crowd.getLastVersion());
        campaignLaunchUnit.setEstimatedSize(crowd.getEstimatedSize());
        campaignLaunchUnit.setPushEstimatedSize(crowd.getPushEstimatedSize());
        campaignLaunchUnit.setSmsEstimatedSize(crowd.getSmsEstimatedSize());
        campaignLaunchUnit.setAdEstimatedSize(crowd.getAdEstimatedSize());
        campaignLaunchUnitService.updateInCalcUnitByCrowdId(campaignLaunchUnit, crowd.getId());
    }

    //    private void addToEmailSendJob(Crowd crowd, Campaign campaign, String title, String calcDesc) throws Exception {
    //        User user = UmRmiServiceFactory.getSecurityService().getUserByUmId(crowd.getCreateBy());
    //        if (user == null) {
    //            logger.error("crowd.getId() =" + crowd.getId() + "没有找到creator");
    //            return;
    //        }
    //        EmailSendJobInput emailSendJobInput = new EmailSendJobInput();
    //        emailSendJobInput.setTo(user.getEmail());
    //        emailSendJobInput.setTitle(title);
    //        emailSendJobInput.setStatus(EmailConstant.EmailSendStatusConstants.EMAIL_SEND_STATUS_UNSENT);
    //        emailSendJobInput.setEmailServerCode(CommonConstants.MAIL_SERVER_CODE);
    //        emailSendJobInput.setEmailTemplateCode(CommonConstants.MAIL_CROWD_TEMPLATE);
    //        emailSendJobInput.setCreateTime(new Date());
    //        //最多尝试发送三次
    //        emailSendJobInput.setMaxRetry(3);
    //
    //        EmailTemplate emailTemplate = configApi.getEmailTemplate(CommonConstants.MAIL_CROWD_TEMPLATE);
    //        if (null != emailTemplate) {
    //            String content = emailTemplate.getContent();
    //            content = content.replace("{campaign}", campaign.getName()).replace("{crowd}", crowd.getRefName()).replace("{calcDesc}", calcDesc)
    //                .replaceAll(" ", "&nbsp;").replaceAll("\n", "<br/>");
    //            emailSendJobInput.setContent(content);
    //            emailSendJobInputService.insert(emailSendJobInput);
    //        }
    //    }
}
