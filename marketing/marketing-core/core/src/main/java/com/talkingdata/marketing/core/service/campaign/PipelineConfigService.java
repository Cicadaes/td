package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.annotation.EnableAssignmentTime;
import com.talkingdata.marketing.core.constant.AttachmentConstants;
import com.talkingdata.marketing.core.constant.PipelineScopeConstants;
import com.talkingdata.marketing.core.entity.admin.BehaviorDefinition;
import com.talkingdata.marketing.core.entity.admin.CampaignTargetDefinition;
import com.talkingdata.marketing.core.entity.admin.FunnelIndexDefinition;
import com.talkingdata.marketing.core.entity.admin.InputDataOption;
import com.talkingdata.marketing.core.entity.admin.InputDataSchema;
import com.talkingdata.marketing.core.entity.campaign.Attachment;
import com.talkingdata.marketing.core.entity.campaign.CampaignTargetConfig;
import com.talkingdata.marketing.core.entity.campaign.PipelineDefinition;
import com.talkingdata.marketing.core.entity.campaign.PipelineEquityConfigDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.PipelineDiagram;
import com.talkingdata.marketing.core.entity.campaign.definition.node.EntranceNodeDefinition;
import com.talkingdata.marketing.core.entity.dto.PipelineConfigDTO;
import com.talkingdata.marketing.core.page.admin.BehaviorDefinitionPage;
import com.talkingdata.marketing.core.page.campaign.CampaignTargetConfigPage;
import com.talkingdata.marketing.core.service.admin.BehaviorDefinitionService;
import com.talkingdata.marketing.core.service.admin.CampaignTargetDefinitionService;
import com.talkingdata.marketing.core.service.admin.FunnelIndexDefinitionService;
import com.talkingdata.marketing.core.service.admin.InputDataOptionService;
import com.talkingdata.marketing.core.service.admin.InputDataSchemaService;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Pipeline Config
 *   提供Pipeline中事件、指标测查询。
 * @author hongsheng
 * @create 2017-09-08-下午2:07
 * @since JDK 1.8
 */
@Service("pipelineConfigService")
public class PipelineConfigService {

    private static final Logger logger = LoggerFactory.getLogger(PipelineConfigService.class);

    @Autowired
    private BehaviorDefinitionService behaviorDefinitionService;
    @Autowired
    private CampaignTargetConfigService campaignTargetConfigService;
    @Autowired
    private CampaignTargetDefinitionService campaignTargetDefinitionService;
    @Autowired
    private PipelineDefinitionService pipelineDefinitionService;
    @Autowired
    private InputDataSchemaService inputDataSchemaService;
    @Autowired
    private InputDataOptionService inputDataOptionService;
    @Autowired
    private FunnelIndexDefinitionService funnelIndexDefinitionService;
    @Autowired
    private AttachmentService attachmentService;
    @Autowired
    private CrowdService crowdService;

    /**
     * 检索Pipeline指标
     *   指标包含：营销活动目标
     * @param campaignId 活动ID--暂时未使用
     * @param tenantId 租户ID
     * @return 如果没有查检索到数据，返回空集
     * @throws Exception
     */
    public List<PipelineConfigDTO> findPipelineIndex(Integer campaignId, String tenantId) throws Exception {
        List<PipelineConfigDTO> result = new ArrayList<>();

        List<CampaignTargetDefinition> campaignTargetDefinitions = campaignTargetDefinitionService.filterBySpecifyType(campaignTargetDefinitionService
            .getCurrentTenantTotalDefinition(tenantId), PipelineScopeConstants.PIPELINE_SCOPE_TRIGGER_INDEX);
        campaignTargetConvertPipelineConfigDTO(result, campaignTargetDefinitions);

        return result;
    }

    /**
     * 检索Pipeline事件
     *   事件包含：漏斗事件和标签行为(Behavior)
     * @param tenantId 租户
     * @param scope @see Constant.PipelineScope
     * @return 如果没有查检索到数据，返回空集
     * @throws Exception
     */
    public List<PipelineConfigDTO> findPipelineEvent(String tenantId, Integer scope) throws Exception {
        List<PipelineConfigDTO> result = new ArrayList<>();

        List<BehaviorDefinition> behaviorDefinitions = behaviorDefinitionService.filterBySpecifyType(getPipelineBehaviorConfig(tenantId), scope);
        behaviorConvertPipelineConfigDTO(result, behaviorDefinitions);

        List<FunnelIndexDefinition> funnelIndexDefinitions = funnelIndexDefinitionService.getOldDefinition(tenantId);
        for (FunnelIndexDefinition funnelIndexDefinition : funnelIndexDefinitions) {
            PipelineConfigDTO pipelineConfigDTO = new PipelineConfigDTO();
            pipelineConfigDTO.setCode(funnelIndexDefinition.getEventId());
            pipelineConfigDTO.setName(funnelIndexDefinition.getName());
            pipelineConfigDTO.setValue(String.valueOf(funnelIndexDefinition.getId()));
            pipelineConfigDTO.setType(PipelineConfigDTO.PipelineConfigType.CAMPAIGN_FUNNEL.getName());
            result.add(pipelineConfigDTO);
        }

        return result;
    }

