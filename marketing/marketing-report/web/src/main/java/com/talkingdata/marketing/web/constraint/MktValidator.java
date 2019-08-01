package com.talkingdata.marketing.web.constraint;

import com.talkingdata.marketing.core.constant.CommonConstants;
import com.talkingdata.marketing.core.entity.admin.BehaviorDefinition;
import com.talkingdata.marketing.core.entity.admin.CampaignTargetDefinition;
import com.talkingdata.marketing.core.entity.admin.extend.FunnelStepDefinitionExt;
import com.talkingdata.marketing.core.entity.campaign.AppConfig;
import com.talkingdata.marketing.core.entity.campaign.Campaign;
import com.talkingdata.marketing.core.entity.campaign.CampaignFunnelConfig;
import com.talkingdata.marketing.core.entity.campaign.CampaignTargetConfig;
import com.talkingdata.marketing.core.entity.campaign.EquityConfig;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.campaign.Segment;
import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.EdgeDefinition;
import com.talkingdata.marketing.core.exception.ExceptionBuilder;
import com.talkingdata.marketing.core.exception.ExceptionMessage;
import com.talkingdata.marketing.core.exception.MktException;
import com.talkingdata.marketing.core.page.admin.BehaviorDefinitionPage;
import com.talkingdata.marketing.core.page.admin.CampaignTargetDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.SegmentPage;
import com.talkingdata.marketing.core.page.campaign.extend.BehaviorDefinitionExtendPage;
import com.talkingdata.marketing.core.page.campaign.extend.CampaignTargetDefinitionExtendPage;
import com.talkingdata.marketing.core.page.dto.CreateFunnelDto;
import com.talkingdata.marketing.core.service.admin.BehaviorDefinitionService;
import com.talkingdata.marketing.core.service.admin.CampaignTargetDefinitionService;
import com.talkingdata.marketing.core.service.campaign.AppConfigService;
import com.talkingdata.marketing.core.service.campaign.CampaignFunnelConfigService;
import com.talkingdata.marketing.core.service.campaign.CampaignService;
import com.talkingdata.marketing.core.service.campaign.CampaignTargetConfigService;
import com.talkingdata.marketing.core.service.campaign.EquityConfigService;
import com.talkingdata.marketing.core.service.campaign.PipelineDefinitionService;
import com.talkingdata.marketing.core.service.campaign.SegmentService;
import com.talkingdata.marketing.core.util.DateUtil;
import com.talkingdata.marketing.web.util.PipelineUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static com.talkingdata.marketing.core.constant.PipelineDefinitionConstant.PipelineDefinitionStatusConstant.PIPELINE_DEFINITION_STATUS_DRAFT;

/**
 * @author chunyan.ji
 * @create 2017-06-01-上午9:09
 * @since JDK 1.8
 */
@Component public class MktValidator {

    private static final Logger logger = LoggerFactory.getLogger(MktValidator.class);

    @Autowired private CampaignTargetConfigService campaignTargetConfigService;
    @Autowired private CampaignService campaignService;
    @Autowired private SegmentService segmentService;
    @Autowired private CampaignFunnelConfigService campaignFunnelConfigService;
    @Autowired private BehaviorDefinitionService behaviorDefinitionService;
    @Autowired private CampaignTargetDefinitionService campaignTargetDefinitionService;
    @Autowired private AppConfigService appConfigService;
    @Autowired private EquityConfigService equityConfigService;
    @Autowired private PipelineUtil pipelineUtil;
    @Autowired private PipelineDefinitionService pipelineDefinitionService;
    @Autowired private ExceptionBuilder exceptionBuilder;

