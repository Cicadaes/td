package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.enterprise.base.service.BaseService;
import com.talkingdata.marketing.core.constant.CampaignConstant;
import com.talkingdata.marketing.core.dao.campaign.CampaignDao;
import com.talkingdata.marketing.core.dao.campaign.CampaignFunnelConfigDao;
import com.talkingdata.marketing.core.dao.campaign.CampaignLaunchUnitDao;
import com.talkingdata.marketing.core.dao.campaign.CampaignTargetConfigDao;
import com.talkingdata.marketing.core.dao.campaign.CrowdDao;
import com.talkingdata.marketing.core.dao.campaign.PipelineDefinitionDao;
import com.talkingdata.marketing.core.dao.campaign.PipelineInstanceDao;
import com.talkingdata.marketing.core.dao.campaign.PipelineStageDao;
import com.talkingdata.marketing.core.dao.campaign.SegmentDao;
import com.talkingdata.marketing.core.dao.campaign.SegmentTaskCalcObjectRecordDao;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.entity.campaign.CampaignFunnelConfig;
import com.talkingdata.marketing.core.entity.campaign.CampaignTargetConfig;
import com.talkingdata.marketing.core.entity.campaign.EquityConfig;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.campaign.PipelineEquityConfigDefinition;
import com.talkingdata.marketing.core.entity.dto.CampaignStatDto;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.page.campaign.CampaignPage;
import com.talkingdata.marketing.core.page.campaign.extend.CampaignExtendPage;
import com.talkingdata.marketing.core.util.AssignmentUtil;
import com.talkingdata.marketing.core.util.CommonUtil;
import com.talkingdata.marketing.core.util.DateUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_DRAFT;

