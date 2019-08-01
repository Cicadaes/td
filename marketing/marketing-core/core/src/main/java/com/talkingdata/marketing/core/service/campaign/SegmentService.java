package com.talkingdata.marketing.core.service.campaign;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.AttachmentConstants;
import com.talkingdata.marketing.core.constant.ChannelConstants;
import com.talkingdata.marketing.core.constant.CommonConstants;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType;
import com.talkingdata.marketing.core.constant.PlatformConstants;
import com.talkingdata.marketing.core.constant.PushConstants;
import com.talkingdata.marketing.core.constant.SegmentConstant;
import com.talkingdata.marketing.core.constant.SegmentConstant.SegmentStatusConstant;
import com.talkingdata.marketing.core.constant.SegmentTaskCalcObjectRecordConstant;
import com.talkingdata.marketing.core.constant.TriggerConstants;
import com.talkingdata.marketing.core.dao.campaign.SegmentDao;
import com.talkingdata.marketing.core.entity.admin.ChannelDefinition;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.CrowdTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.campaign.SegmentCrowdRel;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.dto.SegmentDto;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.page.admin.ChannelDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.AttachmentPage;
import com.talkingdata.marketing.core.page.campaign.SegmentPage;
import com.talkingdata.marketing.core.page.campaign.SegmentTaskCalcObjectRecordPage;
import com.talkingdata.marketing.core.service.admin.ChannelDefinitionService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.core.util.CronDateUtils;
import com.talkingdata.marketing.core.util.HttpClientUtil;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.vo.campaign.SegmentVO;
import com.talkingdata.marketing.core.vo.push.AbstractAppPushPlan;
import com.talkingdata.marketing.core.vo.push.AbstractPushData;
import com.talkingdata.marketing.core.vo.push.AndroidAppPushPlan;
import com.talkingdata.marketing.core.vo.push.AppPushData;
import com.talkingdata.marketing.core.vo.push.EDMPushData;
import com.talkingdata.marketing.core.vo.push.SmsPushData;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.annotations.Param;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * <br>
 * <b>功能：</b>TD_MKT_SEGMENT SegmentService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("segmentService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SegmentService extends BaseService<Segment, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(SegmentService.class);

    @Autowired private SegmentDao dao;

    @Autowired private CrowdService crowdService;

    @Autowired private ChannelDefinitionService channelDefinitionService;

    @Autowired private CampaignService campaignService;

    @Autowired private ExceptionBuilder exceptionBuilder;

    @Autowired private SegmentTaskCalcObjectRecordService segmentTaskCalcObjectRecordService;

    @Autowired private CrowdTaskCalcObjectRecordService crowdTaskCalcObjectRecordService;

    @Autowired private AttachmentService attachmentService;

    @Autowired private SegmentCrowdRelService segmentCrowdRelService;

    /**
     * Gets content from url.
     *
     * @param url the url
     * @return the content from url
     * @throws Exception the exception
     */
    public static String getContentFromUrl(String url) throws Exception {
        String resp = HttpClientUtil.get(url);
        return resp;
    }

    @Override public SegmentDao getDao() {
        return dao;
    }

    /**
     * Query by status list.
     *
     * @param status the status
     * @return the list
     */
    public List<SegmentDto> queryByStatus(int[] status) {
        Map map = new HashMap(16);
        map.put("statusArray", status);
        return getDao().queryByStatus(map);
    }

    /**
     * Gets segment by status and campaign.
     *
     * @param status          the status
     * @param crowdUpdateType the crowd update type
     * @return the segment by status and campaign
     */
    public List<Segment> getSegmentByStatusAndCampaignValid( List<Integer> status, Integer crowdUpdateType) {
        return getDao().getSegmentByStatusAndCampaign(status, crowdUpdateType);
    }

    /**
     * Update status by unit id.
     *
     * @param unitId the unit id
     * @param status the status
     */
    public void updateStatusByUnitId(@Param("unitId") Integer unitId, @Param("status") Integer status) {
        getDao().updateStatusByUnitId(unitId, status);
    }

    /**
     * Find by id list list.
     *
     * @param ids the ids
     * @return the list
     */
    public List<Segment> findByIdList(List<Integer> ids) {
        return getDao().queryByIds(ids);
    }

    /**
     * Create ext segment.
     *
     * @param pushData the push data
     * @param segment  the segment
     * @param attachment    the attachment
     * @return the segment
     * @throws Exception the exception
     */
    public Segment createExt(AbstractPushData pushData, Segment segment, Attachment attachment,SegmentCrowdRel rel) throws Exception {
        checkTargetCount(pushData, segment);
        insert(segment);
        createOrUpdateFile(pushData, segment, attachment);
        createCalcRecordIfNotExist(segment);

        rel.setSegmentId(segment.getId());
        segmentCrowdRelService.insert(rel);
        return segment;
    }

    /**
     * 校验目标人群是否存在
     *
     * @param pushData
     * @param segment
     */
    private void checkTargetCount(AbstractPushData pushData, Segment segment) throws Exception {
        ChannelDefinition channelDefinition = null;
        if (pushData.getChannelCode() != null) {
            channelDefinition = getChannelDefinitionByCode(pushData.getChannelCode());
            segment.setChannelDefinitionId(channelDefinition.getId());
            if (null == channelDefinition) {
                throw new MktException(MktException.Code.RIGHT_TOP, "未找到对应通道");
            }
        }

        //因为有子人群的关系,直接根据Crowd查询,不再通过 营销活动->投放单元->人群
        List<Crowd> crowdList = crowdService.selectByIds(Arrays.asList(segment.getCrowdId()));
        Integer targetCount = getTargetCount(segment, channelDefinition, crowdList);
        if (null == targetCount || 0 == targetCount) {
            throw new MktException(MktException.Code.RIGHT_TOP, "未找到该通道目标人群，不能添加此类投放");
        }
    }

    private Integer getTargetCount(Segment segment, ChannelDefinition channelDefinition, List<Crowd> crowdList) throws JsonProcessingException {
        Integer targetCount = 0;
        if (segment.getCrowdId() != null && CollectionUtils.isNotEmpty(crowdList)) {
            logger.info("查找通道人群数量.segment.crowdId={},channelDefinition.channelType={},crowdIdList={}", segment.getCrowdId(),
                channelDefinition.getChannelType(), JsonUtil.toJson(crowdList.stream().map(o -> o.getId()).collect(Collectors.toSet())));
            for (Crowd c : crowdList) {
                if (c.getId().equals(segment.getCrowdId())) {
                    targetCount = getTargetCount(channelDefinition.getChannelType(), c);
                    break;
                }
            }
        }
        return targetCount;
    }

    private Integer getTargetCount(Integer channelType, Crowd c) {
        Integer targetCount = c.getEstimatedSize();
        if (null != channelType) {
            if (ChannelConstants.PUSH == channelType) {
                targetCount = c.getPushEstimatedSize();
            } else if (ChannelConstants.SMS == channelType) {
                targetCount = c.getSmsEstimatedSize();
            } else if (ChannelConstants.EDM == channelType) {
                targetCount = c.getEdmEstimatedSize();
            }
        }
        return targetCount;
    }

    /**
     * 保存
     *
     * @param pushData the push data
     * @param segment  the segment
     * @param attachment    the attachment
     * @throws Exception the exception
     */
    public void createOrUpdateFile(AbstractPushData pushData, Segment segment, Attachment attachment) throws Exception {
        logger.info("创建投放保存文件开始.pushData={},segment={}", JsonUtil.toJson(pushData), JsonUtil.toJson(segment));
        ChannelDefinition channelDefinition = null;
        if (pushData.getChannelCode() != null) {
            channelDefinition = getChannelDefinitionByCode(pushData.getChannelCode());
            if (null == channelDefinition || channelDefinition.getChannelType() != ChannelConstants.EDM) {
                return;
            }
        }

        //假设暂时只有邮件有文件
        if (pushData instanceof EDMPushData) {
            EDMPushData edmMessage = (EDMPushData)pushData;
            if (null == edmMessage.getContentType()) {
                if (SegmentStatusConstant.SEGMENT_STATUS_DRAFT == segment.getStatus()) {
                    return;
                }
                throw new MktException(MktException.Code.RIGHT_TOP, "文件内容类型不能为空");
            }

            if (SegmentStatusConstant.SEGMENT_STATUS_DRAFT == segment.getStatus()) {
                if (SegmentConstant.ContentType.REMOTE.equals(edmMessage.getContentType())) {
                    //草稿状态下的网址暂时不需要存库
                    return;
                } else {
                    if (null == attachment) {
                        //草稿状态的文件不存在，直接返回
                        return;
                    }
                }
            }

            if(null != attachment){
                updateAttachment(segment, attachment);
            }

        }
    }

    private void updateAttachment(Segment segment, Attachment attachment) throws Exception {
        Attachment update = new Attachment();
        update.setId(attachment.getId());
        update.setRefId(segment.getId());
        update.setType(AttachmentConstants.AttachmentTypeConstants.ATTACHMENT_TYPE_SEGMENT);
        update.setUpdater(segment.getUpdater());
        update.setUpdaterBy(segment.getUpdateBy());
        update.setUpdateTime(new Date());
        attachmentService.updateByPrimaryKeySelective(update);
    }

    /**
     * Create calc record if not exist.
     *
     * @param segment the segment
     * @throws Exception the exception
     */
    public void createCalcRecordIfNotExist(Segment segment) throws Exception {
        if (SegmentStatusConstant.SEGMENT_STATUS_DRAFT == segment.getStatus()) {
            return;//如果是草稿.直接返回.
        }

        if (segment.getTriggerType() == TriggerConstants.TriggerTypeConstants.NOW) {
            Date now = new Date();
            Campaign campaign = campaignService.selectByPrimaryKey(segment.getCampaignId());
            if (null == campaign || now.before(campaign.getStartTime()) || now.after(campaign.getEndTime())) {
                logger.info("活动不存在或未开始,不能创建立即投放.campaign={},segment={}", JsonUtil.toJson(campaign), JsonUtil.toJson(segment));
                throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CAMPAINGN_NOT_START);
            }

            SegmentTaskCalcObjectRecordPage page = new SegmentTaskCalcObjectRecordPage();
            page.setSegmentId(String.valueOf(segment.getId()));
            SegmentTaskCalcObjectRecord segmentTaskCalcObjectRecord = segmentTaskCalcObjectRecordService.queryBySingle(page);
            if (null == segmentTaskCalcObjectRecord) {
                Date createTime = new Date();
                segmentTaskCalcObjectRecord = new SegmentTaskCalcObjectRecord();
                segmentTaskCalcObjectRecord.setType(SegmentTaskCalcObjectRecordConstant.Type.SEGMENT_CALC_TYPE_SEND);
                segmentTaskCalcObjectRecord.setStatus(SegmentTaskCalcObjectRecordConstant.Status.WAITING);
                segmentTaskCalcObjectRecord.setCampaignId(segment.getCampaignId());
                segmentTaskCalcObjectRecord.setCampaignLaunchUnitId(segment.getCampaignLaunchUnitId());
                segmentTaskCalcObjectRecord.setChannelDefinitionId(segment.getChannelDefinitionId());
                segmentTaskCalcObjectRecord.setSegmentId(segment.getId());
                segmentTaskCalcObjectRecord.setCreateTime(createTime);
                segmentTaskCalcObjectRecord.setStartTime(createTime);
                segmentTaskCalcObjectRecord.setTenantId(segment.getTenantId());
                segmentTaskCalcObjectRecord.setCreator(segment.getCreator());
                segmentTaskCalcObjectRecord.setCreateBy(segment.getCreateBy());
                segmentTaskCalcObjectRecordService.insert(segmentTaskCalcObjectRecord);

                //校验通过后，创建立即投放后，更新segment状态
                Segment seg = new Segment();
                seg.setId(segment.getId());
                seg.setStatus(SegmentStatusConstant.SEGMENT_STATUS_PROGRESS);
                getDao().updateByPrimaryKeySelective(seg);
                logger.info("立即投放创建CalcObjectRecord成功.segmentId={},segmentTaskCalcObjectRecord={}", segment.getId(),
                    JsonUtil.toJson(segmentTaskCalcObjectRecord));
            }

        }
    }


    /**
     * Build segment segment.
     *
     * @param pushData the push data
     * @return the segment
     * @throws Exception the exception
     */
    public Segment buildSegment(AbstractPushData pushData) throws Exception {
        Segment segment = new Segment();
        segment = buildCommon(pushData, segment);
        segment = buildSendTime(segment, pushData);

        if (pushData.getChannelCode() != null) {
            ChannelDefinition channelDefinition = getChannelDefinitionByCode(pushData.getChannelCode());
            if (channelDefinition == null) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CHANNEL_NOT_EXIST);
            }
            segment.setChannelDefinitionId(channelDefinition.getId());
            if (channelDefinition.getChannelType() == ChannelConstants.PUSH) {
                validPushMessage(segment.getMessage());
            } else if (channelDefinition.getChannelType() == ChannelConstants.SMS) {
                validSmsMessage(segment.getMessage());
            }
        }

        Crowd crowd = crowdService.selectByPrimaryKey(segment.getCrowdId());
        logger.info("创建投放,检查人群.crowd={}", JsonUtil.toJson(crowd));
        if (crowd == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CROWD_NOT_EXIST);
        } else {
            if (CrowdType.CROWD_TYPE_SCENE == crowd.getCrowdType()) {
                //场景人群创建的投放默认投放前更新人群
                segment.setCrowdUpdateType(SegmentConstant.SegmentCrowdUpdateTypeConstants.SEGMENT_CROWD_UPDATED);
            } else {
                if (segment.getCrowdVersion() == null) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CROWD_VERSION_NOT_EXIST);
                }
                //TODO 未来再打开吧