    public <T> boolean validateUnique(T t) {
        boolean result = false;
        if (t instanceof CampaignTargetConfig) {
            CampaignTargetConfig config = (CampaignTargetConfig)t;
            result = validateCampaignTargetConfig(config);
        }
        if (t instanceof Campaign) {
            Campaign campaign = (Campaign)t;
            result = validateCampaignName(campaign);
        }
        if (t instanceof Segment) {
            Segment segment = (Segment)t;
            result = validateSegmentName(segment);
        }
        if (t instanceof CreateFunnelDto) {
            CreateFunnelDto createFunnelDto = (CreateFunnelDto)t;
            result = validateFunnelAndStep(createFunnelDto);
        }
        if (t instanceof BehaviorDefinitionExtendPage) {
            BehaviorDefinitionExtendPage behaviorDefinitionExtendPage = (BehaviorDefinitionExtendPage)t;
            result = validateBehaviorDefinitionName(behaviorDefinitionExtendPage);
        }
        if (t instanceof CampaignTargetDefinitionExtendPage) {
            CampaignTargetDefinitionExtendPage campaignTargetDefinitionExtendPage = (CampaignTargetDefinitionExtendPage)t;
            result = validateCampaignTargetDefinitionName(campaignTargetDefinitionExtendPage);
        }
        if (t instanceof AppConfig) {
            AppConfig appConfig = (AppConfig)t;
            result = validateAppConfigAppIdAndPid(appConfig);
        }
        if (t instanceof EquityConfig) {
            EquityConfig equityConfig = (EquityConfig)t;
            result = validateEquityConfig(equityConfig);
        }
        return result;
    }

    private boolean validateEquityConfig(EquityConfig equityConfig) {
        List<EquityConfig> equityConfigs;
        try {
            equityConfigs = equityConfigService.findByName(equityConfig.getName(), equityConfig.getAttachmentName(), equityConfig.getCampaignId());
        } catch (Exception e) {
            logger.info("使用权益名称和附件名称为参数查询数据发生异常：{}", e);
            return false;
        }
        if (equityConfigs.isEmpty()) {
            return true;
        } else {
            boolean flag = false;
            if (equityConfig.getId() != null && equityConfigs.size() == 1) {
                if (equityConfigs.get(0).getId().equals(equityConfig.getId())) {
                    flag = true;
                }
            }
            return flag;
        }
    }

    private boolean validateAppConfigAppIdAndPid(AppConfig appConfig) {
        List<AppConfig> appConfigs;
        try {
            appConfigs = appConfigService.queryByAppIdOrPid(appConfig.getAppId(), appConfig.getProductId());
        } catch (Exception e) {
            logger.info("使用AppId或者Productid为参数查询数据发生异常：{}", e);
            return false;
        }
        if (appConfigs.isEmpty()) {
            return true;
        } else {//exclude self
            boolean flag = false;
            if (appConfig.getId() != null && appConfigs.size() == 1) {
                if (appConfigs.get(0).getId().equals(appConfig.getId())) {
                    flag = true;
                }
            }
            return flag;
        }
    }

    private boolean validateCampaignTargetDefinitionName(CampaignTargetDefinitionExtendPage campaignTargetDefinitionExtendPage) {
        List<CampaignTargetDefinition> campaignTargetDefinitions;
        try {
            CampaignTargetDefinitionPage page = new CampaignTargetDefinitionPage();
            page.setPageSize(Integer.MAX_VALUE);
            page.setName(campaignTargetDefinitionExtendPage.getName());
            page.setTenantId(campaignTargetDefinitionExtendPage.getTenantId());
            page.setStatus(String.valueOf(CommonConstants.SampleStatusConstants.DELETE));
            page.setStatusOperator("!=");
            campaignTargetDefinitions = campaignTargetDefinitionService.queryByList(page);
        } catch (Exception e) {
            logger.info("使用指标名称为参数查询数据发生异常：{}", e);
            return false;
        }
        if (campaignTargetDefinitions.isEmpty()) {
            return true;
        } else {//exclude self
            boolean flag = false;
            if (campaignTargetDefinitionExtendPage.getId() != null) {
                for (CampaignTargetDefinition campaignTargetDefinition : campaignTargetDefinitions) {
                    if (campaignTargetDefinition.getId().equals(campaignTargetDefinitionExtendPage.getId())) {
                        flag = true;
                    }
                }
            }
            return flag;
        }
    }