    /**
     * 检索Pipeline中分流组件的维度的选项数据
     * @param dimensionId 维度的ID
     * @return 如果没有查检索到数据，返回空集
     * @throws Exception
     */
    public List<PipelineConfigDTO> findPipelineSplitNodeDimensionOption(Integer dimensionId) throws Exception {
        List<PipelineConfigDTO> result = new ArrayList<>();

        List<InputDataOption> inputDataOptions = inputDataOptionService.findBySchemaId(dimensionId);
        for (InputDataOption inputDataOption : inputDataOptions) {
            PipelineConfigDTO pipelineConfigDTO = new PipelineConfigDTO();
            pipelineConfigDTO.setCode(inputDataOption.getKey());
            pipelineConfigDTO.setName(inputDataOption.getValue());
            pipelineConfigDTO.setType(PipelineConfigDTO.PipelineConfigType.CAMPAIGN_DIMENSION.getName());
            result.add(pipelineConfigDTO);
        }

        return result;
    }

    /**
     * 检索Pipeline中分流组件的维度数据
     *   维度数据由租户自定定义，从元数据管理(@see InputDataSchema)中获取
     * @param tenantId 租户
     * @return 如果没有查检索到数据，返回空集
     * @throws Exception
     */
    public List<PipelineConfigDTO> findPipelineSplitNodeDimension(String tenantId) throws Exception {
        List<PipelineConfigDTO> result = new ArrayList<>();
        /**
         * TODO:
         *  1.暂时只根据tenant检索数据，具体可能会需要排除子Schema等；
         *  2.暂时未返回维度的类型，如枚举、map等，此处应该不需要
         */
        List<InputDataSchema> inputDataSchemas = inputDataSchemaService.findByTenantId(tenantId);
        for (InputDataSchema inputDataSchema : inputDataSchemas) {
            PipelineConfigDTO pipelineConfigDTO = new PipelineConfigDTO();
            pipelineConfigDTO.setCode(String.valueOf(inputDataSchema.getCode()));
            pipelineConfigDTO.setName(inputDataSchema.getName());
            pipelineConfigDTO.setValue(String.valueOf(inputDataSchema.getId()));
            pipelineConfigDTO.setType(PipelineConfigDTO.PipelineConfigType.CAMPAIGN_DIMENSION.getName());
            result.add(pipelineConfigDTO);
        }

        return result;
    }

    /**
     * 检索Pipeline全局禁止规则
     *    全局禁止规则包含：标签行为
     * @param tenantId 租户
     * @param scope @see Constant.PipelineScope
     * @return 如果没有查检索到数据，返回空集
     * @throws Exception
     */
    public List<PipelineConfigDTO> findPipelineForbiddenRule(String tenantId, Integer scope) throws Exception {
        List<PipelineConfigDTO> result = new ArrayList<>();

        List<BehaviorDefinition> behaviorDefinitions = behaviorDefinitionService.filterBySpecifyType(getPipelineBehaviorConfig(tenantId), scope);
        behaviorConvertPipelineConfigDTO(result, behaviorDefinitions);

        return result;
    }

    /**
     * 将BehaviorDefinition转换为PipelineConfigDTO
     * @param result 结果
     * @param behaviorDefinitions 待转换数据
     * @throws Exception
     */
    private void behaviorConvertPipelineConfigDTO(List<PipelineConfigDTO> result, List<BehaviorDefinition> behaviorDefinitions) throws Exception {
        for (BehaviorDefinition behaviorDefinition : behaviorDefinitions) {
            PipelineConfigDTO pipelineConfigDTO = new PipelineConfigDTO();
            pipelineConfigDTO.setCode(behaviorDefinition.getCode());
            pipelineConfigDTO.setName(behaviorDefinition.getName());
            pipelineConfigDTO.setValue(String.valueOf(behaviorDefinition.getId()));
            pipelineConfigDTO.setType(PipelineConfigDTO.PipelineConfigType.CAMPAIGN_BEHAVIOR.getName());
            result.add(pipelineConfigDTO);
        }
    }