/**
 * <br>
 * <b>功能：</b>TD_MKT_CAMPAIGN CampaignService<br>
 * <b>@author：</b>code generator<br>
 * <b>日期：</b> 2017-04-26 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("campaignService")
@Transactional(value = "marketingTransactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class CampaignService extends BaseService<Campaign, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(CampaignService.class);
    @Autowired
    private CampaignDao dao;
    @Autowired
    private ExceptionBuilder exceptionBuilder;
    @Autowired
    private SegmentDao segmentDao;
    @Autowired
    private CrowdDao crowdDao;
    @Autowired
    private CampaignTargetConfigDao campaignTargetConfigDao;
    @Autowired
    private CampaignLaunchUnitDao campaignLaunchUnitDao;
    @Autowired
    private PipelineDefinitionDao pipelineDefinitionDao;
    @Autowired
    private CampaignFunnelConfigDao campaignFunnelConfigDao;
    @Autowired
    private PipelineInstanceDao pipelineInstanceDao;
    @Autowired
    private PipelineStageDao pipelineStageDao;
    @Autowired
    private SegmentTaskCalcObjectRecordDao segmentTaskCalcObjectRecordDao;
    @Autowired
    private EquityConfigService equityConfigService;
    @Autowired
    private PipelineEquityConfigDefinitionService pipelineEquityConfigDefinitionService;

    @Override
    public CampaignDao getDao() {
        return dao;
    }

    public List<CampaignExtendPage> getCampaignExtendPages(CampaignPage page) throws Exception {
        long startTime = System.currentTimeMillis();
        List<Campaign> rows = queryByParam(page);
        List<Integer> campaignIds = getCampaignIds(rows);
        if (campaignIds.isEmpty()) {
            return Collections.EMPTY_LIST;
        }
        List<CampaignExtendPage> list = new ArrayList();
        for (Campaign campaign : rows) {
            CampaignExtendPage campaignExtendPage = CampaignExtendPage.toCampaignExtend(campaign);
            list.add(campaignExtendPage);
        }
        logger.info("营销活动查询列表耗时 getCampaignExtendPages :{}", ((System.currentTimeMillis() - startTime) / 1000));
        return list;
    }

    private List<Integer> getCampaignIds(List<Campaign> rows) {
        List<Integer> campaignIds = new ArrayList();
        for (Campaign campaign : rows) {
            campaignIds.add(campaign.getId());
        }
        return campaignIds;
    }

    public List<Campaign> queryByParam(CampaignPage page) {
        Integer offset = null;
        Integer limit = null;
        if (page.getPager().isPageEnabled() && page.getPage() != null && page.getPageSize() != null) {
            offset = (page.getPage() - 1) * page.getPageSize();
            limit = page.getPageSize();
        }
        Date nowTime = new Date();
        Map<String, Object> hashMap = new HashMap(16);
        hashMap.put("status", page.getStatus());
        hashMap.put("nowTime", nowTime);
        if (!StringUtils.isEmpty(page.getName())) {
            hashMap.put("name", page.getName());
        }
        hashMap.put("startTime", page.getStartTime());
        hashMap.put("endTime", page.getEndTime());
        hashMap.put("offset", offset);
        hashMap.put("limit", limit);
        hashMap.put("orderBy", page.getOrderBy());
        hashMap.put("order", page.getOrder());
        hashMap.put("tenantId", page.getTenantId());
        List<Campaign> campaignList = getDao().findByStatusAndTimeRange(hashMap);
        return campaignList;
    }

    public int countByParam(CampaignPage page) {
        long startTime = System.currentTimeMillis();
        Date nowTime = new Date();
        Map<String, Object> hashMap = new HashMap(16);
        hashMap.put("status", page.getStatus());
        hashMap.put("nowTime", nowTime);
        if (!StringUtils.isEmpty(page.getName())) {
            hashMap.put("name", page.getName());
        }
        hashMap.put("startTime", page.getStartTime());
        hashMap.put("endTime", page.getEndTime());

        int count = getDao().countByStatusAndTimeRange(hashMap);

        logger.info("营销活动查询列表耗时 countByParam :{}", ((System.currentTimeMillis() - startTime) / 1000));
        return count;
    }

    public List<Campaign> listByCampaignName(String name, String tenantId) throws Exception {
        CampaignPage page = new CampaignPage();
        page.setName(name);
        page.setTenantId(tenantId);
        List<Campaign> result = getDao().queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    public List<Campaign> selectByIds(List<Integer> ids) {
        return getDao().selectByIds(ids);
    }

    public void deleteByCreateTime(String createTime) throws Exception {
        Assert.isTrue(!StringUtils.isBlank(createTime), "时间参数为空");
        getDao().deleteByCreateTime(createTime);
    }

    public void delete(Integer id) throws Exception {
        Campaign campaign = getDao().selectByPrimaryKey(id);
        boolean notStarted = campaign.getStartTime().getTime() > System.currentTimeMillis();
        if (!notStarted) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.CAMPAIGN_CANNOT_DEL);
        }
        campaign.setStatus(CampaignConstant.CampaignStatusConstant.CAMPAIGN_DELETE);
        getDao().updateByPrimaryKeySelective(campaign);
    }

    /**
     * TODO  待删除
     * @return
     */
    public List<Campaign> getUnFinishCampaignIdList() {
        CampaignPage page = new CampaignPage();
        page.setPageSize(Integer.MAX_VALUE);
        page.setStatus(String.valueOf(CampaignConstant.CampaignStatusConstant.CAMPAIGN_DELETE));
        page.setStatusOperator("!=");
        Date now = new Date();
        page.setStartTime(now);
        page.setStartTimeOperator("<=");
        page.setEndTime(now);
        page.setEndTimeOperator(">=");
        List<Campaign> campaignList;
        try {
            campaignList = queryByList(page);
        } catch (Exception e) {
            logger.error("get campaign list err", e);
            return Collections.EMPTY_LIST;
        }
        return campaignList;
    }

    public Campaign getCampaignByPrimaryKey(Integer id) throws Exception {
        Campaign result = selectByPrimaryKey(id);
        result.setStatus(CampaignExtendPage.calcCampaignStatus(result));
        return result;
    }

    public CampaignStatDto stat(String tenantId) throws Exception {
        Date starDate = DateUtil.getStartDateInYear();
        Date endDate = DateUtil.getEndDateInYear();
        List<Campaign> campaignList = getDao().findByStartTime(starDate, endDate, tenantId);
        Date now = new Date();
        int finish = 0;
        int inProgress = 0;
        int notStart = 0;
        for (Campaign campaign : campaignList) {
            boolean finishFlag = now.compareTo(campaign.getEndTime()) > 0;
            boolean startFlag = now.compareTo(campaign.getStartTime()) > 0;
            if (finishFlag) {
                finish++;
            } else if ((!finishFlag) && startFlag) {
                inProgress++;
            } else if (!startFlag) {
                notStart++;
            }
        }
        CampaignStatDto campaignStatDto = new CampaignStatDto();
        int total = campaignList.size();
        campaignStatDto.setTotal(total);
        campaignStatDto.setFinish(finish);
        campaignStatDto.setInProgress(inProgress);
        campaignStatDto.setNotStart(notStart);
        if (total != 0) {
            campaignStatDto.setFinishPercent(CommonUtil.getPercent(finish, total));
            campaignStatDto.setInProgressPercent(CommonUtil.getPercent(inProgress, total));
            campaignStatDto.setNotStartPercent(CommonUtil.getPercent(notStart, total));
        }
        return campaignStatDto;
    }

    public Campaign copy(Integer sourceCampaignId, Campaign campaignFromReq, HttpServletRequest request) throws Exception {
        Campaign campaign = new Campaign();
        Campaign campaignInDb = this.selectByPrimaryKey(sourceCampaignId);
        BeanUtils.copyProperties(campaignInDb, campaign);
        Date now = new Date();
        campaign.setId(null);
        campaign.setCreateTime(now);
        campaign.setUpdater(null);
        campaign.setUpdateBy(null);
        campaign.setUpdateTime(now);
        campaign.setStatus(CampaignConstant.CampaignStatusConstant.CAMPAIGN_WAITING);
        campaign.setName(campaignFromReq.getName());
        campaign.setStartTime(campaignFromReq.getStartTime());
        campaign.setEndTime(campaignFromReq.getEndTime());
        campaign.setDescription(campaignFromReq.getDescription());
        AssignmentUtil.setInfo(campaign, request);
        this.insert(campaign);
        List<Integer> campaignIds = new ArrayList<>();
        campaignIds.add(sourceCampaignId);
        List<CampaignTargetConfig> targetConfigs = campaignTargetConfigDao.getByCampaignIds(campaignIds);
        if (targetConfigs != null && targetConfigs.size() > 0) {
            copyTargetConfig(campaign, now, targetConfigs, request);
        }
        /**
         * 暂时不克隆
         */
        //        List<CampaignFunnelConfig> campaignFunnelConfigs = campaignFunnelConfigDao.findByCampaignId(sourceCampaignId);
        //        List<CampaignLaunchUnit> campaignLaunchUnitList = campaignLaunchUnitDao.findByCampaignId(sourceCampaignId);
        //        List<PipelineDefinition> pipelineDefinitionList = pipelineDefinitionDao.findByCampaignId(sourceCampaignId);
        //        List<EquityConfig> equityConfigs = equityConfigService.findByCampaignId(sourceCampaignId);
        //        if (campaignFunnelConfigs!=null  && campaignFunnelConfigs.size()>0){
        //            copyCampaignFunnelConfig(campaign, now, campaignFunnelConfigs,request);
        //        }
        //        if (pipelineDefinitionList!=null && pipelineDefinitionList.size()>0){
        //            copyPipelineDefinition(campaign, now, pipelineDefinitionList,request);
        //        }
        //        if (campaignLaunchUnitList!=null && campaignLaunchUnitList.size()>0){
        //            copyUnit(campaign, now, campaignLaunchUnitList,request);
        //        }
        //        if (equityConfigs != null && !equityConfigs.isEmpty()) {
        //            copyEquityConfigs(campaign, now, equityConfigs, request);
        //        }
        return campaign;
    }

    /**
     * Copy营销活动的权益
     *
     * @param campaign
     * @param now
     * @param equityConfigs
     * @param request
     * @throws Exception
     */
    private void copyEquityConfigs(Campaign campaign, Date now, List<EquityConfig> equityConfigs, HttpServletRequest request) throws Exception {
        for (EquityConfig equityConfig : equityConfigs) {
            baseCopy(equityConfig, campaign, now);
            AssignmentUtil.setInfo(equityConfig, request);
            equityConfigService.insert(equityConfig);
        }
    }

    private void copyCampaignFunnelConfig(Campaign campaign, Date now, List<CampaignFunnelConfig> campaignFunnelConfigs, HttpServletRequest request)
        throws Exception {
        for (CampaignFunnelConfig campaignFunnelConfig : campaignFunnelConfigs) {
            baseCopy(campaignFunnelConfig, campaign, now);
            AssignmentUtil.setInfo(campaignFunnelConfig, request);
            campaignFunnelConfigDao.insert(campaignFunnelConfig);
        }
    }

    private <T> T baseCopy(T obj, Campaign campaign, Date now) throws Exception {
        Class clazz = obj.getClass();
        Method setId = clazz.getMethod("setId", Integer.class);
        setId.invoke(obj, (Object)null);
        if (!(obj instanceof PipelineEquityConfigDefinition)) {
            Method setCampaignId = clazz.getMethod("setCampaignId", Integer.class);
            setCampaignId.invoke(obj, campaign.getId());
        }
        Method setCreateTime = clazz.getMethod("setCreateTime", Date.class);
        setCreateTime.invoke(obj, now);
        Method setUpdateTime = clazz.getMethod("setUpdateTime", Date.class);
        setUpdateTime.invoke(obj, now);
        if (obj instanceof EquityConfig) {
            Method setUpdaterBy = clazz.getMethod("setUpdaterBy", String.class);
            setUpdaterBy.invoke(obj, (Object)null);
        } else {
            Method setUpdateBy = clazz.getMethod("setUpdateBy", String.class);
            setUpdateBy.invoke(obj, (Object)null);
        }
        Method setUpdater = clazz.getMethod("setUpdater", String.class);
        setUpdater.invoke(obj, (Object)null);
        return obj;
    }

    private void copyPipelineDefinition(Campaign campaign, Date now, List<PipelineDefinition> pipelineDefinitionList, HttpServletRequest request)
        throws Exception {
        for (PipelineDefinition pipelineDefinition : pipelineDefinitionList) {
            Integer sourcePipelineDefinitionId = pipelineDefinition.getId();
            baseCopy(pipelineDefinition, campaign, now);
            AssignmentUtil.setInfo(pipelineDefinition, request);
            pipelineDefinition.setStatus(PIPELINE_DEFINITION_STATUS_DRAFT);
            pipelineDefinitionDao.insert(pipelineDefinition);
            copyPipelineEquityConfig(sourcePipelineDefinitionId, pipelineDefinition.getId(), pipelineDefinition.getTenantId(), now, request,
                campaign);
        }
    }

    /**
     * Copy营销流程的权益
     *
     * @param sourcePipelineDefinitionId
     * @param targetPipelineDefinitionId
     * @param tenantId
     * @param now
     * @param request
     * @param campaign
     * @throws Exception
     */
    private void copyPipelineEquityConfig(Integer sourcePipelineDefinitionId, Integer targetPipelineDefinitionId, String tenantId, Date now,
        HttpServletRequest request, Campaign campaign) throws Exception {
        List<PipelineEquityConfigDefinition> pipelineEquityConfigDefinitions =
            pipelineEquityConfigDefinitionService.listByPipelineDefinitionId(sourcePipelineDefinitionId, tenantId);
        for (PipelineEquityConfigDefinition equityConfigDefinition : pipelineEquityConfigDefinitions) {
            baseCopy(equityConfigDefinition, campaign, now);
            equityConfigDefinition.setPipelineDefinitionId(targetPipelineDefinitionId);
            //            equityConfigDefinition.setEquityConfigId();
            AssignmentUtil.setInfo(equityConfigDefinition, request);
            pipelineEquityConfigDefinitionService.insert(equityConfigDefinition);
        }
    }

    private void copyTargetConfig(Campaign campaign, Date now, List<CampaignTargetConfig> targetConfigs, HttpServletRequest request)
        throws Exception {
        for (CampaignTargetConfig campaignTargetConfig : targetConfigs) {
            baseCopy(campaignTargetConfig, campaign, now);
            campaignTargetConfig = AssignmentUtil.setInfo(campaignTargetConfig, request);
            campaignTargetConfigDao.insert(campaignTargetConfig);
        }
    }