    private boolean validateBehaviorDefinitionName(BehaviorDefinitionExtendPage behaviorDefinitionExtendPage) {
        List<BehaviorDefinition> behaviorDefinitions;
        try {
            BehaviorDefinitionPage page = new BehaviorDefinitionPage();
            page.setPageSize(Integer.MAX_VALUE);
            page.setName(behaviorDefinitionExtendPage.getName());
            page.setTenantId(behaviorDefinitionExtendPage.getTenantId());
            page.setStatus(String.valueOf(CommonConstants.SampleStatusConstants.DELETE));
            page.setStatusOperator("!=");
            behaviorDefinitions = behaviorDefinitionService.queryByList(page);
        } catch (Exception e) {
            logger.info("使用事件名称为参数查询数据发生异常：{}", e);
            return false;
        }
        if (behaviorDefinitions.isEmpty()) {
            return true;
        } else {//exclude self
            boolean flag = false;
            if (behaviorDefinitionExtendPage.getId() != null) {
                for (BehaviorDefinition behaviorDefinition : behaviorDefinitions) {
                    if (behaviorDefinition.getId().equals(behaviorDefinitionExtendPage.getId())) {
                        flag = true;
                    }
                }
            }
            return flag;
        }
    }

    private boolean validateFunnelAndStep(CreateFunnelDto createFunnelDto) {
        boolean funnelResult = validateFunnel(createFunnelDto);
        boolean stepResult = validateStep(createFunnelDto);
        return (funnelResult == true) && (stepResult == true) ? true : false;
    }

    private boolean validateStep(CreateFunnelDto createFunnelDto) {
        List<FunnelStepDefinitionExt> funnelStepDefinitionExts = createFunnelDto.getFunnelStepDefinitionExts();
        Set<String> tmp = new HashSet<>();
        for (FunnelStepDefinitionExt funnelStepDefinitionExt : funnelStepDefinitionExts) {
            tmp.add(funnelStepDefinitionExt.getName());
        }
        return funnelStepDefinitionExts.size() == tmp.size();
    }

    private boolean validateFunnel(CreateFunnelDto createFunnelDto) {
        List<CampaignFunnelConfig> configs = new ArrayList<>();
        try {
            configs = campaignFunnelConfigService.listByCampaignIdAndName(createFunnelDto.getCampaignId(), createFunnelDto.getFunnelName());
        } catch (Exception e) {
            logger.info("使用营销活动ID与漏斗名称为参数查询数据发生异常：{}", e);
            return false;
        }
        if (configs.isEmpty()) {
            return true;
        } else {//exclude self
            boolean flag = true;
            for (CampaignFunnelConfig index : configs) {
                if (!index.getId().equals(createFunnelDto.getCampaignFunnelConfigId())) {
                    flag = false;
                }
            }
            return flag;
        }
    }

    private boolean validateSegmentName(Segment segment) {
        List<Segment> segments;
        try {
            SegmentPage page = new SegmentPage();
            page.setPageSize(Integer.MAX_VALUE);
            page.setName(segment.getName());
            page.setCampaignId(String.valueOf(segment.getCampaignId()));
            page.setTenantId(segment.getTenantId());
            page.setStatus(String.valueOf(CommonConstants.SampleStatusConstants.DELETE));
            page.setStatusOperator("!=");
            segments = segmentService.queryByList(page);
        } catch (Exception e) {
            logger.info("使用投放名称为参数查询数据发生异常：{}", e);
            return false;
        }
        if (segments.isEmpty()) {
            return true;
        } else {//exclude self
            boolean flag = true;
            for (Segment index : segments) {
                if (!index.getId().equals(segment.getId())) {
                    flag = false;
                }
            }
            return flag;
        }
    }

    private boolean validateCampaignName(Campaign campaign) {
        List<Campaign> campaigns;
        try {
            campaigns = campaignService.listByCampaignName(campaign.getName(), campaign.getTenantId());
        } catch (Exception e) {
            logger.info("使用活动名称为参数查询数据发生异常：{}", e);
            return false;
        }
        if (campaigns.isEmpty()) {
            return true;
        }

        //exclude self and deleted campaigns
        for (Campaign index : campaigns) {
            //exclude itself
            if (index.getId().equals(campaign.getId())) {
                continue;
            }
            // status is null, default not deleted campaigns
            if (index.getStatus() == null) {
                return false;
            }
            if (CommonConstants.SampleStatusConstants.DELETE != index.getStatus() ) {
                return false;
            }
        }
        return true;
    }

    private boolean validateCampaignTargetConfig(CampaignTargetConfig config) {
        List<CampaignTargetConfig> configs = new ArrayList<>();
        try {
            configs = campaignTargetConfigService.findByUniqueIndex(config.getCampaignId(), config.getTargetDefinitionId(), config.getMetricType());
        } catch (Exception e) {
            logger.info("使用唯一索引参数查询数据发生异常：{}", e);
            return false;
        }
        if (configs.isEmpty()) {
            return true;
        } else {//exclude self
            boolean flag = true;
            for (CampaignTargetConfig index : configs) {
                if (!index.getId().equals(config.getId())) {
                    flag = false;
                }
            }
            return flag;
        }
    }