    /**
     * 检索Pipeline提前终止规则
     *    提前终止规则包含：当前活动的目标和活动流程权益
     * @param pipelineDefinitionId 活动流程ID
     * @param campaignId 活动ID
     * @param tenantId 租户
     * @return 如果没有查检索到数据，返回空集
     * @throws Exception
     */
    public List<PipelineConfigDTO> findPipelineTerminationRule(Integer pipelineDefinitionId, Integer campaignId, String tenantId) throws Exception {
        List<PipelineConfigDTO> result = new ArrayList<>();
        setIndexByPipelineEquity(pipelineDefinitionId, tenantId, result);
        setIndexByCampaignTarget(tenantId, result);
        return result;
    }

    /**
     * 将活动的目标数据作为一个指标
     *
     * @param tenantId 租户
     * @param result 结果集
     * @throws Exception
     */
    private void setIndexByCampaignTarget(String tenantId, List<PipelineConfigDTO> result) throws Exception {
        List<CampaignTargetDefinition> campaignTargetDefinitions = campaignTargetDefinitionService.filterBySpecifyType(campaignTargetDefinitionService
            .getCurrentTenantTotalDefinition(tenantId), PipelineScopeConstants.PIPELINE_SCOPE_RULE);
        campaignTargetConvertPipelineConfigDTO(result, campaignTargetDefinitions);
    }

    /**
     * 将流程的权益数据作为一种指标
     *
     * @param pipelineDefinitionId 活动流程ID
     * @param tenantId 活动ID
     * @param result 结果集
     * @throws Exception
     */
    private void setIndexByPipelineEquity(Integer pipelineDefinitionId, String tenantId, List<PipelineConfigDTO> result) throws Exception {
        List<PipelineEquityConfigDefinition> pipelineEquityConfigDefinitions = pipelineDefinitionService.findCampaignGlobalEquity(pipelineDefinitionId, tenantId);
        pipelineEquityConvertPipelineConfigDTO(result, pipelineEquityConfigDefinitions);
    }

    /**
     * 将PipelineEquityConfigDefinition转换为PipelineConfigDTO
     * @param result 结果
     * @param pipelineEquityConfigDefinitions 待转换数据
     * @throws Exception
     */
    private void pipelineEquityConvertPipelineConfigDTO(List<PipelineConfigDTO> result, List<PipelineEquityConfigDefinition> pipelineEquityConfigDefinitions)
        throws Exception {
        for (PipelineEquityConfigDefinition pipelineEquityConfigDefinition : pipelineEquityConfigDefinitions) {
            if (pipelineEquityConfigDefinition.getCount() == null || pipelineEquityConfigDefinition.getCount() == 0) {
                continue;
            }
            PipelineConfigDTO pipelineConfigDTO = new PipelineConfigDTO();
            pipelineConfigDTO.setCode(pipelineEquityConfigDefinition.getCode());
            pipelineConfigDTO.setName(pipelineEquityConfigDefinition.getName());
            pipelineConfigDTO.setValue(String.valueOf(pipelineEquityConfigDefinition.getCount()));
            pipelineConfigDTO.setType(PipelineConfigDTO.PipelineConfigType.CAMPAIGN_EQUITY.getName());
            result.add(pipelineConfigDTO);
        }
    }

    /**
     * 将CampaignTargetDefinition转换为PipelineConfigDTO
     * @param result 结果
     * @param campaignTargetDefinitions 待转换数据
     * @throws Exception
     */
    private void campaignTargetConvertPipelineConfigDTO(List<PipelineConfigDTO> result, List<CampaignTargetDefinition> campaignTargetDefinitions) throws Exception {
        for (CampaignTargetDefinition definition : campaignTargetDefinitions) {
            PipelineConfigDTO pipelineConfigDTO = new PipelineConfigDTO();
            pipelineConfigDTO.setCode(definition.getCode());
            pipelineConfigDTO.setName(definition.getName());
            pipelineConfigDTO.setValue(String.valueOf(definition.getId()));
            pipelineConfigDTO.setType(PipelineConfigDTO.PipelineConfigType.RULE_INDEX.getName());
            result.add(pipelineConfigDTO);
        }
    }

