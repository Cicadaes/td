package com.talkingdata.marketing.core.task;

import com.talkingdata.marketing.core.constant.AttachmentConstants;
import com.talkingdata.marketing.core.constant.AttachmentConstants.AttachmentOperationConstants;
import com.talkingdata.marketing.core.constant.ChannelConstants;
import com.talkingdata.marketing.core.constant.CommonConstants;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcStatus;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType;
import com.talkingdata.marketing.core.constant.DataDownloadConstants;
import com.talkingdata.marketing.core.constant.IdTypeConstants;
import com.talkingdata.marketing.core.constant.ParamConstants;
import com.talkingdata.marketing.core.constant.PushConstants;
import com.talkingdata.marketing.core.constant.SegmentConstant;
import com.talkingdata.marketing.core.constant.SegmentConstant.SegmentStatusConstant;
import com.talkingdata.marketing.core.constant.SegmentTaskCalcObjectRecordConstant;
import com.talkingdata.marketing.core.constant.TriggerConstants;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.entity.campaign.CampaignLaunchUnit;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.DataDownload;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.campaign.SegmentTaskCalcObjectRecord;
import com.talkingdata.marketing.core.entity.dto.SegmentDto;
import com.talkingdata.marketing.core.entity.thirdmodel.channel.ReachSegment;
import com.talkingdata.marketing.core.entity.thirdmodel.push.PushBindModel;
import com.talkingdata.marketing.core.entity.thirdmodel.thirdpush.PushResult;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdInfoResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.MetaAttribute;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.MetaAttributeJson;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.MetaAttributeParam;
import com.talkingdata.marketing.core.enums.PushMetric;
import com.talkingdata.marketing.core.middleware.ConfigApi;
import com.talkingdata.marketing.core.middleware.CrowdApi;
import com.talkingdata.marketing.core.middleware.HDFS;
import com.talkingdata.marketing.core.middleware.PushMessageApi;
import com.talkingdata.marketing.core.middleware.ThirdPushApi;
import com.talkingdata.marketing.core.page.campaign.AttachmentPage;
import com.talkingdata.marketing.core.page.campaign.DataDownloadPage;
import com.talkingdata.marketing.core.page.dto.CrowdMsgDto;
import com.talkingdata.marketing.core.service.campaign.AttachmentService;
import com.talkingdata.marketing.core.service.campaign.CampaignLaunchUnitService;
import com.talkingdata.marketing.core.service.campaign.CampaignService;
import com.talkingdata.marketing.core.service.campaign.CrowdService;
import com.talkingdata.marketing.core.service.campaign.DataDownloadService;
import com.talkingdata.marketing.core.service.campaign.SegmentService;
import com.talkingdata.marketing.core.service.campaign.SegmentTaskCalcObjectRecordService;
import com.talkingdata.marketing.core.util.CrowdCsvUtil;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.core.util.FileUtil;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.util.SpringContextUtil;
import com.talkingdata.marketing.core.vo.push.AbstractPushData;
import com.talkingdata.marketing.core.vo.push.AppPushData;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.fs.Path;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.StatefulJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * The type Segment push send task.
 *
 * @author armeng
 */
public class SegmentPushSendTask implements Job, StatefulJob {
    private static final int[] STATUS =
        {SegmentStatusConstant.SEGMENT_STATUS_WAITING, SegmentStatusConstant.SEGMENT_STATUS_LOOP, SegmentStatusConstant.SEGMENT_STATUS_PROGRESS};
    private static Logger logger = LoggerFactory.getLogger(SegmentPushSendTask.class);
    private SegmentService segmentService;
    private CrowdService crowdService;
    private DataDownloadService dataDownloadService;
    private AttachmentService attachmentService;
    private CampaignLaunchUnitService campaignLaunchUnitService;
    private CrowdApi crowdApi;
    private ConfigApi configApi;
    private ThirdPushApi thirdPushApi;
    private SegmentTaskCalcObjectRecordService segmentTaskCalcObjectRecordService;
    private PushMessageApi pushMessageApi;
    private String segmentLocalPath = null;
    private String segmentRemotePath = null;
    private CampaignService campaignService;

    /**
     * Parse to dv type string.
     *
     * @param channelType the channel definition
     * @return the string
     */
    public static String parseToDvType(Integer channelType) {
        if (ChannelConstants.PUSH == channelType) {
            return IdTypeConstants.TDID;
        } else if (ChannelConstants.SMS == channelType) {
            return IdTypeConstants.MOBILEID;
        } else if (ChannelConstants.EDM == channelType) {
            return IdTypeConstants.EMAIL_ID;
        }
        return IdTypeConstants.TDID;
    }

    @Override public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        initDependence();

