package com.talkingdata.marketing.core.service.campaign;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.common.io.Files;
import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.AttachmentConstants;
import com.talkingdata.marketing.core.constant.CommonConstants;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcStatus;
import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdStatus;
import com.talkingdata.marketing.core.constant.IdTypeConstants;
import com.talkingdata.marketing.core.dao.campaign.AttachmentDao;
import com.talkingdata.marketing.core.dao.campaign.CampaignLaunchUnitDao;
import com.talkingdata.marketing.core.entity.admin.ChannelDefinition;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.entity.campaign.CampaignLaunchUnit;
import com.talkingdata.marketing.core.entity.campaign.Crowd;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdEstimateResp;
import com.talkingdata.marketing.core.entity.thirdmodel.usercloud.CrowdInfoResp;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.middleware.CrowdApi;
import com.talkingdata.marketing.core.page.campaign.CampaignLaunchUnitPage;
import com.talkingdata.marketing.core.page.campaign.CrowdPage;
import com.talkingdata.marketing.core.page.campaign.SegmentPage;
import com.talkingdata.marketing.core.page.campaign.extend.CrowdCreationPage;
import com.talkingdata.marketing.core.page.dto.CampaignLaunchUnitDto;
import com.talkingdata.marketing.core.service.admin.ChannelDefinitionService;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.core.util.FileUtil;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.util.ZipUtil;
import com.talkingdata.marketing.core.vo.campaign.SegmentVO;
import net.lingala.zip4j.exception.ZipException;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.nio.charset.Charset;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcStatus.STATUS_DELETE;
import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcStatus.STATUS_FINISH;
import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcStatus.STATUS_IN_PROGRESS;
import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcStatus.STATUS_NOT_START;
import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdCalcStatus.STATUS_UNUSUAL;
import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType.CROWD_TYPE_ACCURATE_FILE;
import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType.CROWD_TYPE_ACCURATE_HISTORY;
import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType.CROWD_TYPE_LOOKLIKE;
import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType.CROWD_TYPE_SCENE;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CAMPAIGN_LAUNCH_UNIT CampaignLaunchUnitService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("campaignLaunchUnitService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CampaignLaunchUnitService extends BaseService<CampaignLaunchUnit, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(CampaignLaunchUnitService.class);

    @Autowired
    private CampaignService campaignService;

    @Autowired
    private CampaignLaunchUnitDao dao;

    @Autowired
    private SegmentService segmentService;

    @Autowired
    private AttachmentDao attachmentDao;

    @Autowired
    private CrowdApi crowdApi;

    @Autowired
    private CrowdService crowdService;

    @Autowired
    private CrowdTaskCalcObjectRecordService crowdTaskCalcObjectRecordService;

    @Autowired
    private ChannelDefinitionService channelDefinitionService;

    @Autowired
    private ExceptionBuilder exceptionBuilder;

    @Override
    public CampaignLaunchUnitDao getDao() {
        return dao;
    }

    public CampaignLaunchUnit createRelatedCrowd(CrowdCreationPage page, HttpServletRequest request, Attachment attachment) throws Exception {
        Crowd crowd = buildAndCreateCrowd(page, request, attachment);

        CampaignLaunchUnit unit = saveCampaignLaunchUnit(page, crowd);
        return unit;
    }

    private CampaignLaunchUnit saveCampaignLaunchUnit(CrowdCreationPage page, Crowd crowd) {
        CampaignLaunchUnit unit = new CampaignLaunchUnit();
        unit.setCampaignId(Integer.parseInt(page.getCampaignId()));
        unit.setCrowdId(crowd.getId());
        unit.setCrowdName(crowd.getRefName());
        unit.setEstimatedSize(crowd.getEstimatedSize());
        unit.setPushEstimatedSize(crowd.getPushEstimatedSize());
        unit.setSmsEstimatedSize(crowd.getSmsEstimatedSize());
        unit.setEdmEstimatedSize(crowd.getEdmEstimatedSize());
        unit.setAdEstimatedSize(crowd.getAdEstimatedSize());
        unit.setCrowdUpdateTime(crowd.getLastUpdateTime());
        unit.setTenantId(crowd.getTenantId() + "");
        unit.setCreator(crowd.getCreator());
        unit.setCreateBy(crowd.getCreateBy());
        unit.setCreateTime(new Date());
        unit.setCrowdVersion(crowd.getLastVersion());
        unit.setStatus(CommonConstants.SampleStatusConstants.NORMAL);

        dao.insert(unit);
        return unit;
    }

    private boolean crowdNameExistInCampaign(Integer campaignId, String crowdName) throws Exception {
        CampaignLaunchUnitPage page = new CampaignLaunchUnitPage();
        page.setCampaignId(String.valueOf(campaignId));
        page.setCrowdName(crowdName);
        page.setStatus(String.valueOf(CommonConstants.SampleStatusConstants.NORMAL));
        List<CampaignLaunchUnit> unitList = queryByList(page);
        return CollectionUtils.isNotEmpty(unitList);
    }

    private boolean crowdNameExist(String crowdName) throws Exception {
        CrowdPage page = new CrowdPage();
        page.setRefName(crowdName);
        return crowdService.queryByCount(page) > 0;
    }

    public Crowd buildAndCreateCrowd(CrowdCreationPage page, HttpServletRequest request, Attachment attachment) throws Exception {
        Crowd crowd = buildCommon(page, request);
        switch (page.getCrowdType()) {
            case CROWD_TYPE_ACCURATE_HISTORY: {
                Crowd mktHistoryCrowd = crowdService.queryByRefId(page.getRefId());
                if (mktHistoryCrowd != null) {
                    crowd = mktHistoryCrowd;
                }
                crowd = buildUserCloudHistoryCrowd(crowd, page.getRefId());
                if (mktHistoryCrowd == null) {
                    crowdService.insert(crowd);
                } else {
                    crowdService.updateByPrimaryKeySelective(crowd);
                }
                if (!(CrowdCalcStatus.STATUS_FINISH == crowd.getCalcStatus())) {
                    crowdTaskCalcObjectRecordService.insertByCrowd(crowd, STATUS_IN_PROGRESS);
                }
                return crowd;
            }
            case CROWD_TYPE_ACCURATE_FILE: {
                if (crowdNameExist(crowd.getRefName())) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_NAME_DUP);
                }

                File file = new File(attachment.getPath());
                if (file.getName().endsWith(AttachmentConstants.AttachmentFormatConstants.ZIP_SUFFIX)) {
                    file = decompressAndCombine(file);
                }
                FileUtil.fileCheck(file, AttachmentConstants.AttachmentFormatConstants.CSV_SUFFIX);
                byte[] fileData = FileUtil.removeUTF8BOM(IOUtils.toByteArray(file.toURI()));
                crowd = buildAccurateFileCrowd(page, crowd, fileData);
                crowdService.insert(crowd);
                crowdTaskCalcObjectRecordService.insertByCrowd(crowd, STATUS_IN_PROGRESS);

                updateAttachment(crowd, attachment);
                return crowd;
            }
            case CROWD_TYPE_LOOKLIKE: {
                Crowd mktHistoryCrowd = crowdService.queryByRefId(page.getRefId());
                if (mktHistoryCrowd == null) {
                    crowdService.insert(crowd);
                    crowdTaskCalcObjectRecordService.insertByCrowd(crowd, STATUS_IN_PROGRESS);
                    return crowd;
                }
                return mktHistoryCrowd;
            }
            case CROWD_TYPE_SCENE: {
                Crowd mktHistoryCrowd = crowdService.queryByRefId(page.getRefId());
                if (mktHistoryCrowd == null) {
                    crowd = buildSceneCrowd(page, crowd);
                    crowdService.insert(crowd);
                    return crowd;
                }
                return mktHistoryCrowd;
            }
            default:
                throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_NOT_EXIST);
        }
    }

    private void updateAttachment(Crowd crowd, Attachment attachment) throws Exception {
        Attachment update = new Attachment();
        update.setId(attachment.getId());
        update.setRefId(crowd.getId());
        update.setType(AttachmentConstants.AttachmentTypeConstants.ATTACHMENT_TYPE_CROWD);
        update.setUpdater(crowd.getUpdater());
        update.setUpdaterBy(crowd.getUpdateBy());
        update.setUpdateTime(new Date());
        attachmentDao.updateByPrimaryKeySelective(update);
    }

    private File decompressAndCombine(File zip) throws ZipException, IOException {
        File targetDir = Files.createTempDir();
        ZipUtil.deCompress(zip, targetDir);
        List<String> mergedLines = new ArrayList<>();
        File[] fileArray = targetDir.listFiles();
        if (null != fileArray && fileArray.length > 0) {
            for (File file : fileArray) {
                List<String> lines = java.nio.file.Files.readAllLines(file.toPath(), Charset.forName("UTF-8"));
                if (!lines.isEmpty()) {
                    if (mergedLines.isEmpty()) {
                        //add header only once
                        mergedLines.add(lines.get(0));
                    }
                    mergedLines.addAll(lines.subList(1, lines.size()));
                }
            }
        }
        Path target = Paths.get(FilenameUtils.removeExtension(zip.getCanonicalPath()) + AttachmentConstants.AttachmentFormatConstants.CSV_SUFFIX);
        java.nio.file.Files.write(target, mergedLines, Charset.forName("UTF-8"));
        return target.toFile();
    }

    private Crowd buildCommon(CrowdCreationPage page, HttpServletRequest request) throws Exception {
        Crowd crowd = new Crowd();
        crowd = AssignmentUtil.setInfo(crowd, request);
        crowd.setRefId(page.getRefId());
        crowd.setStatus(CrowdStatus.STATUS_INEFFECTIVE);
        crowd.setCalcStatus(STATUS_IN_PROGRESS);
        crowd.setStartTime(page.getStartTime());
        crowd.setEndTime(page.getEndTime());
        crowd.setDescription(page.getDescription());
        if (page.getCrowdName() == null || "".equals(page.getCrowdName())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_NAME_NOT_EXIST);
        }
        crowd.setRefName(page.getCrowdName());
        if (page.getCampaignId() == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CAMPAIGN_ID_NOT_EXIST);
        }
        if (crowdNameExistInCampaign(Integer.parseInt(page.getCampaignId()), page.getCrowdName())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CAMPAIGN_CROWD_NAME_DUP);
        }
        //crowd.setCampaignId(Integer.parseInt(page.getCampaignId()));
        crowd.setCrowdType(page.getCrowdType());
        crowd.setParentId(0);
        crowd.setRefCode(page.getRefCode());
        crowd.setSource(page.getSource());
        crowd.setCreateTime(new Date());
        return crowd;
    }

    private Crowd buildAccurateFileCrowd(CrowdCreationPage page, Crowd crowd, byte[] fileData) throws Exception {
        try {
            Map<String, Integer> dvStat = crowdService.stat(new String(fileData));
            crowd.setAdEstimatedSize(dvStat.get(IdTypeConstants.IDFA));
            crowd.setPushEstimatedSize(dvStat.get(IdTypeConstants.TDID));
            crowd.setSmsEstimatedSize(dvStat.get(IdTypeConstants.MOBILEID));
            crowd.setEstimatedSize(dvStat.get(CommonConstants.TOTAL));
            crowd.setEdmEstimatedSize(dvStat.get(IdTypeConstants.EMAIL_ID));
            crowd = crowdService.configMasterAccountType(crowd);
        } catch (Exception e) {
            logger.error("stat dv from accurate file err:", e);
            throw e;
        }

        Integer refId = crowdApi.createCrowd(page.getCrowdName(), crowd.getIdType(), new String(fileData), crowd.getTenantId(),crowd.getCreateBy(),crowd.getCreator());
        if (refId == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CREATE_CROWD_FAIL);
        }
        crowd.setRefId(refId);
        crowd.setStatus(CrowdStatus.STATUS_INEFFECTIVE);


        return crowd;
    }

    private boolean crowdUpdateBeforeUserCloud(Crowd crowd, CrowdInfoResp resp) {
        if (crowd.getLastUpdateTime() == null) {
            return true;
        }
        if (resp.getUpdateDataTime() == null) {
            return true;
        }
        return crowd.getLastUpdateTime().before(new Date(resp.getUpdateDataTime()));
    }

    private Crowd buildUserCloudHistoryCrowd(Crowd crowd, Integer refId) throws Exception {
        CrowdInfoResp crowdInfoResp = crowdApi.getCrowdInfo(refId);
        if (crowdInfoResp == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_NULL, refId);
        }
        crowd.setStatus(crowdInfoResp.getStatus());
        crowd.setCalcStatus(crowdInfoResp.getCalcStatus());
        if (!(CrowdCalcStatus.STATUS_FINISH == crowdInfoResp.getStatus())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_NOT_FINISH, refId);
        }
        if (!(CrowdCalcStatus.STATUS_FINISH == crowdInfoResp.getCalcStatus())) {
            return crowd;
        }
        if (!crowdUpdateBeforeUserCloud(crowd, crowdInfoResp)) {
            return crowd;
        }
        crowd.setEstimatedSize(crowdInfoResp.getCrowdCount());
        String crowdVersion = String.valueOf(System.currentTimeMillis());
        crowd.setLastVersion(crowdVersion);
        crowd.setLastUpdateTime(new Date(crowdInfoResp.getUpdateDataTime()));
        crowd = buildEstimate(crowd, refId);
        boolean success = crowdApi.snapshotCrowd(refId, crowdVersion);
        if (!success) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_COPY_FAIL);
        }
        return crowd;
    }

    private Crowd buildEstimate(Crowd crowd, Integer refId) throws Exception {
        CrowdEstimateResp estimateResp = crowdApi.getEstimateById(refId);
        if (estimateResp == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_ESTIMATED_NULL, refId);
        }
        crowd.setPushEstimatedSize(estimateResp.getTdId());
        crowd.setSmsEstimatedSize(estimateResp.getPhoneNum());
        crowd.setAdEstimatedSize(estimateResp.getIDFA());
        return crowd;
    }

    private Crowd buildSceneCrowd(CrowdCreationPage page, Crowd crowd) throws Exception {
        if (page.getStartTime() == null || page.getEndTime() == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_TIME_NULL);
        }
        crowd.setStatus(CrowdStatus.STATUS_NOT_START);
        crowd.setCalcStatus(STATUS_NOT_START);
        return crowd;
    }

    private Attachment buildAttachment(String fileName, File file, Crowd crowd) throws IOException {
        logger.info("buildAttachment.file.getPath={},file.getCanonicalPath={}", file.getPath(), file.getCanonicalPath());
        Attachment attachment = new Attachment();
        attachment.setPath(file.getCanonicalPath());
        attachment.setRefId(crowd.getId());
        attachment.setName(fileName);
        attachment.setTenantId(crowd.getTenantId() + "");
        attachment.setCreator(crowd.getCreator());
        attachment.setCreateBy(crowd.getCreateBy());
        attachment.setCreateTime(new Date());
        return attachment;
    }

    public void deleteWithUpdateCrowdStatus(Integer unitId) throws Exception {
        CampaignLaunchUnit unit = selectByPrimaryKey(unitId);
        if (unit == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_NOT_EXIST);
        }

        Crowd crowd = crowdService.selectByPrimaryKey(unit.getCrowdId());
        if (crowd == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_NOT_EXIST);
        }

        Campaign campaign = campaignService.selectByPrimaryKey(unit.getCampaignId());
        if (campaign == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CAMPAIGN_NOT_EXIST);
        }

        if (campaign.getEndTime() == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_TIME_NOT_EXIST);
        }

        if (campaign.getEndTime().getTime() < System.currentTimeMillis()) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CAMPAIGN_FINISH);
        }

        if (unit.getCrowdVersion() == null) {
            if (null != crowd.getCalcStatus() && crowd.getCalcStatus() == STATUS_IN_PROGRESS) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_CALC);
            }
        }

        SegmentPage page = new SegmentPage();
        page.setStatus(String.valueOf(CommonConstants.SampleStatusConstants.DELETE));
        page.setStatusOperator("!=");
        page.setCampaignLaunchUnitId(String.valueOf(unit.getId()));
        page.setPageSize(Integer.MAX_VALUE);
        List<Segment> segmentList = segmentService.queryByList(page);
        if (segmentList.size() > 0) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_SEGMENT_READY);
        }

        // set status to delete
        unit.setStatus(CommonConstants.SampleStatusConstants.DELETE);
        updateByPrimaryKeySelective(unit);

        // set status to delete for do not push
        segmentService.updateStatusByUnitId(unit.getId(), CommonConstants.SampleStatusConstants.DELETE);
    }

    public List<CampaignLaunchUnitDto> findByCampaignId(Integer campaignId) throws Exception {
        List<CampaignLaunchUnitDto> pageList = new ArrayList();
        List<CampaignLaunchUnit> unitList = getSortedUnitList(campaignId);
        List<Segment> segmentList = getSortedSegmentList(campaignId);
        List<Crowd> crowdList = getCrowdListByIdList(new ArrayList<>(buildCrowdIdList(segmentList, unitList)));
        Map<Integer, Crowd> crowdMap = crowdList.stream()
            .collect(Collector.of(HashMap::new, (m, per) -> m.put(per.getId(), per), (k, v) -> v, Collector.Characteristics.IDENTITY_FINISH));
        Map<Integer, ChannelDefinition> channelDefinitionMap = channelDefinitionService.loadChannelDefinition();

        for (CampaignLaunchUnit campaignLaunchUnit : unitList) {
            CampaignLaunchUnitDto campaignLaunchUnitDto = buildCampaignLaunchUnitDto(campaignLaunchUnit, crowdMap);
            List<SegmentVO> unitSegmentList = new ArrayList();

            for (Segment segment : segmentList) {
                if (segment.getCampaignLaunchUnitId().equals(campaignLaunchUnit.getId())) {
                    SegmentVO segmentVOPage = segmentService.buildSegmentVO(segment, crowdMap);
                    ChannelDefinition channelDefinition = channelDefinitionMap.get(segment.getChannelDefinitionId());
                    if (channelDefinition != null) {
                        segmentVOPage.setChannelType(channelDefinition.getChannelType());
                    }

                    unitSegmentList.add(segmentVOPage);
                }
            }
            campaignLaunchUnitDto.setSegmentList(unitSegmentList);
            pageList.add(campaignLaunchUnitDto);
        }
        return pageList;
    }

    private List<CampaignLaunchUnit> getSortedUnitList(Integer campaignId) {
        CampaignLaunchUnitPage page = new CampaignLaunchUnitPage();
        page.getPager().setPageEnabled(false);
        page.setCampaignId(campaignId.toString());
        page.setStatus(String.valueOf(CommonConstants.SampleStatusConstants.DELETE));
        page.setStatusOperator("!=");
        page.setOrderBy("IFNULL(first_send_time,create_time)");
        page.setOrder("asc");
        List<CampaignLaunchUnit> unitList = dao.queryByList(page);
        return moveEarliestToHeader(unitList);
    }

    private List<CampaignLaunchUnit> moveEarliestToHeader(List<CampaignLaunchUnit> unitList) {
        List<CampaignLaunchUnit> copyEarliestUnitList = new ArrayList();
        List<CampaignLaunchUnit> copyOtherUnitList = new ArrayList();
        for (CampaignLaunchUnit campaignLaunchUnit : unitList) {
            if (campaignLaunchUnit.getFirstSendTime() != null) {
                copyEarliestUnitList.add(campaignLaunchUnit);
            } else {
                copyOtherUnitList.add(campaignLaunchUnit);
            }
        }
        copyEarliestUnitList.addAll(copyOtherUnitList);
        return copyEarliestUnitList;
    }

    private List<Segment> getSortedSegmentList(Integer campaignId) throws Exception {
        SegmentPage page = new SegmentPage();
        page.setPageSize(Integer.MAX_VALUE);
        page.setCampaignId(campaignId.toString());
        page.setStatus(String.valueOf(CommonConstants.SampleStatusConstants.DELETE));
        page.setStatusOperator("!=");
        page.setOrderBy("IFNULL(appointed_time,create_time)");
        page.setOrder("asc");

        List<Segment> segmentList = segmentService.queryByList(page);
        return segmentService.moveDraftCycleSegmentToTail(segmentList);
    }

    public List<Crowd> getCrowdListByCampaignId(Integer campaignId) throws Exception {
        List<Crowd> crowdList = Collections.EMPTY_LIST;
        CampaignLaunchUnitPage page = new CampaignLaunchUnitPage();
        page.getPager().setPageEnabled(false);
        page.setCampaignId(String.valueOf(campaignId));
        List<CampaignLaunchUnit> unitList = getDao().queryByList(page);
        if (org.apache.commons.collections.CollectionUtils.isNotEmpty(unitList)) {
            crowdList = crowdService.selectByIds(new ArrayList<>(unitList.stream().map(o -> o.getCrowdId()).collect(Collectors.toSet())));
        }
        return crowdList;
    }

    private Set<Integer> buildCrowdIdList(List<Segment> segmentList, List<CampaignLaunchUnit> unitList) {
        Set<Integer> crowdIdSet = new HashSet();
        Set<Integer> idSet = new HashSet<>();
        for (Segment segment : segmentList) {
            crowdIdSet.add(segment.getCrowdId());
        }
        for (CampaignLaunchUnit campaignLaunchUnit : unitList) {
            crowdIdSet.add(campaignLaunchUnit.getCrowdId());
        }
        for (Integer id : crowdIdSet) {
            idSet.add(id);
        }
        return idSet;
    }

    private List<Crowd> getCrowdListByIdList(List<Integer> crowdIdList) throws Exception {
        if (crowdIdList.isEmpty()) {
            return Collections.emptyList();
        }
        return crowdService.selectByIds(crowdIdList);
    }

    private CampaignLaunchUnitDto buildCampaignLaunchUnitDto(CampaignLaunchUnit campaignLaunchUnit, Map<Integer, Crowd> crowdMap)
            throws InvocationTargetException, IllegalAccessException, JsonProcessingException {
        logger.info("buildCampaignLaunchUnit:{}", JsonUtil.toJson(campaignLaunchUnit));
        CampaignLaunchUnitDto campaignLaunchUnitDto = new CampaignLaunchUnitDto();
        BeanUtils.copyProperties(campaignLaunchUnit, campaignLaunchUnitDto);
        Crowd crowd = crowdMap.get(campaignLaunchUnit.getCrowdId());
        if (crowd != null) {
            campaignLaunchUnitDto.setRefId(crowd.getRefId());
            campaignLaunchUnitDto.setCrowdType(crowd.getCrowdType());
            if (campaignLaunchUnit.getCrowdVersion() != null) {
                campaignLaunchUnitDto.setCrowdVersion(campaignLaunchUnit.getCrowdVersion());
                campaignLaunchUnitDto.setCrowdStatus(CrowdCalcStatus.STATUS_FINISH);
            } else {
                campaignLaunchUnitDto.setCrowdStatus(crowd.getCalcStatus());
            }
        } else {
            logger.error("bug:crowd must not be null");
        }
        return campaignLaunchUnitDto;
    }

    public ResponseEntity recount(Integer id) throws Exception {
        CampaignLaunchUnit campaignLaunchUnit = selectByPrimaryKey(id);
        if (campaignLaunchUnit == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_NOT_EXIST);
        }
        if (crowdTodayAlreadyUpdate(campaignLaunchUnit.getCrowdUpdateTime())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_NEWEST);
        }
        Crowd crowd = getCrowdById(campaignLaunchUnit.getCrowdId());
        switch (crowd.getCalcStatus()) {
            case STATUS_IN_PROGRESS:
                if (campaignLaunchUnit.getCrowdVersion() == null) {
                    throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_CALC);
                }
                campaignLaunchUnit = resetUnitCrowdVersion(campaignLaunchUnit);
                updateByPrimaryKey(campaignLaunchUnit);
                return new ResponseEntity(crowd.getCalcStatus(), HttpStatus.OK);
            case STATUS_DELETE:
                throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_DELETE);
            case STATUS_NOT_START:
                throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_CALC_NOT_START);
            case STATUS_UNUSUAL:
                crowdService.crowdRecountAndUpdate(crowd);
                campaignLaunchUnit = resetUnitCrowdVersion(campaignLaunchUnit);
                updateByPrimaryKey(campaignLaunchUnit);
                return new ResponseEntity(CrowdCalcStatus.STATUS_IN_PROGRESS, HttpStatus.OK);
            case STATUS_FINISH:
                switch (crowd.getCrowdType()) {
                    case CROWD_TYPE_SCENE:
                        throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_SCENE_CANNOT_RECOUNT);
                    case CROWD_TYPE_ACCURATE_FILE:
                        throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_FILE_CROWD_CANNOT_RECOUNT);
                    case CROWD_TYPE_LOOKLIKE:
                    case CROWD_TYPE_ACCURATE_HISTORY:
                        if (crowdTodayAlreadyUpdate(crowd.getLastUpdateTime())) {
                            campaignLaunchUnit = syncUnitVersionWithCrowd(campaignLaunchUnit, crowd);
                            updateByPrimaryKey(campaignLaunchUnit);
                            return new ResponseEntity(crowd.getCalcStatus(), HttpStatus.OK);
                        }
                        crowdService.crowdRecountAndUpdate(crowd);
                        campaignLaunchUnit = resetUnitCrowdVersion(campaignLaunchUnit);
                        updateByPrimaryKey(campaignLaunchUnit);
                        return new ResponseEntity(CrowdCalcStatus.STATUS_IN_PROGRESS, HttpStatus.OK);
                    default:
                        throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_TYPE_NOT_EXIST);
                }
            default:
                throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_CALC_STATUS_NOT_EXIST);
        }
    }

    private Crowd getCrowdById(Integer crowdId) throws Exception {
        Crowd crowd = crowdService.selectByPrimaryKey(crowdId);
        if (crowd == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_NOT_EXIST);
        }
        return crowd;
    }

    private CampaignLaunchUnit resetUnitCrowdVersion(CampaignLaunchUnit campaignLaunchUnit) {
        campaignLaunchUnit.setEstimatedSize(null);
        campaignLaunchUnit.setPushEstimatedSize(null);
        campaignLaunchUnit.setSmsEstimatedSize(null);
        campaignLaunchUnit.setAdEstimatedSize(null);
        campaignLaunchUnit.setUpdateTime(null);
        campaignLaunchUnit.setCrowdVersion(null);
        return campaignLaunchUnit;
    }

    private CampaignLaunchUnit syncUnitVersionWithCrowd(CampaignLaunchUnit campaignLaunchUnit, Crowd crowd) {
        campaignLaunchUnit.setEstimatedSize(crowd.getEstimatedSize());
        campaignLaunchUnit.setPushEstimatedSize(crowd.getPushEstimatedSize());
        campaignLaunchUnit.setSmsEstimatedSize(crowd.getSmsEstimatedSize());
        campaignLaunchUnit.setAdEstimatedSize(crowd.getAdEstimatedSize());
        campaignLaunchUnit.setUpdateTime(crowd.getLastUpdateTime());
        campaignLaunchUnit.setCrowdVersion(crowd.getLastVersion());
        return campaignLaunchUnit;
    }

    private boolean crowdTodayAlreadyUpdate(Date date) {
        if (date == null) {
            return false;
        }
        return DateUtil.isToday(date);
    }

    public CampaignLaunchUnitDto getUnitCrowds(Integer unitId) throws Exception {
        CampaignLaunchUnitDto campaignLaunchUnitDto = new CampaignLaunchUnitDto();
        CampaignLaunchUnit campaignLaunchUnit = selectByPrimaryKey(unitId);
        if (campaignLaunchUnit == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_NOT_EXIST);
        }
        campaignLaunchUnitDto.setId(campaignLaunchUnit.getId());
        campaignLaunchUnitDto.setStatus(campaignLaunchUnit.getStatus());
        campaignLaunchUnitDto.setCampaignId(campaignLaunchUnit.getCampaignId());
        if (campaignLaunchUnit.getCrowdVersion() != null) {
            campaignLaunchUnitDto.setCrowdVersion(campaignLaunchUnit.getCrowdVersion());
            campaignLaunchUnitDto.setEstimatedSize(campaignLaunchUnit.getEstimatedSize());
            campaignLaunchUnitDto.setPushEstimatedSize(campaignLaunchUnit.getPushEstimatedSize());
            campaignLaunchUnitDto.setSmsEstimatedSize(campaignLaunchUnit.getSmsEstimatedSize());
            campaignLaunchUnitDto.setAdEstimatedSize(campaignLaunchUnit.getAdEstimatedSize());
            campaignLaunchUnitDto.setCrowdStatus(CrowdCalcStatus.STATUS_FINISH);
            campaignLaunchUnitDto.setCrowdUpdateTime(campaignLaunchUnit.getCrowdUpdateTime());
            return campaignLaunchUnitDto;
        }
        Crowd crowd = crowdService.selectByPrimaryKey(campaignLaunchUnit.getCrowdId());
        if (crowd == null) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.UNIT_CROWD_NOT_EXIST);
        }
        if (CrowdCalcStatus.STATUS_FINISH == crowd.getCalcStatus()) {
            logger.error("投放单元人群版本和人群版本不一致,unit id:" + campaignLaunchUnit.getId());
        }
        campaignLaunchUnitDto.setCrowdName(crowd.getRefName());
        campaignLaunchUnitDto.setCrowdId(crowd.getId());
        campaignLaunchUnitDto.setRefId(crowd.getRefId());
        campaignLaunchUnitDto.setCrowdType(crowd.getCrowdType());
        campaignLaunchUnitDto.setCrowdStatus(crowd.getCalcStatus());
        return campaignLaunchUnitDto;
    }

    public void updateInCalcUnitByCrowdId(CampaignLaunchUnit campaignLaunchUnit, Integer crowdId) {
        getDao().updateInCalcUnitByCrowdId(campaignLaunchUnit, crowdId);
    }

    public void resetCrowdVersion(List<Integer> unitIdList) {
        if (unitIdList == null) {
            return;
        }
        if (unitIdList.size() <= 0) {
            return;
        }
        getDao().resetCrowdVersion(unitIdList);
    }

    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }
}