/*    private void copyUnit(Campaign campaign, Date now, List<CampaignLaunchUnit> campaignLaunchUnitList, HttpServletRequest request) throws Exception {
        for(CampaignLaunchUnit campaignLaunchUnit : campaignLaunchUnitList){
            List<Segment> segmentList = segmentDao.findByCampaignLaunchUnitId(campaignLaunchUnit.getId());
            baseCopy(campaignLaunchUnit,campaign,now);
            campaignLaunchUnit = AssignmentUtil.setInfo(campaignLaunchUnit,request);
            campaignLaunchUnitDao.insert(campaignLaunchUnit);
            if (segmentList!=null && segmentList.size()>0){
                copySegment(campaign, now, campaignLaunchUnit, segmentList,request);
            }
        }
    }*/

/*    private void copySegment(Campaign campaign, Date now, CampaignLaunchUnit campaignLaunchUnit, List<Segment> segmentList, HttpServletRequest request) throws Exception {
        for (Segment segment:segmentList){
            List<Crowd> crowdList = crowdDao.queryBySegmentId(segment.getId());
            baseCopy(segment,campaign,now);
            segment.setCampaignLaunchUnitId(campaignLaunchUnit.getId());
            segment.setStatus(SegmentConstant.SegmentStatusConstant.SEGMENT_STATUS_DRAFT);
            segment = AssignmentUtil.setInfo(segment,request);
            segmentDao.insert(segment);
            for (Crowd crowd:crowdList){
                baseCopy(crowd,campaign,now);
                crowd.setSegmentId(segment.getId());
                AssignmentUtil.setInfo(crowd,request);
                crowdDao.insert(crowd);
            }
        }
    }*/

    public Campaign getCampaignByEquityConfigId(Integer equityConfigId) {
        Campaign campaign = getDao().getCampaignByEquityConfigId(equityConfigId);
        campaign.setStatus(CampaignExtendPage.calcCampaignStatus(campaign));
        return campaign;
    }
}