/*                if (CrowdType.CROWD_TYPE_ACCURATE_FILE != crowd.getCrowdType()) {
                    Integer crowdCount = userCloudApi.getCrowdCountWithVersionApi(crowd.getRefId(), segment.getCrowdVersion());
                    if (crowdCount == null || crowdCount <= 0) {
                        throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CROWD_COUNT_EMPTY);
                    }
                }*/
            }
        }

        return segment;
    }

    private Segment buildCommon(AbstractPushData pushData, Segment segment) throws Exception {
        if (pushData.getCampaignId() == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CAMPAIGN_ID_NOT_EXIST);
        }
        segment.setCampaignId(pushData.getCampaignId());

        if (pushData.getCampaignLaunchUnitId() == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_UNIT_ID_NOT_EXIST);
        }
        segment.setCampaignLaunchUnitId(pushData.getCampaignLaunchUnitId());

        if (pushData.getCrowdId() == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CROWD_ID_NOT_EXIST);
        }
        segment.setCrowdId(pushData.getCrowdId());

        if (StringUtils.isBlank(pushData.getCrowdVersion())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CROWD_VERSION_NOT_EXIST);
        }
        segment.setCrowdVersion(pushData.getCrowdVersion());

        if (pushData.getName() == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_NAME_NOT_EXIST);
        }
        //set default crowd update type with not update
        segment.setCrowdUpdateType(SegmentConstant.SegmentCrowdUpdateTypeConstants.SEGMENT_CROWD_NOT_UPDATED);
        if (pushData.getCrowdUpdateType() != null) {
            segment.setCrowdUpdateType(pushData.getCrowdUpdateType());
        }

        if (null != pushData.getSubCrowdId()) {
            segment.setCrowdId(pushData.getSubCrowdId());
            segment.setCrowdVersion(pushData.getSubCrowdVersion());
        }

        segment.setCrowdVersion(pushData.getCrowdVersion());
        segment.setName(pushData.getName());
        segment.setMessage(JsonUtil.toJson(pushData));
        segment.setTriggerType(pushData.getTriggerType());
        segment.setSubTriggerType(pushData.getSubTriggerType());
        return segment;
    }

    private Segment buildSendTime(Segment segment, AbstractPushData pushData) throws Exception {
        int status = pushData.getStatus();
        if (SegmentStatusConstant.SEGMENT_STATUS_DRAFT != status && SegmentStatusConstant.SEGMENT_STATUS_WAITING != status) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_STATUS_NOT_DRAFT_OR_WAITING);
        }
        segment.setStatus(status);
        if (pushData.getTriggerType() == null) {
            if (SegmentStatusConstant.SEGMENT_STATUS_DRAFT == status) {
                return segment;
            }
        }

        switch (pushData.getTriggerType()) {
            //立即发送
            case 1:
                segment.setAppointedTime(new Date());
                break;
            //定时发送
            case 2:
                if (pushData.getAppointedTime() == null) {
                    if (SegmentStatusConstant.SEGMENT_STATUS_DRAFT == status) {
                        return segment;
                    }
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_SEND_TIME_NOT_EXIST);
                }
                segment.setAppointedTime(new Date(pushData.getAppointedTime()));
                break;
            case 3:
                if(null == pushData.getSubTriggerType()){
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_SUB_TRIGGER_EMPTY);
                }
                if(StringUtils.isBlank(pushData.getCronExpression())){
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CRON_EXPRESSION_EMPTY);
                }
                segment.setCronExpression(pushData.getCronExpression());
            default:
                break;
        }
        //validCycleSendTime(tp, page);
        //String cronExpression = CronDateUtils.buildCron(Integer.parseInt(page.getTriggerType()), page.getCycleHour(), page.getCycleMinute(), page.getCycleVal(), page.getCycleVal());
        //logger.info("build cron:" + cronExpression);

        return segment;
    }

    private void validCycleSendTime(int tp, SegmentVO page) throws Exception {
        String dayVal = exceptionBuilder.getMessage(ExceptionMessage.SEGMENT_CYCLE_DAY);
        String weekVal = exceptionBuilder.getMessage(ExceptionMessage.SEGMENT_CYCLE_WEEK);
        String monthVal = exceptionBuilder.getMessage(ExceptionMessage.SEGMENT_CYCLE_MONTH);
        String hourVal = exceptionBuilder.getMessage(ExceptionMessage.SEGMENT_CYCLE_HOUR);
        String minuteVal = exceptionBuilder.getMessage(ExceptionMessage.SEGMENT_CYCLE_MINUTE);
        switch (tp) {
            case TriggerConstants.SubTriggerTypeConstants.DAY:
                if (page.getCycleHour() == null) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CYCLE_PARAM_INVALID, dayVal, hourVal);
                }
                if (page.getCycleMinute() == null) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CYCLE_PARAM_INVALID, dayVal, minuteVal);
                }
                break;
            case TriggerConstants.SubTriggerTypeConstants.WEEK:
                if (page.getCycleHour() == null) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CYCLE_PARAM_INVALID, weekVal, hourVal);
                }
                if (page.getCycleMinute() == null) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CYCLE_PARAM_INVALID, weekVal, minuteVal);
                }
                if (page.getCycleVal() == null) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CYCLE_PARAM_INVALID, weekVal, weekVal);
                }
                break;
            case TriggerConstants.SubTriggerTypeConstants.MONTH:
                if (page.getCycleHour() == null) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CYCLE_PARAM_INVALID, monthVal, hourVal);
                }
                if (page.getCycleMinute() == null) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CYCLE_PARAM_INVALID, monthVal, minuteVal);
                }
                if (page.getCycleVal() == null) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CYCLE_PARAM_INVALID, monthVal, monthVal);
                }
                break;
            default:
                break;
        }
    }

    private void validSmsMessage(String content) throws Exception {
        if (content == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_MESSAGE_NOT_EXIST);
        }
        SmsPushData smsContent = JsonUtil.toObject(content, SmsPushData.class);
        if (smsContent == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_MESSAGE_INVALID);
        }
        if (StringUtils.isBlank(smsContent.getContent())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_MESSAGE_EMPTY);
        }
    }

    private void validPushMessage(String content) throws Exception {
        logger.info("validPushMessage,content={}", content);
        if (content == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_MESSAGE_NOT_EXIST);
        }
        AbstractPushData pushData = JsonUtil.toObject(content, AbstractPushData.class);
        if (pushData == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_MESSAGE_INVALID);
        }
        AppPushData appPushData = (AppPushData)pushData;
        if (CollectionUtils.isEmpty(appPushData.getAndroidData()) && CollectionUtils.isEmpty(appPushData.getIosData())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_MESSAGE_NOT_EXIST);
        }
        if (StringUtils.isBlank(appPushData.getAppid())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_PUSH_APP_NOT_EXIST);
        }
        if (!PlatformConstants.IOS.equals(appPushData.getPlatform()) && !PlatformConstants.ANDROID.equals(appPushData.getPlatform())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_PUSH_OS_INVALID);
        }

        int ratio = 0;
        List<AbstractAppPushPlan> messageList = null;
        if (PlatformConstants.ANDROID.equals(appPushData.getPlatform())) {
            messageList = appPushData.getAndroidData().stream().collect(Collectors.toList());
        } else {
            messageList = appPushData.getIosData().stream().collect(Collectors.toList());
        }

        for (AbstractAppPushPlan msg : messageList) {
            Integer action = msg.getAction();
            boolean isInvalidAction = action == null || (PushConstants.PUSH_OPEN_WITH_APP != action && PushConstants.PUSH_WITH_SILENCE != action);
            if (isInvalidAction) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_PUSH_ACTION_INVALID);
            }
            if (msg.getRatio() != null) {
                ratio += msg.getRatio();
            }
            if (PushConstants.PUSH_OPEN_WITH_APP == action) {
                if (PlatformConstants.ANDROID.equals(appPushData.getPlatform())) {
                    AndroidAppPushPlan androidPlan = (AndroidAppPushPlan)msg;
                    String title = androidPlan.getTitle();
                    if (StringUtils.isBlank(title)) {
                        throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_PUSH_TITLE_NOT_EXIST);
                    }
                }
                String con = msg.getMessage();
                if (StringUtils.isBlank(con)) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_PUSH_CONTENT_NOT_EXIST);
                }
            }
        }
        int fullRatio = 100;
        if (messageList.size() > 1) {
            if (ratio != fullRatio) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_RATIO_INVALID);
            }
        }
    }

    private ChannelDefinition getChannelDefinitionByCode(String code) throws Exception {
        if (code == null || "".equals(code)) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CHANNEL_CODE_NOT_EXIST);
        }
        ChannelDefinitionPage page = new ChannelDefinitionPage();
        page.setCode(code);
        ChannelDefinition channelDefinition = channelDefinitionService.queryBySingle(page);
        if (channelDefinition == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CHANNEL_NOT_EXIST);
        }

        if (channelDefinition.getChannelType() == null) {
            logger.error("bug:channel type is null");
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CHANNEL_TYPE_NOT_EXIST);
        }
        return channelDefinition;
    }

    public SegmentCrowdRel buildSegmentCrowdRel(Segment seg,HttpServletRequest request) throws Exception {
        SegmentCrowdRel rel = new SegmentCrowdRel();
        rel.setCampaignId(seg.getCampaignId());
        rel.setCampaignLaunchUnitId(seg.getCampaignLaunchUnitId());
        rel.setCrowdVersion(seg.getCrowdVersion());
        AssignmentUtil.setInfo(rel, request);
        Crowd crowd = crowdService.selectByPrimaryKey(seg.getCrowdId());
        rel.setCrowdType(crowd.getCrowdType());
        rel.setCrowdVersion(crowd.getLastVersion());
        rel.setCrowdName(crowd.getRefName());
        rel.setCrowdId(crowd.getId());
        return rel;
    }
    /**
     * Gets extend page.
     *
     * @param page the page
     * @return the extend page
     * @throws Exception the exception
     */
    public List<SegmentVO> getExtendPage(SegmentPage page) throws Exception {
        page.setOrderBy(Segment.fieldToColumn(page.getOrderBy()));
        page.getPager().setPageEnabled(false);
        page.setStatus(String.valueOf(CommonConstants.SampleStatusConstants.DELETE));
        page.setStatusOperator("!=");
        page.setOrderBy("IFNULL(appointed_time,create_time)");
        page.setOrder("asc");
        List<Segment> segmentList = queryByList(page);
        List<SegmentVO> segExtendList = new ArrayList();
        if (CollectionUtils.isNotEmpty(segmentList)) {
            segmentList = moveDraftCycleSegmentToTail(segmentList);
            List<Integer> crowdIdList =
                new ArrayList<>(segmentList.stream().map(o -> o.getCrowdId()).filter(id -> id != null).collect(Collectors.toSet()));
            if (CollectionUtils.isNotEmpty(crowdIdList)) {
                List<Crowd> crowdList = crowdService.selectByIds(crowdIdList);
                Map<Integer, Crowd> crowdMap = crowdList.stream()
                    .collect(Collector.of(HashMap::new, (m, per) -> m.put(per.getId(), per), (k, v) -> v, Collector.Characteristics.IDENTITY_FINISH));
                Map<Integer, ChannelDefinition> channelDefinitionMap = channelDefinitionService.loadChannelDefinition();
                for (Segment segment : segmentList) {
                    SegmentVO segmentVOPage = buildSegmentVO(segment, crowdMap);
                    ChannelDefinition channelDefinition = channelDefinitionMap.get(segment.getChannelDefinitionId());
                    if (channelDefinition != null) {
                        segmentVOPage.setChannelType(channelDefinition.getChannelType());
                    }
                    segExtendList.add(segmentVOPage);
                }
            }
        }

        return segExtendList;
    }

    /**
     * Move draft cycle segment to tail list.
     *
     * @param segmentList the segment list
     * @return the list
     */
    public List<Segment> moveDraftCycleSegmentToTail(List<Segment> segmentList) {
        List<Segment> copyDraftSegmentList = new ArrayList();
        List<Segment> copyCycleSegmentList = new ArrayList();
        List<Segment> copyOtherSegmentList = new ArrayList();
        for (Segment segment : segmentList) {
            if (segment.getStatus() != null) {
                if (segment.getStatus() == SegmentStatusConstant.SEGMENT_STATUS_DRAFT) {
                    copyDraftSegmentList.add(segment);
                } else if (segment.getAppointedTime() == null) {
                    copyCycleSegmentList.add(segment);
                } else {
                    copyOtherSegmentList.add(segment);
                }
            }
        }
        copyOtherSegmentList.addAll(copyCycleSegmentList);
        copyOtherSegmentList.addAll(copyDraftSegmentList);
        return copyOtherSegmentList;
    }

    /**
     * Gets extend page by segment id.
     *
     * @param segmentId the segment id
     * @return the extend page by segment id
     * @throws Exception the exception
     */
    public SegmentVO getExtendPageBySegmentId(Integer segmentId) throws Exception {
        Segment segment = selectByPrimaryKey(segmentId);
        if (segment == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_NOT_EXIST);
        }
        Crowd crowd = crowdService.selectByPrimaryKey(segment.getCrowdId());
        if (crowd == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CROWD_NOT_EXIST);
        }
        Map<Integer, Crowd> crowdMap = new HashMap<>(4);
        crowdMap.put(crowd.getId(), crowd);
        SegmentVO page = buildSegmentVO(segment, crowdMap);
        if (segment.getChannelDefinitionId() == null) {
            return page;
        }
        ChannelDefinition channelDefinition = channelDefinitionService.selectByPrimaryKey(segment.getChannelDefinitionId());
        if (channelDefinition == null) {
            return page;
        }
        page.setCrowdVersion(segment.getCrowdVersion());
        page.setChannelType(channelDefinition.getChannelType());
        page.setChannelCode(channelDefinition.getCode());
        return page;
    }

    /**
     * Update crowd version.
     *
     * @param segmentIdList the segment id list
     * @param crowdVersion  the crowd version
     */
    public void updateCrowdVersion(List<Integer> segmentIdList, String crowdVersion) {
        if (segmentIdList == null) {
            return;
        }
        if (segmentIdList.size() <= 0) {
            return;
        }
        getDao().updateCrowdVersion(segmentIdList, crowdVersion);
    }

    /**
     * Gets process segment.
     *
     * @return the process segment
     */
    public List<Segment> getProcessSegment() {
        List<Integer> statusList = new ArrayList();
        statusList.add(SegmentStatusConstant.SEGMENT_STATUS_WAITING);
        statusList.add(SegmentStatusConstant.SEGMENT_STATUS_PROGRESS);
        statusList.add(SegmentStatusConstant.SEGMENT_STATUS_FAIL);
        statusList.add(SegmentStatusConstant.SEGMENT_STATUS_LOOP);
        return getSegmentByStatusAndCampaignValid(statusList, SegmentConstant.SegmentCrowdUpdateTypeConstants.SEGMENT_CROWD_UPDATED);
    }

    /**
     * TODO  待删除.
     * @return
     */
    private List<Integer> getUnFinishCampaignIdList() {
        List<Campaign> campaignList = campaignService.getUnFinishCampaignIdList();
        List<Integer> ids = new ArrayList();
        for (Campaign campaign : campaignList) {
            ids.add(campaign.getId());
        }
        return ids;
    }

    /**
     * Sets status.
     *
     * @param id     the id
     * @param status the status
     * @throws Exception the exception
     */
    public void setStatus(Integer id, Integer status) throws Exception {
        if (status != SegmentStatusConstant.SEGMENT_STATUS_PAUSE && status != SegmentStatusConstant.SEGMENT_STATUS_LOOP) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_STATUS_INVALID);
        }

        Segment segment = selectByPrimaryKey(id);
        if (segment == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_STATUS_INVALID);
        }
        if (segment.getStatus() == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_NOT_LOOP);
        }

        if (status == SegmentStatusConstant.SEGMENT_STATUS_PAUSE) {
            if (segment.getStatus() != SegmentStatusConstant.SEGMENT_STATUS_LOOP) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_NOT_LOOP);
            }
        }
        if (status == SegmentStatusConstant.SEGMENT_STATUS_LOOP) {
            if (segment.getStatus() != SegmentStatusConstant.SEGMENT_STATUS_PAUSE) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_NOT_PAUSE);
            }
        }

        segment.setStatus(status);
        updateByPrimaryKeySelective(segment);
    }

    /**
     * Query by status list list.
     *
     * @param statusList the status list
     * @return the list
     */
    public List<Segment> queryByStatusList(List<Integer> statusList) {
        return getDao().queryByStatusList(statusList);
    }

    /**
     * Logical delete.
     *
     * @param id the id
     * @throws Exception the exception
     */
    public void logicalDelete(Integer id) throws Exception {
        Segment segment = selectByPrimaryKey(id);
        if (segment == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_NOT_EXIST);
        }
        if (segment.getStatus() == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_STATUS_NOT_EXIST);
        }
        if (SegmentStatusConstant.SEGMENT_STATUS_DRAFT != segment.getStatus() && SegmentStatusConstant.SEGMENT_STATUS_WAITING != segment
            .getStatus()) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CANNOT_DELETE);
        }
        deleteByPrimaryKey(id);
    }

    /**
     * Query valid segment list.
     *
     * @param page the page
     * @return the list
     * @throws Exception the exception
     */
    public List<Segment> queryValidSegment(SegmentPage page) throws Exception {
        List<Segment> segmentList = queryByList(page);
        List<Segment> validSegmentList = new ArrayList();
        int total = 0;
        for (Segment segment : segmentList) {
            if (SegmentStatusConstant.SEGMENT_STATUS_DRAFT == segment.getStatus()) {
                continue;
            }
            if (SegmentStatusConstant.SEGMENT_STATUS_DELETE == segment.getStatus()) {
                continue;
            }
            total++;
            validSegmentList.add(segment);
        }
        page.getPager().setRowCount(total);
        return validSegmentList;
    }

    /**
     * Is type boolean.
     *
     * @param segment the segment
     * @param tp      the tp
     * @return the boolean
     */
    public boolean isType(Segment segment, Integer tp) {
        return segment.getTriggerType().equals(tp);
    }

    /**
     * Query by ids list.
     *
     * @param ids the ids
     * @return the list
     */
    public List<Segment> queryByIds(List<Integer> ids) {
        return getDao().queryByIds(ids);
    }

    /**
     * Delete by create time.
     *
     * @param createTime the create time
     * @throws Exception the exception
     */
    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }

    /**
     * Get calc record by segment ids map.
     *
     * @param segmentIdList the segment id list
     * @return the map
     */
    //TODO  待删除.
    public Map<Integer, SegmentTaskCalcObjectRecord> getCalcRecordBySegmentIds(List<Integer> segmentIdList) {
        List<SegmentTaskCalcObjectRecord> recordLIst = segmentTaskCalcObjectRecordService.listBySegmentIds(segmentIdList);
        if (CollectionUtils.isEmpty(recordLIst)) {
            return Collections.EMPTY_MAP;
        }
        Map<Integer, SegmentTaskCalcObjectRecord> map = new HashMap(16);
        for (SegmentTaskCalcObjectRecord record : recordLIst) {
            map.put(record.getSegmentId(), record);
        }
        return map;
    }

    /**
     * Gets crowd by segment id.
     *
     * @param segmentId the segment id
     * @return the crowd by segment id
     * @throws Exception the exception
     */
    public Crowd getCrowdBySegmentId(Integer segmentId) throws Exception {
        Segment segment = getDao().selectByPrimaryKey(segmentId);
        if (segment == null) {
            return null;
        }
        return crowdService.selectByPrimaryKey(segment.getCrowdId());
    }

    /**
     * 创建SegmentVO
     *
     * @param segment  the segment
     * @param crowdMap the crowd map
     * @return the segment extend page
     * @throws IOException the io exception
     */
    public SegmentVO buildSegmentVO(Segment segment, Map<Integer, Crowd> crowdMap) throws Exception {
        SegmentVO segmentVO = new SegmentVO();
        BeanUtils.copyProperties(segment, segmentVO);

        determinChannelInfo(segmentVO);

        determineCrowdInfo(segment, crowdMap, segmentVO);

        if (null != segment.getTriggerType() && segment.getTriggerType() == TriggerConstants.TriggerTypeConstants.LOOP) {
            String cron = segment.getCronExpression();
            if (StringUtils.isNotBlank(cron)) {
                segmentVO.setCycleHour(CronDateUtils.getHourByCron(cron));
                segmentVO.setCycleMinute(CronDateUtils.getMinByCron(cron));
                segmentVO.setCycleVal(CronDateUtils.getValByCron(cron));
            }
        }

        return segmentVO;
    }

    private void determinChannelInfo(SegmentVO segmentVO) throws Exception {
        AbstractPushData pushData = AbstractPushData.buildPushData(segmentVO.getMessage());
        if (null != pushData.getChannelType()) {
            segmentVO.setChannelType(pushData.getChannelType());
        } else {
            if (StringUtils.isNotBlank(pushData.getChannelCode())) {
                ChannelDefinitionPage page = new ChannelDefinitionPage();
                page.setCode(pushData.getChannelCode());
                ChannelDefinition channelDefinition = channelDefinitionService.queryBySingle(page);
                if (channelDefinition == null) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.SEGMENT_CHANNEL_NOT_EXIST);
                }
                segmentVO.setChannelType(channelDefinition.getChannelType());
                segmentVO.setChannelCode(channelDefinition.getCode());
            }
        }
    }

    private void determineCrowdInfo(Segment segment, Map<Integer, Crowd> crowdMap, SegmentVO segmentVO) throws Exception {
        if (segment.getCrowdId() != null && crowdMap.containsKey(segment.getCrowdId())) {
            segmentVO.setCrowdId(segment.getCrowdId());
            Crowd crowd = crowdMap.get(segment.getCrowdId());
            if (null != crowd.getParentId() && crowd.getParentId() != 0) {
                segmentVO.setSubCrowdId(crowd.getId());
                segmentVO.setSubCrowdName(crowd.getRefName());
                segmentVO.setTargetCount(getTargetCount(segmentVO.getChannelType(), crowd));
                segmentVO.setCrowdId(crowd.getParentId());

                Crowd parent;
                if (crowdMap.containsKey(crowd.getParentId())) {
                    parent = crowdMap.get(crowd.getParentId());
                } else {
                    parent = crowdService.selectByPrimaryKey(crowd.getParentId());
                }
                if (null != parent) {
                    segmentVO.setCrowdId(parent.getId());
                    segmentVO.setCrowdVersion(parent.getLastVersion());
                } else {
                    logger.error("子人群的父人群不存在.投放id={},子人群id={},父人群id={}", segment.getId(), crowd.getId(), crowd.getParentId());
                    throw new MktException("子人群的父人群不存在");
                }
            }

            CrowdTaskCalcObjectRecord record = crowdTaskCalcObjectRecordService.querylatestByCrowdId(segment.getCrowdId());
            if (null != record) {
                segmentVO.setCalcObjectStatus(record.getStatus());
            }
        }
    }

}