    /**
     * 检查当前租户拥有的事件
     * @param tenantId 租户
     * @return
     */
    public List<BehaviorDefinition> getPipelineBehaviorConfig(String tenantId) throws Exception {
        BehaviorDefinitionPage page = new BehaviorDefinitionPage();
        page.setTenantId(tenantId);
        page.setPageSize(Integer.MAX_VALUE);
        page.setStatus("0");
        List<BehaviorDefinition> result = behaviorDefinitionService.queryByList(page);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    /**
     * 检查当前租户指定活动拥有的指标定义
     * @param campaignId
     * @param tenantId
     * @return
     * @throws Exception
     */
    @Deprecated
    public List<CampaignTargetDefinition> getPipelineIndexConfig(Integer campaignId, String tenantId) throws Exception {
        List<CampaignTargetConfig> configList = getCampaignTargetConfigs(campaignId, tenantId);
        if (configList == null || configList.isEmpty()) {
            return Collections.EMPTY_LIST;
        }
        List<CampaignTargetDefinition> result = getCampaignTargetDefinition(configList);
        return result == null ? Collections.EMPTY_LIST : result;
    }

    private List<CampaignTargetDefinition> getCampaignTargetDefinition(List<CampaignTargetConfig> configList) throws Exception {
        List<Integer> defIds = new ArrayList<>();
        for (CampaignTargetConfig config : configList) {
            defIds.add(config.getTargetDefinitionId());
        }
        if (defIds.isEmpty()) {
            return null;
        }
        return retrieveDef(defIds);
    }

    private List<CampaignTargetDefinition> retrieveDef(List<Integer> defIds) throws Exception {
        return campaignTargetDefinitionService.getByIds(defIds);
    }

    private List<CampaignTargetConfig> getCampaignTargetConfigs(Integer campaignId, String tenantId) throws Exception {
        CampaignTargetConfigPage configPage = new CampaignTargetConfigPage();
        configPage.setCampaignId(String.valueOf(campaignId));
        configPage.setTenantId(tenantId);
        return campaignTargetConfigService.queryByList(configPage);
    }

    /**
     * 检索触发器同时满足指标
     *     包含：当前活动的目标和活动流程权益
     *
     * @param pipelineDefinitionId 活动流程ID
     * @param campaignId 活动ID
     * @param tenantId 租户
     * @return 如果没有查检索到数据，返回空集
     * @throws Exception
     */
    public List<PipelineConfigDTO> findTriggerNodeIndex(Integer pipelineDefinitionId, Integer campaignId, String tenantId) throws Exception {
        return findPipelineTerminationRule(pipelineDefinitionId, campaignId, tenantId);
    }


    /**
     * 检索短信中的自定义标签
     *    标签包括权益和人群上传时的标签数据，此处只计算出人群上传时的标签数据。
     * @param pipelineDefinitionId 流程ID值
     * @return 若未获取到则返回空集合
     * @throws Exception
     */
    public Set<String> findPipelineShortMessageLabel(Integer pipelineDefinitionId) throws Exception {
        PipelineDefinition pipelineDefinition = pipelineDefinitionService.selectByPrimaryKey(pipelineDefinitionId);
        if (pipelineDefinition == null) {
            return Collections.EMPTY_SET;
        }
        PipelineDiagram pipelineDiagram = JsonUtil.toObject(pipelineDefinition.getDiagram(), PipelineDiagram.class);
        List<AbstractNodeDefinition> entranceNodes = pipelineDiagram.findAllEntranceNode();
        if (entranceNodes.isEmpty()) {
            return Collections.EMPTY_SET;
        }
        Set<String> result = new HashSet<>();
        for (AbstractNodeDefinition node : entranceNodes) {
            if (node instanceof EntranceNodeDefinition) {
                EntranceNodeDefinition e = (EntranceNodeDefinition)node;
                if(null == e.getCrowdId()){
                    continue;
                }else{
                    List<String> jsonQuote = crowdService.getJsonQuote(e.getCrowdId());
                    result.addAll(jsonQuote);
                }

            }
        }
        return result;
    }

    /**
     * 检索Pipeline有效的权益配置，即权益数不为零
     * @param pipelineDefinitionId 活动流程ID
     * @param tenantId 租户
     * @return
     * @throws Exception
     */
    public List<PipelineConfigDTO> findRemainEquity(Integer pipelineDefinitionId, String tenantId) throws Exception {
        List<PipelineConfigDTO> result = new ArrayList<>();
        setIndexByPipelineEquity(pipelineDefinitionId, tenantId, result);
        return result;
    }
}
