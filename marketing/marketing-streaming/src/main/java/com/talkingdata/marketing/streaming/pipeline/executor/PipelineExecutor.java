package com.talkingdata.marketing.streaming.pipeline.executor;

import com.talkingdata.marketing.ExpressionExecute;
import com.talkingdata.marketing.streaming.MktAccumulatorV2;
import com.talkingdata.marketing.streaming.cache.EhcacheService;
import com.talkingdata.marketing.streaming.dao.StreamingDao;
import com.talkingdata.marketing.streaming.model.*;
import com.talkingdata.marketing.streaming.pipeline.PipelineUtil;
import com.talkingdata.marketing.streaming.pipeline.definition.PipelineDiagram;
import com.talkingdata.marketing.streaming.pipeline.definition.rule.PipelineEnterRuleDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.rule.PipelineForbiddenRuleDefinition;
import com.talkingdata.marketing.streaming.service.StreamingService;
import com.talkingdata.marketing.streaming.util.*;
import com.tendcloud.tenddata.entity.EventPackage;
import org.apache.commons.lang.StringUtils;
import org.elasticsearch.client.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.AbstractApplicationContext;

import java.io.IOException;
import java.util.*;

import static com.talkingdata.marketing.streaming.model.ExecutorResultDataConstant.*;

/**
 * 执行引擎
 *
 * @author Created by yangtao on 2017/9/19.
 */
public class PipelineExecutor implements IPipelineExecutor {

    private static final Logger logger = LoggerFactory.getLogger(PipelineExecutor.class);
    /**
     * Pipeline instance 状态（未开始）
     */
    private static final Integer PIPELINE_INSTANCE_STATUS_NOT_START = 0;
    /**
     * Pipeline instance 状态（进行中）
     */
    private static final Integer PIPELINE_INSTANCE_STATUS_STARTING = 1;
    /**
     * Pipeline instance 状态（进行中）
     */
    private static final Integer PIPELINE_INSTANCE_STATUS_FINISHED = 3;
    /**
     * 审核通过等待上线
     */
    private static final Integer PIPELINE_DEFINITION_STATUS_WAITING_ONLINE = 5;
    /**
     * Pipeline Definition 状态（已上线）
     */
    public static final Integer PIPELINE_DEFINITION_STATUS_APPLY_SUCC = 6;
    /**
     * Pipeline Definition 状态（流程测试中）
     */
    static final Integer PIPELINE_DEFINITION_STATUS_TESTING = 9;
    /**
     * 活动目标类型
     */
    private static final String RULE_INDEX = "index";
    /**
     * 权益类型
     */
    private static final String CAMPAIGN_EQUITY = "equity";
    private static final String PIPELINE_GLOBAL_NODE = "pipelineGlobalNode";

    private AbstractApplicationContext applicationContext;

    public PipelineExecutor() {
        applicationContext = ApplicationContextManager.getInstance().getApplicationContext();
    }

    public AbstractApplicationContext getApplicationContext() {
        return applicationContext;
    }