    public boolean validateNodeDefinitionId(List<AbstractNodeDefinition> nodeDefinitionList, List<EdgeDefinition> edgeDefinitionList) {
        boolean flag = Boolean.FALSE;
        try {
            boolean nodeIsNotNull = nodeDefinitionList != null;
            boolean edgeIsNotNull = edgeDefinitionList != null;
            if (nodeIsNotNull && edgeIsNotNull) {
                pipelineUtil.genMap(nodeDefinitionList, edgeDefinitionList);
                flag = Boolean.TRUE;
            }
        } catch (MktException e) {
            logger.info("组件id重复");
        }
        return flag;
    }

    /**
     * 验证营销流程名称在一次营销活动中是否唯一，唯一返回True,否则False
     *
     * @param pipelineId   营销流程ID
     * @param campaignId   营销活动ID
     * @param pipelineName 营销流程名称
     * @param tenantId     租户ID
     * @return Boolean类型
     * @throws Exception
     */
    public boolean validatePipelineNameOnlyInCampaign(Integer pipelineId, Integer campaignId, String pipelineName, String tenantId) throws Exception {
        List<PipelineDefinition> pipelineDefinitions = pipelineDefinitionService.getByCampaignIdAndPipelineName(campaignId, pipelineName, tenantId);
        if (pipelineDefinitions != null && !pipelineDefinitions.isEmpty()) {
            for (PipelineDefinition definition : pipelineDefinitions) {
                if (!definition.getId().equals(pipelineId)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 验证活动时间范围
     * 如果当前活动下有流程，在修改活动时间范围时需要确认修改值是否包含流程的时间范围(非草稿状态的流程)
     *
     * @param campaignId 活动ID
     * @param startTime  活动开始时间
     * @param endTime    活动结束时间
     * @return 校验通过返回true，校验不通过返回false
     * @throws Exception
     */
    public void validateCampaignTimeFrame(Integer campaignId, Date startTime, Date endTime) throws MktException {
        List<PipelineDefinition> pipelineDefinitions = pipelineDefinitionService.findByCampaignId(campaignId);

        for (PipelineDefinition def : pipelineDefinitions) {
            if (PIPELINE_DEFINITION_STATUS_DRAFT.equals(def.getStatus())) {
                continue;
            }
            if (startTime.after(def.getStartTime())) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_TIME_FRAME_ERROR_PIPELINE_START_BEFORE_CAMPAIGN);
            }
            if (endTime.before(def.getEndTime())) {
                throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_TIME_FRAME_ERROR_CAMPAIGN_END_AFTER_CAMPAIGN);
            }
        }
    }

    /**
     * 验证流程时间范围
     * 流程时间范围必须包含在活动时间范围内
     *
     * @param campaignId 活动ID
     * @param startTime  流程开始时间
     * @param endTime    流程结束时间
     * @return 校验通过返回true，校验不通过返回false
     * @throws Exception
     */
    public void validatePipelineTimeFrame(Integer campaignId, Date startTime, Date endTime) throws Exception {
        Campaign campaign = campaignService.selectByPrimaryKey(campaignId);
        String start = DateUtil.date2String("yyyy-MM-dd", startTime);
        String end = DateUtil.date2String("yyyy-MM-dd", endTime);
        String today = DateUtil.date2String("yyyy-MM-dd", new Date());
        if (today.compareTo(start) > 0) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_TIME_FRAME_ERROR_PIPELINE_START_BEFORE_TODAY);
        }
        if (today.compareTo(end) > 0) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_TIME_FRAME_ERROR_PIPELINE_END_BEFORE_TODAY);
        }
        if (startTime.before(campaign.getStartTime())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_TIME_FRAME_ERROR_PIPELINE_START_BEFORE_CAMPAIGN);
        }
        if (endTime.after(campaign.getEndTime())) {
            throw exceptionBuilder.buildMktException(ExceptionMessage.PIPELINE_DEFINITION_TIME_FRAME_ERROR_CAMPAIGN_END_AFTER_CAMPAIGN);
        }
    }
}