        try {
            cronBusiness();
        } catch (Exception e) {
            logger.error("投放推送定时任务失败,消息推送定时任务执行失败.", e);
        }
    }

    /**
     * Cron business.
     *
     * @throws Exception the exception
     */
    void cronBusiness() throws Exception {
        logger.info("===============投放推送定时任务开始,thread info: id is {}, thread name is {}", Thread.currentThread().getId(), Thread.currentThread().getName());
        if (initFIlePath()) {
            return;
        }
        List<SegmentTaskCalcObjectRecord> segmentTaskCalcObjectRecordList = loadTaskRecord();
        logger.info("===============投放推送定时任务.需要执行的投放个数: {},segmentIds: {}",segmentTaskCalcObjectRecordList.size(),segmentTaskCalcObjectRecordList.stream().map(o -> o.getSegmentId()).collect(Collectors.toSet()));

        for (SegmentTaskCalcObjectRecord calcRecord : segmentTaskCalcObjectRecordList) {
            SegmentDto segment = segmentService.getDao().queryBySegmentId(calcRecord.getSegmentId());
            logger.info("===============投放推送定时任务.开始投放.calcRecord={},\r\nsegmentDto={}",JsonUtil.toJson(calcRecord),JsonUtil.toJson(segment));
            if(null == segment){
                logger.info("===============投放推送定时任务.Segment未找到,跳过该record.calcRecord={}",JsonUtil.toJson(calcRecord));
                continue;
            }
            Boolean dealResult = null;
            try {
                AbstractPushData pushData = JsonUtil.toObject(segment.getMessage(), AbstractPushData.class);
                Integer channelType = pushData.getChannelType();
                if (checkSegment(segment, calcRecord, channelType)) {
                    continue;
                }

                Crowd crowd = crowdService.selectByPrimaryKey(segment.getCrowdId());
                if (crowd == null) {
                    logger.error("===============投放推送定时任务.定时投放任务失败,消息推送,人群找不到.crowdId={}", segment.getCrowdId());
                    continue;
                }
                if (ChannelConstants.PUSH == channelType && crowd.getCrowdType().equals(CrowdType.CROWD_TYPE_ACCURATE_FILE)) {
                    logger.info("===============投放推送定时任务.投放是精准人群的PUSH类型,开始精准推送.segment.id={}", segment.getId());
                    pushAccurate(crowd, channelType, segment, calcRecord);
                    continue;
                }

                DownloadResult result = launchCrowdDownload(segment, channelType, crowd);
                logger.info("===============投放推送定时任务.人群下载结果为：{}，投放名称：{}，投放id：{}", result.status, segment.getName(), segment.getId());
                switch (result.status) {
                case WAITING:
                    segment.setStatus(SegmentStatusConstant.SEGMENT_STATUS_PROGRESS);
                    calcRecord.setStatus(SegmentTaskCalcObjectRecordConstant.Status.PROGRESS);
                    break;
                case FAIL:
                    calcRecord.setErrorInfo(result.errInfo);
                    calcRecord.setRetry(calcRecord.getRetry() == null ? 1 : calcRecord.getRetry() + 1);
                    dealResult = false;
                    break;
                case FINISH:
                    if (ChannelConstants.SMS == channelType || ChannelConstants.EDM == channelType) {
                        // 将hdfs file path存放到segment message中
                        segmentSetFilePath(segment, result.fullPath);
                        ReachSegment reachSegment = buildReachSegment(channelType, segment, result.fullPath);

                        sendMessage(segment, reachSegment);

                        logger.info("===============投放推送定时任务.第三方推送成功，投放id :{}, 投放名称 :{}", segment.getId(), segment.getName());
                        calcRecord.setAttr1(reachSegment.getId());
                        calcRecord.setLastStatTime(new Date());
                        calcRecord.setErrorInfo(null);
                        dealResult = true;
                    } else {  //推送push消息
                        List<String> idList = crowdApi.downloadByCalcId(result.taskId);
                        logger.info("===============投放推送定时任务.download id list:" + idList);
                        if (idList != null) {
                            String idText = StringUtils.join(idList.toArray(), ",");
                            int accurate = PushConstants.GatewayAccurateConstant.GATEWAY_ACCURATE_INPUT;
                            sendPushMessage(crowd, channelType, calcRecord, accurate, idText, segment);
                            continue;
                        }
                    }
                    break;
                default:
                    logger.info("===============投放推送定时任务.异常情况.");
                }

                updateRecordStatus(dealResult,segment,calcRecord);
            } catch (Exception e) {
                dealResult = false;
                calcRecord.setErrorInfo(e.getMessage());
                calcRecord.setRetry(calcRecord.getRetry() == null ? 1 : calcRecord.getRetry() + 1);
                logger.error("===============投放推送定时任务.定时投放任务异常,推送失败，投放id {}，错误信息:\n{}", segment.getId(), e);
                updateRecordStatus(dealResult,segment,calcRecord);
                continue;
            }
        }
        logger.info("===============投放推送定时任务完成===============线程信息：thread id is {}，thread name is {}", Thread.currentThread().getId(), Thread.currentThread().getName());
    }

    private boolean initFIlePath() {
        segmentLocalPath = configApi.getParam(ParamConstants.MARKETING_ATTACHMENT_PATH, ParamConstants.SYSTEM_CODE);
        if (segmentLocalPath == null) {
            logger.error("===============投放推送定时任务.定时投放任务失败,请在config检查" + ParamConstants.MARKETING_ATTACHMENT_PATH);
            return true;
        }
        return false;
    }

    private boolean checkSegment(SegmentDto segment, SegmentTaskCalcObjectRecord segmentCalcRecord, Integer channelType) throws Exception {
        Date currentTime = new Date();
        if (segmentCalcRecord == null) {
            logger.error("===============投放推送定时任务.定时投放任务失败,calc record不存在,segment id: {}", segment.getId());
            return true;
        }
        if (channelType == null) {
            logger.error("===============投放推送定时任务.定时投放任务失败,投放渠道类型为空, segment id:{}", segment.getId());
            return true;
        }
        if (segment.getStartTime() == null) {
            logger.info("===============投放推送定时任务.bug:投放所属活动开始时间不存在, segment id:{}", segment.getId());
            return true;
        }
        if (segment.getEndTime() == null) {
            logger.info("===============投放推送定时任务.bug:投放所属活动结束时间不存在, segment id:{}", segment.getId());
            return true;
        }
        boolean campaignStartFlag = segment.getStartTime().after(currentTime);
        if (campaignStartFlag) {
            logger.info("===============投放推送定时任务.投放所属活动未开始, segment id:{}", segment.getId());
            return true;
        }
        boolean campaignFinishFlag = segment.getEndTime().before(currentTime);
        if (campaignFinishFlag) {
            logger.info("===============投放推送定时任务.活动已经结束，修改投放的状态为已结束，活动结束时间：{}，投放id：{}，投放名称：{}", segment.getEndTime(), segment.getId(), segment.getName());
            segmentCalcRecord.setErrorInfo("活动已经结束，不能进行发送。");
            updateRecordStatus(false,segment,segmentCalcRecord);
            return true;
        }

        if (segment.getTriggerType() == null) {
            logger.error("===============投放推送定时任务.定时投放任务失败,投放触发类型为空,segment id:{}", segment.getId());
            return true;
        }

/*        if (segment.getStatus().equals(SegmentStatusConstant.SEGMENT_STATUS_LOOP)) {
            //如果正在循环推送，之后不需要发起请求
            logger.info("如果正在循环推送，之后不需要发起请求");
            return true;
        }*/

        if (isType(segment, TriggerConstants.TriggerTypeConstants.APPOINTEDTIME)) {
            //定时推送，如果未到发送时间则返回
            if (segment.getAppointedTime() == null) {
                logger.info("===============投放推送定时任务.投放发送时间为空，投放id为:{}", segment.getId());
                return true;
            }
            boolean reachTimeToSend = currentTime.after(segment.getAppointedTime());
            if (!reachTimeToSend) {
                logger.info("===============投放推送定时任务.投放发送时间未到，投放id为:{}，定时推送时间为:{}", segment.getId(), segment.getAppointedTime());
                return true;
            }
        }

        return false;
    }

    /**
     * 更新该投放人群最后更新时间
     *
     * @param segment
     * @throws Exception
     */
    private void updateCrowdUpdateTime(Segment segment) throws Exception {
        Crowd crowd = crowdService.selectByPrimaryKey(segment.getCrowdId());
        if (null == crowd) {
            logger.error("===============投放推送定时任务.定时投放任务失败,同步人群更新时间失败, 未查到投放对应人群 crowd id:{}, segment id:{}, segment name:{}", segment.getCrowdId(), segment.getId(),
                segment.getName());
            return;
        }
        CrowdInfoResp crowdInfoResp = crowdApi.getCrowdInfo(crowd.getRefId());
        if (null == crowdInfoResp || null == crowdInfoResp.getUpdateDataTime()) {
            logger.error("===============投放推送定时任务.定时投放任务失败,同步人群更新时间失败, 用户管家未查到人群信息或人群更新时间为空 crowd id:{}, crowd name:{}, crowd refId:{}", crowd.getRefName(), crowd.getId(),
                crowd.getRefId());
            return;
        }
        crowd.setUpdateTime(new Date(crowdInfoResp.getUpdateDataTime()));
        crowdService.updateByPrimaryKeySelective(crowd);

        logger.info("===============投放推送定时任务.同步人群更新时间成功, crowd id:{}, crowd name:{}, 更新时间为 crowd updateTime:{}", crowd.getRefName(), crowd.getId(), crowd.getUpdateTime());

    }

    /**
     * Launch crowd download download result.
     *
     * @param segment           the segment
     * @param channelType the channelType
     * @param crowd             the crowd
     * @return the download result
     * @throws Exception the exception
     */
    public DownloadResult launchCrowdDownload(Segment segment, Integer channelType, Crowd crowd) throws Exception {
        DataDownload dataDownload = findByRefIdAndDvType(crowd, channelType);
        if (dataDownload != null) {
            if (dataDownload.getStatus() == DataDownloadConstants.DataDownloadStatusConstants.DATA_DOWNLOAD_FINISH) {
                HttpGet httpget = new HttpGet(crowdApi.getCrowdDownloadUrl(dataDownload.getTaskId()));
                try(
                    CloseableHttpClient httpclient = HttpClientBuilder.create().build();
                    ZipInputStream zipInputStream = new ZipInputStream(httpclient.execute(httpget).getEntity().getContent())
                ) {
                    //文件资源损坏或被删除，需要发起重新发起下载请求
                    if (zipInputStream == null) {
                        return addDataDownload(segment, crowd, channelType);
                    }

                    ZipEntry entry = zipInputStream.getNextEntry();
                    if (entry == null) {
                        return buildErrorResult(String.format("获取压缩文件入口失败，投放id：%d", segment.getId()));
                    }
                    logger.info("===============投放推送定时任务.下载文件名称：{}，任务Id：{}", entry.getName(), dataDownload.getTaskId());
                    String fileName = String.format("%s_%s", UUID.randomUUID().toString(), entry.getName());

                    InputStream inputStream = null;
                    //合并自定义参数
                    if (CrowdType.CROWD_TYPE_ACCURATE_FILE == crowd.getCrowdType()) {
                        List<String> jsonQuotes = crowdService.getJsonQuote(crowd.getId());
                        if (CollectionUtils.isNotEmpty(jsonQuotes) && StringUtils.isNotEmpty(segment.getMessageParam())) {
                            String dvType = parseToDvType(channelType);
                            logger.info(String.format("===============投放推送定时任务.投放的一方上传与用户管家人群的自定义参数合并开始，投放名称：%s，投放类型：%s，人群id：%d，人群refId：%d", segment.getName(), dvType, crowd.getId(),
                                    crowd.getRefId()));
                            Attachment attachment = attachmentService.getByCrowdId(crowd.getId());
                            if (attachment == null) {
                                return buildErrorResult(String.format("存储文件没有找到，segment id:%d", segment.getId()));
                            }
                            try (InputStream in = new FileInputStream(attachment.getPath())) {
                                String astr = new String(FileUtil.removeUTF8BOM(IOUtils.toByteArray(zipInputStream)), StandardCharsets.UTF_8);
                                String bstr = new String(FileUtil.removeUTF8BOM(IOUtils.toByteArray(in)), StandardCharsets.UTF_8);
                                String errInfo = mergeData(dvType, astr, bstr, inputStream);
                                logger.info(String.format("===============投放推送定时任务.投放的一方上传与用户管家人群的自定义参数合并完成，" + "投放名称：%s，投放类型：%s，人群id：%d，人群refId：%d，错误信息：%s",
                                        segment.getName(), dvType, crowd.getId(), crowd.getRefId(), errInfo));
                                if (StringUtils.isNotEmpty(errInfo)) {
                                    return buildErrorResult(errInfo);
                                }
                            } catch (Exception e) {
                                String errInfo = "解析文件错误，投放id:" + segment.getId() + AttachmentOperationConstants.CSV_LINE + e.getMessage();
                                logger.error(errInfo);
                                return buildErrorResult(errInfo);
                            }
                        }
                    } else {
                        inputStream = zipInputStream;
                    }

                    //存储到本地和hdfs
                    storeFile(segment, inputStream, segmentLocalPath, segmentRemotePath, fileName);
                    return buildSuccessResult(dataDownload.getTaskId(), String.format("hdfs://%s/%s", segmentRemotePath, fileName));
                }
            } else if (dataDownload.getStatus() == DataDownloadConstants.DataDownloadStatusConstants.DATA_DOWNLOAD_FAIL) {
                if (crowd.getId().equals(dataDownload.getCrowdId())) {
                    //当前segment发起的下载请求，则置为fail
                    String errInfo = String.format("下载文件请求失败，投放id：%d", segment.getId());
                    return buildErrorResult(errInfo);
                }
                //发起人群计算请求
                return addDataDownload(segment, crowd, channelType);
            }
        } else {
            //未发起过下载请求
            return addDataDownload(segment, crowd, channelType);
        }

        //还在下载中，还需要等待
        return buildWaitingResult();
    }

    /**
     * Build reach segment reach segment.
     *
     * @param channelType the channelType
     * @param segment           the segment
     * @param hdfsPath          the hdfs path
     * @return the reach segment
     * @throws Exception the exception
     */
    public ReachSegment buildReachSegment(Integer channelType, Segment segment, String hdfsPath) throws Exception {
        ReachSegment reachSegment = new ReachSegment();
        reachSegment.setChannelType(channelType);
        reachSegment.setTriggerType(segment.getTriggerType());
        reachSegment.setSubTriggerType(segment.getSubTriggerType());
        reachSegment.setCronExpression(segment.getCronExpression());
        reachSegment.setReachSegmentFilePath(hdfsPath);
        if (TriggerConstants.TriggerTypeConstants.APPOINTEDTIME == reachSegment.getTriggerType()) {
            reachSegment.setAppointedTime(DateUtil.date2String("yyyy-MM-dd HH:mm:ss", segment.getAppointedTime()));
        }
        logger.info("===============投放推送定时任务.SmsPushData={},channelType={}", segment.getMessage(), channelType);
        Map msgJson = JsonUtil.toObject(segment.getMessage(), HashMap.class);
        if (ChannelConstants.EDM == channelType) {
            Attachment reachAttachment = getReachAttachmentBySegment(segment.getId());
            if (null != reachAttachment && StringUtils.isNotBlank(reachAttachment.getPath())) {
                try (InputStream in = new FileInputStream(reachAttachment.getPath())) {
                    msgJson.put("content", IOUtils.toString(in));
                }
            } else {
                logger.info("===============投放推送定时任务.EdmPushData.Attachment为空.segmentId={}", segment.getId());
            }
        }

        reachSegment.setData(msgJson);
        return reachSegment;
    }

    private void sendMessage(Segment segment, ReachSegment reachSegment) throws Exception {
        String message = JsonUtil.toJson(reachSegment);
        logger.info("===============投放推送定时任务.投放调用推送通道，投放id：{}，发送信息Json：\n{}", segment.getId(), message);
        PushResult pushResult = thirdPushApi.pushMessage(message);
        if (pushResult == null || pushResult.getStatus() == null || pushResult.getStatus() == false) {
            throw new Exception(String.format("推送失败, 投放id %d, 错误信息：%s", segment.getId(), JsonUtil.toJson(pushResult)));
        }
    }

    private Attachment getReachAttachmentBySegment(Integer segmentId) throws Exception {
        AttachmentPage page = new AttachmentPage();
        page.setRefId(String.valueOf(segmentId));
        page.setType(AttachmentConstants.AttachmentTypeConstants.ATTACHMENT_TYPE_SEGMENT+"");
        return attachmentService.queryBySingle(page);

    }

    private void segmentSetFilePath(Segment segment, String filePath) throws Exception {
        AbstractPushData pushData = AbstractPushData.buildPushData(segment.getMessage());
        pushData.setReachFilePath(filePath);
        String message = JsonUtil.toJson(pushData);
        segment.setMessage(message);
    }

    private void storeFile(Segment segment, InputStream fileResource, String localPath, String hdfsPath, String fileName) throws Exception {
        logger.info("===============投放推送定时任务.一方人群执行上传信息：segment id:{},local path:{},remote path:{}, file name:{}", segment.getId(), segmentLocalPath, segmentRemotePath,
            fileName);
        try (OutputStream localFileOutputStream = getLocalFileOutputStream(localPath, fileName);
            //OutputStream hdfsFileOutputStream = getRemoteFileOutputStream(hdfsPath, fileName);
            InputStream in = fileResource) {
            //默认每次复制4kb
            byte[] byteBuff = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(byteBuff)) != -1) {
                localFileOutputStream.write(byteBuff, 0, bytesRead);
                //hdfsFileOutputStream.write(byteBuff, 0, bytesRead);
            }
        } catch (Exception e) {
            logger.error("===============投放推送定时任务.定时投放任务失败,文件上传失败，投放id:" + segment.getId(), e);
            throw new Exception("文件上传失败，投放id:" + segment.getId() + ",错误信息:\n", e);
        }
    }

    private OutputStream getLocalFileOutputStream(String localPath, String fileName) throws Exception {
        File file = new File(localPath);
        if (!file.exists()) {
            file.mkdirs();
        }
        String fileFullPath = String.format("%s/%s", localPath, fileName);
        File outputFile = new File(fileFullPath);
        return new FileOutputStream(outputFile);
    }

    private OutputStream getRemoteFileOutputStream(String hdfsPath, String fileName) throws Exception {
        Path path = new Path(hdfsPath);
        if (!HDFS.exists(path)) {
            HDFS.mkdirs(path);
        }
        String fileFullPath = String.format("%s/%s", hdfsPath, fileName);
        return HDFS.create(new Path(fileFullPath), true);
    }

    private DownloadResult addDataDownload(Segment segment, Crowd crowd, Integer channelType) throws Exception {
        String dvType = parseToDvType(channelType);
        Integer taskId;
        int downloadType = DataDownloadConstants.DataDownloadTypeConstants.DATA_DOWNLOAD_TYPE_ALL;
        if (ChannelConstants.SMS == channelType || ChannelConstants.EDM == channelType) {
            if (StringUtils.isEmpty(segment.getMessageParam())) {
                taskId = crowdApi.noticeCrowdDownloadWithVersion(crowd.getRefId(), crowd.getLastVersion(), dvType);
            } else {
                String attributesStr = configApi.getParam(ParamConstants.MARKETING_DMP_CROWD_ATTRIBUTES, ParamConstants.SYSTEM_CODE);
                List<Map> metaAttributeJsons = JsonUtil.toObject(attributesStr, ArrayList.class);
                List<MetaAttributeParam> metaAttributeParams =
                    transformMetaAttributeParam(segment.getMessageParam(), metaAttributeJsons, channelType);
                //自定义参数人群下载请求
                taskId = crowdApi.getCrowdDownloadNoticeWithParameter(crowd.getRefId(), dvType, JsonUtil.toJson(metaAttributeParams));
            }
            if (taskId == null) {
                String errInfo = String.format("从用户管家发起下载任务失败，人群id:%d，投放id:%d", crowd.getId(), segment.getId());
                return buildErrorResult(errInfo);
            }
        } else {//Push
            if (null != segment.getCrowdUpdateType() && segment.getCrowdUpdateType() == SegmentConstant.SegmentCrowdUpdateTypeConstants.SEGMENT_CROWD_NOT_UPDATED) {
                taskId = crowdApi.noticeCrowdDownloadWithVersion(crowd.getRefId(), segment.getCrowdVersion(), IdTypeConstants.TDID);
            } else {
                if (crowd.getCalcStatus().equals(CrowdCalcStatus.STATUS_FINISH)) {

                    if (isIncrementSegment(segment)) {
                        //如果是增量推送
                        downloadType = DataDownloadConstants.DataDownloadTypeConstants.DATA_DOWNLOAD_TYPE_INC;
                        taskId = crowdApi.noticeCrowdDownloadWithIncrement(crowd.getRefId(), IdTypeConstants.TDID);
                    } else {
                        //如果是全量推送
                        taskId = crowdApi.noticeCrowdDownloadWithVersion(crowd.getRefId(), crowd.getLastVersion(), IdTypeConstants.TDID);
                    }
                } else {
                    //return;
                    return buildWaitingResult();
                }
            }
        }

        DataDownload dataDownload = dataDownloadService.buildDataDownload(taskId, crowd);
        dataDownload.setType(downloadType);
        dataDownload.setCrowdId(crowd.getId());
        dataDownload.setCreator(CommonConstants.SYSTEM_USER);
        dataDownload.setDvType(dvType);
        dataDownload.setStatus(DataDownloadConstants.DataDownloadStatusConstants.DATA_DOWNLOAD_WAITING);
        dataDownloadService.insert(dataDownload);

        return buildWaitingResult();
    }

    private List<MetaAttributeParam> transformMetaAttributeParam(String messageParamStr, List<Map> metaAttributeJsons,
        Integer channelType) throws Exception {
        String[] messageParams = messageParamStr.split(",");
        List<MetaAttribute> attributesList = new ArrayList<>();
        for (Map metaAttributeJson : metaAttributeJsons) {
            String metaAttributeStr = JsonUtil.toJson(metaAttributeJson);
            MetaAttributeJson metaAttribute = JsonUtil.toObject(metaAttributeStr, MetaAttributeJson.class);
            String type = metaAttribute.getType();
            Integer metaAttrType = Integer.parseInt(type);
            if (channelType.equals(metaAttrType)) {
                List<MetaAttribute> data = metaAttribute.getData();
                for (String messageParam : messageParams) {
                    for (MetaAttribute datum : data) {
                        if (messageParam.equalsIgnoreCase(datum.getAttributeCode())) {
                            attributesList.add(datum);
                            break;
                        }
                    }
                }
            }
        }
        List<MetaAttributeParam> metaAttributeParams = new ArrayList<>();
        for (MetaAttribute metaAttribute : attributesList) {
            boolean flag = false;
            for (MetaAttributeParam metaAttributeParamObject : metaAttributeParams) {
                String objectCode = metaAttributeParamObject.getObjectCode();
                String objectIdType = metaAttributeParamObject.getObjectIdType();
                String objectType = metaAttributeParamObject.getObjectType();
                if (metaAttribute.getObjectCode().equals(objectCode) && metaAttribute.getObjectIdType().equals(objectIdType) && metaAttribute
                    .getObjectType().equals(objectType)) {
                    metaAttributeParamObject.setAttributes(metaAttributeParamObject.getAttributes() + "," + metaAttribute.getAttributeCode());
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                MetaAttributeParam metaAttributeParam = new MetaAttributeParam();
                metaAttributeParam.setAttributes(metaAttribute.getAttributeCode());
                metaAttributeParam.setObjectCode(metaAttribute.getObjectCode());
                metaAttributeParam.setObjectIdType(metaAttribute.getObjectIdType());
                metaAttributeParam.setObjectType(metaAttribute.getObjectType());
                metaAttributeParams.add(metaAttributeParam);
            }
        }
        return metaAttributeParams;
    }

    private DataDownload findByRefIdAndDvType(Crowd crowd, Integer channelType) throws Exception {
        DataDownloadPage page = new DataDownloadPage();
        page.setDvType(parseToDvType(channelType));
        page.setRefId(String.valueOf(crowd.getRefId()));
        page.setOrderBy("create_time desc");
        return dataDownloadService.queryBySingle(page);
    }

    private void autoCreateClickCrowd(Segment segment) throws Exception {
        if (isType(segment, TriggerConstants.TriggerTypeConstants.APPOINTEDTIME) || isType(segment, TriggerConstants.TriggerTypeConstants.NOW)) {
            crowdService.batchCreateChild(segment, PushMetric.PUSH_CLICK_NUMBER);
        }
    }

    /**
     * Merge data string.
     *
     * @param typeId      the type id
     * @param astr        the astr
     * @param bstr        the bstr
     * @param inputStream the input stream
     * @return the string
     * @throws Exception the exception
     */
    public String mergeData(String typeId, String astr, String bstr, InputStream inputStream) throws Exception {
        String errorInfo = null;
        //用户管家
        CSVParser parsera = CSVParser.parse(astr, CSVFormat.EXCEL.withHeader());
        //一方上传
        CSVParser parserb = CSVParser.parse(bstr, CSVFormat.EXCEL.withHeader());

        //用户管家数据转成map
        List<CSVRecord> recordsa = parsera.getRecords();
        Map<String, String> mapa = new HashMap<>(16);
        //取表头(为保证顺序，不用getHeaderMap)
        String typeIdTmp = typeId;
        getHeader(mapa, recordsa, typeIdTmp);
        //一方上传有typeId对应字段
        if (mapa.get(typeId) != null) {
            //取内容
            getContent(mapa, recordsa, typeId);
            logger.info("===============投放推送定时任务.用户管家人群自定义参数内容获取成功");
        } else {
            logger.error("===============投放推送定时任务.定时投放任务失败,用户管家人群没有typeId为：{}的字段", typeId);
            errorInfo += String.format("用户管家人群没有typeId为：%s的字段\n", typeId);
        }

        //一方上传数据转成map
        List<CSVRecord> recordsb = parserb.getRecords();
        Map<String, String> mapb = new HashMap<>(16);
        //取表头
        getHeader(mapb, recordsb, typeId);
        //取内容 dmp没有对应字段
        if (mapb.get(typeId) == null) {
            logger.error("===============投放推送定时任务.定时投放任务失败,一方上传人群没有typeId为：{}的字段", typeId);
            errorInfo += String.format("一方上传人群没有typeId为：%s的字段\n", typeId);
            mapb = mapa;
        } else {
            if (mapa.get(typeId) == null) {
                getContent(mapb, recordsb, typeId);
                logger.info("===============投放推送定时任务.一方上传人群自定义参数内容获取成功");
            } else {
                //以一方上传人群left join用户管家人群
                getAppend(mapa, mapb, recordsb, typeId);
                logger.info("===============投放推送定时任务.一方上传人群与用户管家人群自定义参数合并成功");
            }
        }

        //组合成结果
        StringBuffer result = new StringBuffer();
        result.append(typeId);
        if (null != mapa.get(typeId)) {
            result.append(mapa.get(typeId));
        }
        if (null != mapb.get(typeId)) {
            result.append(mapb.get(typeId));
            mapb.remove(typeId);
        }
        result.append(AttachmentOperationConstants.CSV_LINE);
        for (Map.Entry<String, String> b : mapb.entrySet()) {
            result.append(b.getKey()).append(b.getValue()).append(AttachmentOperationConstants.CSV_LINE);
        }

        //更新inputStream流
        if (inputStream == null) {
            inputStream = new ByteArrayInputStream(result.toString().getBytes("UTF-8"));
            logger.info("===============投放推送定时任务.更新人群数据成功，更新后文件流大小为：{}", inputStream.available());
        }
        return errorInfo;
    }

    private void getHeader(Map map, List<CSVRecord> records, String typeId) throws Exception {
        for (CSVRecord record : records) {
            Map<String, String> stringStringMap = record.toMap();
            if (stringStringMap.containsKey(typeId)) {
                stringStringMap.remove(typeId);
                String key = "";
                for (Map.Entry<String, String> stringStringEntry : stringStringMap.entrySet()) {
                    key += AttachmentOperationConstants.CSV_SEPARATOR + stringStringEntry.getKey();
                    map.put(typeId, key);
                }
                logger.info("===============投放推送定时任务.获取type为{}的表头为：{}", typeId, key);
            }
            break;
        }
    }

    private void getContent(Map map, List<CSVRecord> records, String typeId) throws Exception {
        logger.info("===============投放推送定时任务.获取type为{}的内容行数为：{}", typeId, records.size());
        for (CSVRecord record : records) {
            String s = record.get(typeId);
            Map<String, String> stringStringMap = record.toMap();
            stringStringMap.remove(typeId);
            String avalue = "";
            for (Map.Entry<String, String> stringStringEntry : stringStringMap.entrySet()) {
                avalue += AttachmentOperationConstants.CSV_SEPARATOR;
                if (null != stringStringEntry.getValue()) {
                    avalue += stringStringEntry.getValue();
                }
            }
            map.put(s, avalue);
        }
    }

    private void getAppend(Map<String, String> mapa, Map<String, String> mapb, List<CSVRecord> recordsb, String typeId) throws Exception {
        logger.info("===============投放推送定时任务.获取type为{}的内容行数为：{}", typeId, recordsb.size());

        for (CSVRecord recordb : recordsb) {
            String keyb = recordb.get(typeId);
            Map<String, String> stringStringMapb = recordb.toMap();
            stringStringMapb.remove(typeId);
            String valueb = "";
            for (Map.Entry<String, String> stringStringEntry : stringStringMapb.entrySet()) {
                valueb += AttachmentOperationConstants.CSV_SEPARATOR + stringStringEntry.getValue();
            }

            String value = "";
            if (null != mapa.get(keyb)) {
                value = mapa.get(keyb);
            } else {
                String mapaKeys = mapa.get(typeId);
                //补分割号
                if (null != mapaKeys) {
                    String[] keys = mapaKeys.split(AttachmentOperationConstants.CSV_SEPARATOR);
                    for (int i = 1; i < keys.length; i++) {
                        value += AttachmentOperationConstants.CSV_SEPARATOR;
                    }
                }
            }
            mapb.put(keyb, value + valueb);
        }
    }

    /**
     * 一方人群推送.
     *
     * @param crowd
     * @param channelType
     * @param segment
     * @param segmentTaskCalcObjectRecord
     * @throws Exception
     */
    private void pushAccurate(Crowd crowd, Integer channelType, Segment segment,
        SegmentTaskCalcObjectRecord segmentTaskCalcObjectRecord) throws Exception {
        String txt = attachmentService.getContentByRefId(crowd.getId());
        if (StringUtils.isNotBlank(txt)) {
            CrowdMsgDto msg = CrowdCsvUtil.parseText(txt);
            Integer accurate = PushConstants.GatewayAccurateConstant.GATEWAY_ACCURATE_INPUT;
            if (msg.getJson()) {
                accurate = PushConstants.GatewayAccurateConstant.GATEWAY_ACCURATE_JSON;
            }
            sendPushMessage(crowd, channelType, segmentTaskCalcObjectRecord, accurate, msg.getContent(), segment);
        } else {
            logger.error("===============投放推送定时任务.定时投放任务失败,人群文件没有找到,人群id={}", crowd.getId());
            updateRecordStatus(false, segment, segmentTaskCalcObjectRecord);
        }
    }

    private void sendPushMessage(Crowd crowd, Integer channelType, SegmentTaskCalcObjectRecord calcRecord, Integer accurate,
        String idText, Segment segment) throws Exception {
        try {
            // 发送前更新计算对象状态为已下载
            calcRecord.setStatus(SegmentTaskCalcObjectRecordConstant.Status.SEGMENT_CALC_DOWNLOAD);
            segmentTaskCalcObjectRecordService.updateByPrimaryKeySelective(calcRecord);
            if (channelType == ChannelConstants.PUSH) {
                sendPush(accurate, idText, segment);
                autoCreateClickCrowd(segment);
            }
            updateRecordStatus(true, segment, calcRecord);
        } catch (Exception e) {
            logger.error("===============投放推送定时任务.定时投放任务失败,sendMessage err:", e);
            updateRecordStatus(false, segment, calcRecord);
        }

    }

    private void sendPush(Integer accurate, String idText, Segment segment) throws Exception {
        AppPushData pushContent = JsonUtil.toObject(segment.getMessage(), AppPushData.class);
        String message = JsonUtil.toJson(CollectionUtils.isNotEmpty(pushContent.getIosData()) ? pushContent.getIosData() : pushContent.getAndroidData());
        String source = PushConstants.GatewaySourceConstant.MARKETING_PUSH_SOURCE;
        logger.info("===============投放推送定时任务.push message,segment id:" + segment.getId());
        String resp = pushMessageApi.push(pushContent.getAppid(), pushContent.getPlatform(), accurate, idText, source, message);
        bindPush(segment, resp);
    }

    private void bindPush(Segment segment, String resp) throws Exception {
        PushBindModel[] models = JsonUtil.toObject(resp, PushBindModel[].class);
        Date createTime = new Date();
        if (models != null && models.length > 0) {
            for (PushBindModel model : models) {
                SegmentTaskCalcObjectRecord segmentTaskCalcObjectRecord = segmentTaskCalcObjectRecordService.buildWithSegment(segment);
                segmentTaskCalcObjectRecord.setCreateTime(createTime);
                segmentTaskCalcObjectRecord.setStartTime(createTime);
                segmentTaskCalcObjectRecord.setStatus(SegmentTaskCalcObjectRecordConstant.Status.FINISH);
                segmentTaskCalcObjectRecord.setType(SegmentTaskCalcObjectRecordConstant.Type.SEGMENT_CALC_TYPE_STAT);
                //set resp from push,include: pushId, ratio, group
                Map<String, Object> attrMapping = new HashMap(16);
                attrMapping.put("push", model.getPush());
                attrMapping.put("group", model.getGroupName());
                attrMapping.put("ratio", model.getRatio());
                String attr = JsonUtil.toJson(attrMapping);
                segmentTaskCalcObjectRecord.setAttr1(attr);
                segmentTaskCalcObjectRecordService.insert(segmentTaskCalcObjectRecord);
            }
        }
    }

    private void updateRecordStatus(Boolean success, Segment segment, SegmentTaskCalcObjectRecord segmentTaskCalcObjectRecord) throws Exception {
        if(null != success) {
            if(success){
                segment.setStatus(SegmentStatusConstant.SEGMENT_STATUS_FINISH);
                segmentTaskCalcObjectRecord.setStatus(SegmentTaskCalcObjectRecordConstant.Status.FINISH);
            }else{
                segment.setStatus(SegmentStatusConstant.SEGMENT_STATUS_FAIL);
                segmentTaskCalcObjectRecord.setStatus(SegmentTaskCalcObjectRecordConstant.Status.FAIL);
            }

            if(segmentService.isType(segment,TriggerConstants.TriggerTypeConstants.LOOP)){
                SegmentDto segmentDto = (SegmentDto)segment;
                if (segmentDto.getEndTime().after(new Date())) {
                    segment.setStatus(SegmentStatusConstant.SEGMENT_STATUS_LOOP);
                }
            }

            updateCampaignUnitIfFirstSend(segment);
            updateCrowdUpdateTime(segment);
        }

        segmentTaskCalcObjectRecordService.updateByPrimaryKeySelective(segmentTaskCalcObjectRecord);
        segmentService.updateByPrimaryKeySelective(segment);
    }

    private void initDependence() {
        segmentService = SpringContextUtil.getBean(SegmentService.class);
        crowdService = SpringContextUtil.getBean(CrowdService.class);
        dataDownloadService = SpringContextUtil.getBean(DataDownloadService.class);
        attachmentService = SpringContextUtil.getBean(AttachmentService.class);
        campaignLaunchUnitService = SpringContextUtil.getBean(CampaignLaunchUnitService.class);
        crowdApi = SpringContextUtil.getBean(CrowdApi.class);
        configApi = SpringContextUtil.getBean(ConfigApi.class);
        thirdPushApi = SpringContextUtil.getBean(ThirdPushApi.class);
        segmentTaskCalcObjectRecordService = SpringContextUtil.getBean(SegmentTaskCalcObjectRecordService.class);
        pushMessageApi = SpringContextUtil.getBean(PushMessageApi.class);
        campaignService = SpringContextUtil.getBean(CampaignService.class);
    }

    private DownloadResult buildErrorResult(String errInfo) {
        DownloadResult result = new DownloadResult();
        result.status = CrowdDownloadEnum.FAIL;
        result.errInfo = errInfo;
        return result;
    }

    private DownloadResult buildSuccessResult(Integer taskId, String fullPath) {
        DownloadResult result = new DownloadResult();
        result.status = CrowdDownloadEnum.FINISH;
        result.fullPath = fullPath;
        result.taskId = taskId;
        return result;
    }

    private DownloadResult buildWaitingResult() {
        DownloadResult result = new DownloadResult();
        result.status = CrowdDownloadEnum.WAITING;
        return result;
    }

    private boolean isType(Segment segment, Integer tp) {
        return segment.getTriggerType().equals(tp);
    }

    /**
     * 更新投放单元第一次发送时间
     *
     * @param segment
     * @throws Exception
     */
    private void updateCampaignUnitIfFirstSend(Segment segment) throws Exception {
        if (isType(segment, TriggerConstants.TriggerTypeConstants.LOOP)) {
            return;
        }
        CampaignLaunchUnit campaignLaunchUnit = campaignLaunchUnitService.selectByPrimaryKey(segment.getCampaignLaunchUnitId());
        if (campaignLaunchUnit == null || campaignLaunchUnit.getFirstSendTime() != null) {
            return;
        }
        Date firstSendTime = segment.getCreateTime();
        if (isType(segment, TriggerConstants.TriggerTypeConstants.APPOINTEDTIME)) {
            firstSendTime = segment.getAppointedTime();
        }
        campaignLaunchUnit.setFirstSendTime(firstSendTime);
        campaignLaunchUnitService.updateByPrimaryKeySelective(campaignLaunchUnit);
    }

    /**
     * 增量投放
     *
     * @param segment
     * @return boolean
     */
    private boolean isIncrementSegment(Segment segment) {
        if (segment.getCrowdUpdateType() == null
            || segment.getCrowdUpdateType() == SegmentConstant.SegmentCrowdUpdateTypeConstants.SEGMENT_CROWD_NOT_UPDATED) {
            return false;
        }
        if (segment.getTriggerType() == TriggerConstants.TriggerTypeConstants.APPOINTEDTIME || segment.getTriggerType() == TriggerConstants.TriggerTypeConstants.NOW) {
            return false;
        }
        return true;
    }

    private enum CrowdDownloadEnum {
        /**
         * 等待
         */
        WAITING,
        /**
         * 完成
         */
        FINISH,
        /**
         * 失败
         */
        FAIL
    }

    private class DownloadResult {
        /**
         * The Status.
         */
        CrowdDownloadEnum status;
        /**
         * The Full path.
         */
        String fullPath;
        /**
         * The Err info.
         */
        String errInfo;
        /**
         * The Task id.
         */
        Integer taskId;
    }

    private List<SegmentTaskCalcObjectRecord> loadTaskRecord() {
        List<Integer> statusList = new ArrayList();
        statusList.add(SegmentTaskCalcObjectRecordConstant.Status.WAITING);
        statusList.add(SegmentTaskCalcObjectRecordConstant.Status.PROGRESS);
        statusList.add(SegmentTaskCalcObjectRecordConstant.Status.SEGMENT_CALC_ALREADY_LAUNCH_TASK);
        statusList.add(SegmentTaskCalcObjectRecordConstant.Status.SEGMENT_CALC_DOWNLOAD);
        return segmentTaskCalcObjectRecordService.queryByStatusAndType(statusList, SegmentTaskCalcObjectRecordConstant.Type.SEGMENT_CALC_TYPE_SEND);
    }
}