    public void setApplicationContext(AbstractApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Override
    public List<ExecutorResultData> executor(EventPackage eventPackage) {
        List<ExecutorResultData> resultDatas;
        try {
            PipelineDefinition pipelineDefinition = getCurrentPipelineDefinition(eventPackage);
            if (!processTimeInterval(eventPackage, pipelineDefinition)) {
                return new ArrayList<>();
            }
            // 根据当前EventPackage执行到的stage，执行相应的stage
            resultDatas = getIPipelineStageExecutor().executor(pipelineDefinition, eventPackage);
        } catch (Exception e) {
            logger.error("executor pipeline has exception: ", e);
            // TODO exception 时候处理
            resultDatas = new ArrayList<>();
            exceptionHandle(eventPackage, resultDatas);
        }
        return resultDatas;
    }

    /**
     * 初始化写入ES的数据，查询的字段的mapping
     * 包含eventpackage和messagedata
     */
    public void initEsMapping() {
        EsUtils esUtils = applicationContext.getBean("esUtils", EsUtils.class);
        PipelineEsHelper esHelper = applicationContext.getBean("pipelineEsHelper", PipelineEsHelper.class);
        RestClient client = esUtils.initRestClient();
        esHelper.initEpMapping(client);
        esHelper.initMessageDataMapping(client);
        esHelper.initEquityDistributionRecord(client);
    }

    public void injectMktAcc2Monitor(MktAccumulatorV2 mktAcc) {
        PipelineMonitorHandle monitorHandle = applicationContext.getBean("pipelineMonitorHandle", PipelineMonitorHandle.class);
        monitorHandle.setMktAcc(mktAcc);
    }

    public void saveMonitor(Map<String, PipelineMonitor> monitorMap) {
        StreamingService service = applicationContext.getBean("streamingService", StreamingService.class);
        service.saveMonitor(monitorMap);
    }

    /**
     * pipeline执行异常时，写到hdfs目录中
     *
     * @param ep          eventpackage
     * @param resultDatas List<ExecutorResultData>
     */
    private void exceptionHandle(EventPackage ep, List<ExecutorResultData> resultDatas) {
        ExecutorResultDataContent<EventPackage> dataContent = new ExecutorResultDataContent<>(DATA_TYPE_EXCEPTION_EP, ep);
        resultDatas.add(new ExecutorResultData(SAVE_TYPE_HDFS, dataContent));
    }

    /**
     * 校验PipelineInstance状态（0,1）和eventPackage的recTime是否在pipelineDefinition的活动开始和结束时间内
     * 并更行PipelineInstance的状态为1，如果活动结束，则更新PipelineInstance的状态为3
     *
     * @param eventPackage       eventPackage
     * @param pipelineDefinition pipelineDefinition
     * @return true可以继续执行，false表示未在活动时间内
     */
    private boolean processTimeInterval(EventPackage eventPackage, PipelineDefinition pipelineDefinition) {
        Integer campaignId = eventPackage.additiveProfile.campaignId;
        Integer pipelineDefinitionId = eventPackage.additiveProfile.pipelineDefinitionId;
        String version = eventPackage.additiveProfile.version;
        if (pipelineDefinition == null) {
            logger.error("campaignId: {}, pipelineDefinitionId: {}, version: {} ,pipelineDefinition not found.",
                    campaignId, pipelineDefinitionId, version);
            return false;
        }
        PipelineInstance pipelineInstance = getEhcacheService().findPipelineInstanceCache(campaignId, pipelineDefinitionId, version);
        if (pipelineInstance == null) {
            logger.error("campaignId: {}, pipelineDefinitionId: {}, version: {} status in (0,1), pipelineInstance not found.",
                    campaignId, pipelineDefinitionId, version);
            return false;
        }
        // 查询PipelineDefinition和PipelineInstance，判断活动是否开始，是否在活动时间范围内
        if (pipelineDefinition.getStartTime().getTime() > eventPackage.rectime ||
                pipelineDefinition.getEndTime().getTime() < eventPackage.rectime) {
            logger.error("pipelineDefinition startTime: {}, pipelineDefinition endTime: {}, recTime: {} , " +
                            "is not in the startTime and endTime interval.",
                    DateUtil.format(pipelineDefinition.getStartTime().getTime(), DateUtil.dtf_y4mmdd_hhmmss),
                    DateUtil.format(pipelineDefinition.getEndTime().getTime(), DateUtil.dtf_y4mmdd_hhmmss),
                    DateUtil.format(eventPackage.rectime, DateUtil.dtf_y4mmdd_hhmmss));
            return false;
        }
        return !updatePipelineStatus(pipelineDefinition, pipelineInstance);
    }

    /**
     * 如果pipelineInstance状态为未开始则更新pipelineInstance的状态为开始
     * 如果PipelineDefinition为等待上线，更新为上线
     * 如果Pipeline结束，则将pipelineInstance状态更新为结束
     *
     * @param pipelineDef      PipelineDefinition
     * @param pipelineInstance PipelineInstance
     * @return Pipeline结束则返回true，否则false
     */
    private boolean updatePipelineStatus(PipelineDefinition pipelineDef, PipelineInstance pipelineInstance) {
        // 如果pipelineInstance状态为未开始则更新pipelineInstance的状态为开始
        if (Objects.equals(pipelineInstance.getStatus(), PIPELINE_INSTANCE_STATUS_NOT_START)) {
            getSteamingDao().updatePipelineInstanceStatusById(pipelineInstance.getId(), PIPELINE_INSTANCE_STATUS_STARTING);
            getEhcacheService().removePipelineInstanceCache(pipelineDef.getCampaignId(), pipelineDef.getId(), pipelineDef.getVersion());
        }
        long currentMillis = System.currentTimeMillis();
        // 如果PipelineDefinition为等待上线，更新为上线
        if (PIPELINE_DEFINITION_STATUS_WAITING_ONLINE.equals(pipelineDef.getStatus()) &&
                currentMillis >= pipelineDef.getStartTime().getTime() &&
                currentMillis <= pipelineDef.getEndTime().getTime()) {
            getSteamingDao().updatePipelineDefStatusById(pipelineDef.getId(), PIPELINE_DEFINITION_STATUS_APPLY_SUCC);
            getEhcacheService().removePipelineDefinitionCache(pipelineDef.getCampaignId(), pipelineDef.getId(), pipelineDef.getVersion());
        }
        // 如果Pipeline结束，则将pipelineInstance状态更新为结束
        if (PIPELINE_DEFINITION_STATUS_APPLY_SUCC.equals(pipelineDef.getStatus()) &&
                currentMillis > pipelineDef.getEndTime().getTime()) {
            getSteamingDao().updatePipelineInstanceStatusById(pipelineInstance.getId(), PIPELINE_INSTANCE_STATUS_FINISHED);
            getEhcacheService().removePipelineInstanceCache(pipelineDef.getCampaignId(), pipelineDef.getId(), pipelineDef.getVersion());
            logger.info("campaignId: {}, pipelineDefinitionId: {}, version: {}, pipelineInstance finished",
                    pipelineDef.getCampaignId(), pipelineDef.getId(), pipelineDef.getVersion());
            return true;
        }
        return false;
    }

    /**
     * 执行营销流程全局校验，通过校验则可继续走流程
     *
     * @return boolean true 校验通过 false 校验不通过
     */
    @Override
    public boolean validator(EventPackage data) {
        if (!baseValidateEp(data)) {
            return false;
        }
        PipelineDefinition pipelineDefinition = getCurrentPipelineDefinition(data);
        if (pipelineDefinition == null || StringUtils.isBlank(pipelineDefinition.getDiagram())) {
            logger.error("pipelineDefinition is null or diagram is blank, pipeline stop.");
            return false;
        }
        // Pipeline状态和开始时间校验
        if (validatePipelineDef(pipelineDefinition)) {
            return false;
        }
        PipelineDiagram pipelineDiagram;
        try {
            pipelineDiagram = JsonUtil.toObject(pipelineDefinition.getDiagram(), PipelineDiagram.class);
        } catch (IOException e) {
            logger.error("解析pipelineDiagram失败", e);
            return false;
        }
        if (validateTerminationRule(data, pipelineDiagram)) {
            logger.info("validate termination rule retrun ture, pipeline stop.");
            return false;
        }
        if (validateEnterRule(data, pipelineDiagram)) {
            logger.info("validate enter rule retrun ture, pipeline stop.");
            return false;
        }
        if (validateForbiddenRule(data, pipelineDiagram.getPipelineForbiddenRuleDefinition())) {
            logger.info("validate forbidden rule retrun ture, pipeline stop.");
            return false;
        }
        //缓存访问记录
        getPipelineUtil().saveUserAccessTrace(pipelineDiagram.getCampaignId(), pipelineDiagram.getPipelineId(), pipelineDiagram.getVersion(),
                PIPELINE_GLOBAL_NODE, data.mDeviceId, true, true);
        logger.info("validate pipeline completion, continue with the pipeline");
        return true;
    }

    /**
     * 校验PipelineDefinition状态和时间
     *
     * @param pipelineDefinition PipelineDefinition
     * @return true 未通过，反之
     */
    private boolean validatePipelineDef(PipelineDefinition pipelineDefinition) {
        if (!PIPELINE_DEFINITION_STATUS_WAITING_ONLINE.equals(pipelineDefinition.getStatus()) &&
                !PIPELINE_DEFINITION_STATUS_APPLY_SUCC.equals(pipelineDefinition.getStatus()) &&
                !PIPELINE_DEFINITION_STATUS_TESTING.equals(pipelineDefinition.getStatus())) {
            logger.warn("campaignId: {}, pipelineDefinitionId: {}, version: {}, status: {}, status is not in (5, 6, 9)",
                    pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), pipelineDefinition.getVersion(), pipelineDefinition.getStatus());
            return true;
        }
        long curr = System.currentTimeMillis();
        if (!PIPELINE_DEFINITION_STATUS_WAITING_ONLINE.equals(pipelineDefinition.getStatus()) &&
                curr < pipelineDefinition.getStartTime().getTime()) {
            logger.warn("campaignId: {}, pipelineDefinitionId: {}, version: {}, startTime: {}, 营销流程未到开始时间",
                    pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), pipelineDefinition.getVersion(), pipelineDefinition.getStatus());
            return true;
        }
        if (curr > pipelineDefinition.getEndTime().getTime()) {
            logger.warn("campaignId: {}, pipelineDefinitionId: {}, version: {}, endTime: {}, 营销流程已到结束时间",
                    pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), pipelineDefinition.getVersion(), pipelineDefinition.getStatus());
            return true;
        }
        return false;
    }

    /**
     * 对EventPackage一些必要的数据进行校验
     */
    private boolean baseValidateEp(EventPackage data) {
        return EpValidateUtils.validateMDeviceId(data) || EpValidateUtils.validatePipelineInfo(data) ||
                EpValidateUtils.validateRectime(data);
    }

    /**
     * Pipeline Definition Data
     */
    private PipelineDefinition getCurrentPipelineDefinition(EventPackage data) {
        return getEhcacheService().findPipelineDefinitionCache(data.additiveProfile.campaignId, data.additiveProfile.pipelineDefinitionId, data.additiveProfile.version);
    }

    /**
     * 校验全局禁止规则
     */
    private boolean validateForbiddenRule(EventPackage data, PipelineForbiddenRuleDefinition pipelineForbiddenRuleDefinition) {
        //TODO 全局禁止规则校验暂不开发
        return false;
    }

    /**
     * 校验全局进入规则，校验限制规则是否成立
     *
     * @return 返回Boolean类型, true-限制成立:表示不可以进入,false-限制不成立:表示可以进入。
     */
    private boolean validateEnterRule(EventPackage data, PipelineDiagram pipelineDiagram) {
        PipelineEnterRuleDefinition enterRuleDefinition = pipelineDiagram.getPipelineEnterRuleDefinition();
        if (enterRuleDefinition == null || enterRuleDefinition.getUnlimited()) {
            return false;
        }
        //  天数限制
        if (enterRuleDefinition.getLessThanDays() != null) {
            if (getPipelineUtil().isAtRestrictedDay(pipelineDiagram.getCampaignId(), pipelineDiagram.getPipelineId(), pipelineDiagram.getVersion(),
                    PIPELINE_GLOBAL_NODE, data.mDeviceId, enterRuleDefinition.getLessThanDays())) {
                return true;
            }
        }
        //  次数限制
        if (enterRuleDefinition.getLessThanTimes() != null) {
            if (getPipelineUtil().isOverRestrictedTimes(pipelineDiagram.getCampaignId(), pipelineDiagram.getPipelineId(), pipelineDiagram.getVersion(),
                    PIPELINE_GLOBAL_NODE, data.mDeviceId, enterRuleDefinition.getLessThanTimes())) {
                return true;
            }
        }
        return false;
    }

    /**
     * 校验全局提前终止规则，校验表达式是否成立
     * 表达式：code|type1 : < : 123 : || : code|type1 : < : 3 : || : code|type2 : > : 22
     * 终止规则中的元素包含权益和目标2中类型组成，需要分类出来
     *
     * @return 返回Boolean类型, true-表达式成立:表示流程终止,false-表达式不成立:表示流程未终止。
     */
    private boolean validateTerminationRule(EventPackage data, PipelineDiagram pipelineDiagram) {
        if (pipelineDiagram.getPipelineTerminationRuleDefinition() == null) {
            return false;
        }
        String expression = pipelineDiagram.getPipelineTerminationRuleDefinition().getExpression();
        if (StringUtils.isBlank(expression)) {
            return false;
        }
        //切割成单个表达式集
        String or = "||";
        String and = "&&";
        String[] parts;
        if (expression.contains(or)) {
            parts = expression.split(" : \\|\\| : ");
        } else if (expression.contains(and)) {
            parts = expression.split(" : && : ");
        } else {
            parts = new String[]{expression};
        }
        //获取每个表达式的CODE属性
        String[] codeParams = new String[parts.length];
        int index = 0;
        for (String part : parts) {
            codeParams[index++] = part.split(" : ")[0];
        }
        ////组装表达式与数据
        Map<String, Object> codeData = new HashMap<>(16);
        for (String codeParam : codeParams) {
            String[] cp = codeParam.split("\\|");
            codeData.put(cp[0], getValue(cp, pipelineDiagram));
            expression = expression.replace(codeParam, cp[0]);
        }
        return ExpressionExecute.executeForBooleanResult(expression, codeData);
    }

    /**
     * 获取元素(权益或目标)设置的值
     *
     * @param cp 表达式中元素数据，由code|type组成
     */
    private Long getValue(String[] cp, PipelineDiagram pipelineDiagram) {
        // 规则指标 TODO 需要到用户管家获取
        if (RULE_INDEX.equalsIgnoreCase(cp[1])) {
            CampaignTargetConfig campaignTargetConfig = getPipelineUtil().findCampaignTargetConfig(pipelineDiagram.getCampaignId(), cp[0]);
            return campaignTargetConfig == null ? 0L : campaignTargetConfig.getValue();
        }
        // 权益
        if (CAMPAIGN_EQUITY.equalsIgnoreCase(cp[1])) {
            PipelineEquityConfigDefinition pipelineEquityConfigDefinition = getPipelineUtil().findEquityConfigDef(pipelineDiagram.getPipelineId(),
                    pipelineDiagram.getTenantId(), cp[0]);
            return pipelineEquityConfigDefinition == null ? 0L : pipelineEquityConfigDefinition.getCount();
        }
        return 0L;
    }

    private StreamingDao getSteamingDao() {
        return (StreamingDao) applicationContext.getBean("streamingDao");
    }

    /**
     * Ehcache Service Instance
     */
    private EhcacheService getEhcacheService() {
        return (EhcacheService) applicationContext.getBean("ehcacheService");
    }

    private IPipelineStageExecutor getIPipelineStageExecutor() {
        return (IPipelineStageExecutor) applicationContext.getBean("pipelineStageExecutor");
    }

    private PipelineUtil getPipelineUtil() {
        return (PipelineUtil) applicationContext.getBean("pipelineUtil");
    }
}
