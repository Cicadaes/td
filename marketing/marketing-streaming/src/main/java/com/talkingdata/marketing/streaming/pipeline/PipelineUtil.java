package com.talkingdata.marketing.streaming.pipeline;

import com.talkingdata.marketing.streaming.cache.EhcacheService;
import com.talkingdata.marketing.streaming.model.*;
import com.talkingdata.marketing.streaming.util.DateUtil;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Pipeline业务的工具类，定义一些Pipeline业务的工具方法
 *
 * @author hongsheng
 * @create 2017-09-27-上午11:06
 * @since JDK 1.8
 */
@Component
public class PipelineUtil {

    private static final Logger logger = LoggerFactory.getLogger(PipelineUtil.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private EhcacheService ehcacheService;

    /**
     * 检索pipelineDefinition数据使用主键ID
     *
     * @param pipelineDefinitionId 主键ID
     * @return PipelineDefinition
     */
    public PipelineDefinition findPipelineDefinition(Integer pipelineDefinitionId) {
        String sql = "select * from TD_MKT_PIPELINE_DEFINITION where id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{pipelineDefinitionId}, new BeanPropertyRowMapper<>(PipelineDefinition.class));
    }

    /**
     * 获取营销目标
     * 指标包含：营销活动目标
     *
     * @param campaignId 活动ID
     * @return 营销目标配置
     */
    public List<CampaignTargetConfig> findCampaignTargetConfig(Integer campaignId) {
        String sql = "select * from TD_MKT_CAMPAIGN_TARGET_CONFIG where campaign_id = ?";
        return jdbcTemplate.query(sql, new Object[]{campaignId}, new BeanPropertyRowMapper<>(CampaignTargetConfig.class));
    }

    /**
     * 获取营销指标，根据活动id和营销目标定义code
     *
     * @param campaignId           活动ID
     * @param targetDefinitionCode 营销目标定义code
     * @return 营销目标配置
     */
    public CampaignTargetConfig findCampaignTargetConfig(Integer campaignId, String targetDefinitionCode) {
        String sql = "select * from TD_MKT_CAMPAIGN_TARGET_CONFIG where campaign_id = ? and target_definition_code = ?";
        List<CampaignTargetConfig> configs = jdbcTemplate.query(sql, new Object[]{campaignId, targetDefinitionCode}, new BeanPropertyRowMapper<>(CampaignTargetConfig.class));
        if (configs != null && !configs.isEmpty()) {
            return configs.get(0);
        }
        return null;
    }

    /**
     * 获取权益配置
     *
     * @param pipelineDefinitionId Pipeline ID
     * @param tenantId             租户ID
     * @return 权益配置
     */
    public List<PipelineEquityConfigDefinition> findEquityConfigDef(Integer pipelineDefinitionId, String tenantId) {
        String sql = "select * from TD_MKT_PIPELINE_EQUITY_CONFIG_DEFINITION where pipeline_definition_id = ? and tenant_id = ?";
        return jdbcTemplate.query(sql, new Object[]{pipelineDefinitionId, tenantId}, new BeanPropertyRowMapper<>(PipelineEquityConfigDefinition.class));
    }

    /**
     * 更新权益记录为已发放状态
     *
     * @param campaignId           活动ID
     * @param pipelineDefinitionId Pipeline ID
     * @param equityCode           权益码
     * @param equityValue          权益值
     * @param status               状态
     */
    public void updateEquityRecordStatus(int campaignId, int pipelineDefinitionId, String equityCode, String equityValue, int status) {
        String sql = "UPDATE TD_MKT_EQUITY_RECORD SET status = ? WHERE campaign_id = ? AND pipeline_definition_id = ? AND equity_code = ? AND equity_value = ?";
        jdbcTemplate.update(sql, status, campaignId, pipelineDefinitionId, equityCode, equityValue);
    }

    /**
     * 获取权益配置
     *
     * @param pipelineDefinitionId 流程定义ID
     * @param tenantId             租户
     * @param code                 权益code
     * @return 如果没查到，则返回NULL
     */
    public PipelineEquityConfigDefinition findEquityConfigDef(Integer pipelineDefinitionId, String tenantId, String code) {
        String sql = "select * from TD_MKT_PIPELINE_EQUITY_CONFIG_DEFINITION where pipeline_definition_id = ? and tenant_id = ? and code = ?";
        List<PipelineEquityConfigDefinition> definitions = jdbcTemplate.query(sql, new Object[]{pipelineDefinitionId, tenantId, code},
                new BeanPropertyRowMapper<>(PipelineEquityConfigDefinition.class));
        if (definitions != null && !definitions.isEmpty()) {
            return definitions.get(0);
        }
        return null;
    }

    /**
     * 全局提前终止规则
     *
     * @param campaignId           活动ID
     * @param pipelineDefinitionId 流程定义ID
     * @param tenantId             租户ID
     * @return 提前终止规则
     */
    public List<PipelineConfigDTO> pipelineTerminationRule(Integer campaignId, Integer pipelineDefinitionId, String tenantId) {
        List<CampaignTargetConfig> targetConfigs = findCampaignTargetConfig(campaignId);
        List<PipelineEquityConfigDefinition> equityConfigDef = findEquityConfigDef(pipelineDefinitionId, tenantId);
        List<PipelineConfigDTO> result = convertTargetConfig2PipelineConfigDTO(targetConfigs);
        result.addAll(convertEquityConfig2PipelineConfigDTO(equityConfigDef));
        return result;
    }

    /**
     * 全局禁止规则包含：标签行为
     *
     * @param tenantId 租户ID
     * @return 全局禁止规则
     */
    public List<BehaviorDefinition> findPipelineForbiddenRule(String tenantId) {
        String sql = "select * from TD_MKT_BEHAVIOR_DEFINITION where tenant_id = ?";
        return jdbcTemplate.query(sql, new Object[]{tenantId}, new BeanPropertyRowMapper<>(BehaviorDefinition.class));
    }

    /**
     * 获取漏斗事件
     *
     * @param tenantId 租户ID
     * @return 漏斗事件
     */
    public List<FunnelIndexDefinition> findFunnelIndexDefinition(String tenantId) {
        String sql = "select * from TD_MKT_FUNNEL_INDEX_DEFINITION where tenant_id = ? and event_id is not null";
        return jdbcTemplate.query(sql, new Object[]{tenantId}, new BeanPropertyRowMapper<>(FunnelIndexDefinition.class));
    }

    /**
     * 获取事件
     * 事件包含：漏斗事件和标签行为(Behavior)
     *
     * @param tenantId 租户ID
     * @return 漏斗事件和标签行为
     * @throws Exception Exception
     */
    public List<PipelineConfigDTO> findPipelineEvent(String tenantId) throws Exception {
        List<FunnelIndexDefinition> funnelIndexDefinitions = findFunnelIndexDefinition(tenantId);
        List<BehaviorDefinition> behaviorDefinitions = findPipelineForbiddenRule(tenantId);
        List<PipelineConfigDTO> result = convertFunneIndex2PipelineConfigDTO(funnelIndexDefinitions);
        result.addAll(convertBehaviorDef2PipelineConfigDTO(behaviorDefinitions));
        return result;
    }

    private List<PipelineConfigDTO> convertBehaviorDef2PipelineConfigDTO(List<BehaviorDefinition> behaviorDefinitions) {
        List<PipelineConfigDTO> dtos = new ArrayList<>();
        for (BehaviorDefinition behaviorDefinition : behaviorDefinitions) {
            PipelineConfigDTO pipelineConfigDTO = new PipelineConfigDTO();
            pipelineConfigDTO.setCode(behaviorDefinition.getCode());
            pipelineConfigDTO.setName(behaviorDefinition.getName());
            pipelineConfigDTO.setType(PipelineConfigDTO.PipelineConfigType.CAMPAIGN_BEHAVIOR.getName());
            dtos.add(pipelineConfigDTO);
        }
        return dtos;
    }

    private List<PipelineConfigDTO> convertFunneIndex2PipelineConfigDTO(List<FunnelIndexDefinition> funnelIndexDefinitions) {
        List<PipelineConfigDTO> dtos = new ArrayList<>();
        for (FunnelIndexDefinition funnelIndexDefinition : funnelIndexDefinitions) {
            PipelineConfigDTO pipelineConfigDTO = new PipelineConfigDTO();
            pipelineConfigDTO.setCode(funnelIndexDefinition.getEventId());
            pipelineConfigDTO.setName(funnelIndexDefinition.getName());
            pipelineConfigDTO.setType(PipelineConfigDTO.PipelineConfigType.CAMPAIGN_FUNNEL.getName());
            dtos.add(pipelineConfigDTO);
        }
        return dtos;
    }

    private List<PipelineConfigDTO> convertTargetConfig2PipelineConfigDTO(List<CampaignTargetConfig> targetConfigs) {
        List<PipelineConfigDTO> dtos = new ArrayList<>();
        for (CampaignTargetConfig campaignTargetConfig : targetConfigs) {
            PipelineConfigDTO pipelineConfigDTO = new PipelineConfigDTO();
            pipelineConfigDTO.setCode(campaignTargetConfig.getTargetDefinitionCode());
            pipelineConfigDTO.setName(campaignTargetConfig.getName());
            pipelineConfigDTO.setValue(String.valueOf(campaignTargetConfig.getValue()));
            pipelineConfigDTO.setType(PipelineConfigDTO.PipelineConfigType.CAMPAIGN_TARGET.getName());
            dtos.add(pipelineConfigDTO);
        }
        return dtos;
    }

    private List<PipelineConfigDTO> convertEquityConfig2PipelineConfigDTO(List<PipelineEquityConfigDefinition> equityConfigDef) {
        List<PipelineConfigDTO> dtos = new ArrayList<>();
        for (PipelineEquityConfigDefinition pipelineEquityConfigDefinition : equityConfigDef) {
            PipelineConfigDTO pipelineConfigDTO = new PipelineConfigDTO();
            pipelineConfigDTO.setCode(pipelineEquityConfigDefinition.getCode());
            pipelineConfigDTO.setName(pipelineEquityConfigDefinition.getName());
            pipelineConfigDTO.setValue(String.valueOf(pipelineEquityConfigDefinition.getCount()));
            pipelineConfigDTO.setType(PipelineConfigDTO.PipelineConfigType.CAMPAIGN_EQUITY.getName());
            dtos.add(pipelineConfigDTO);
        }
        return dtos;
    }

    /**
     * 是否在限制的时间内
     * 1.根据campaignId、pipelineDefinitionId和userId获取当前user上次进入时间
     * 2.判断当前时间是否在限制时间内
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 活动流程ID
     * @param version              版本
     * @param accessNode           通过点，指每个算子或全局设置等等
     * @param userId               用户ID
     * @param days                 限制天数
     * @return 返回true表示在, false表示不在
     */
    public boolean isAtRestrictedDay(Integer campaignId, Integer pipelineDefinitionId, String version, String accessNode, String userId, Integer days) {
        String result = ehcacheService.findUserAccessTrace(campaignId, pipelineDefinitionId, version, accessNode, userId);
        if (StringUtils.isBlank(result)) {
            return false;
        }

        String[] values = result.split("_");
        LocalDateTime userLastEnterTime = DateUtil.parseDateTime(values[0], DateUtil.dtf_y4mmdd_hhmmss);
        LocalDateTime limitedTime = DateUtil.plus(userLastEnterTime, ChronoUnit.DAYS, days);
        return !LocalDateTime.now().isAfter(limitedTime);
    }

    /**
     * 是否在超过限制的次数
     * 1.根据campaignId、pipelineDefinitionId和userId获取当前user已经登陆次数
     * 2.判断当前user登陆次数是否在限制次数内
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 活动流程ID
     * @param version              版本
     * @param accessNode           通过点，指每个算子或全局设置等等
     * @param userId               用户ID
     * @param times                限制次数
     * @return 返回true表示超过, false表示不在
     */
    public boolean isOverRestrictedTimes(Integer campaignId, Integer pipelineDefinitionId, String version, String accessNode, String userId, Integer times) {
        String result = ehcacheService.findUserAccessTrace(campaignId, pipelineDefinitionId, version, accessNode, userId);
        if (StringUtils.isBlank(result)) {
            return false;
        }

        String[] values = result.split("_");
        return Integer.parseInt(values[1]) >= times;
    }

    /**
     * 缓存用户通过记录
     * 优先根据上次记录数据更新，然直接创建新数据保存。
     * 可以选择缓存通过时间和通过次数，或全部缓存。
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 活动流程ID
     * @param version              版本
     * @param accessNode           通过点，指每个算子或全局设置等等
     * @param userId               用户ID
     * @param accessTime           是否缓存时间，true缓存，false不缓存
     * @param accessTimes          是否缓存次数，true缓存，false不缓存
     */
    public void saveUserAccessTrace(Integer campaignId, Integer pipelineDefinitionId, String version, String accessNode, String userId, boolean accessTime, boolean accessTimes) {
        String lastTrace = ehcacheService.findUserAccessTrace(campaignId, pipelineDefinitionId, version, accessNode, userId);
        String time = DateUtil.format(LocalDateTime.now(), DateUtil.dtf_y4mmdd_hhmmss);
        Integer times = 1;
        if (!StringUtils.isBlank(lastTrace)) {
            String[] values = lastTrace.split("_");
            if (!accessTime) {
                time = values[0];
            }
            if (accessTimes) {
                times = Integer.valueOf(values[1]) + 1;
            }
        }
        ehcacheService.saveUserAccessTrace(campaignId, pipelineDefinitionId, version, accessNode, userId, time, times);
    }
}
