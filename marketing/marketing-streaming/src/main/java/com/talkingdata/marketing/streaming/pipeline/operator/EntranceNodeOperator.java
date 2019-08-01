package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.node.EntranceNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.executor.PipelineExecutor;
import com.tendcloud.tenddata.entity.EventPackage;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Objects;

/**
 * 入口算子
 *
 * @author hongsheng
 * @create 2017-09-27-下午5:56
 * @since JDK 1.8
 */
@Component
public class EntranceNodeOperator extends AbstractOperator {
    private static final Logger logger = LoggerFactory.getLogger(EntranceNodeOperator.class);
    /**
     * 入口算子执行：对进入的规则和禁止规则进行校验，校验通过则可以返回true，否则返回false.
     *
     * @param pipelineDefinition pipeline数据
     * @param nodeDefinition 当前执行的具体算子
     * @param eventPackage 用户的属性、行为等数据
     * @return true表示当前用户可以进入，false则不可以
     * @throws CrowdNotMatchException 如果eventpackage人群id与算子人群id不符，抛出此异常
     */
    @Override
    public Boolean executor(PipelineDefinition pipelineDefinition, AbstractNodeDefinition nodeDefinition, EventPackage eventPackage) throws CrowdNotMatchException {
        EntranceNodeDefinition entranceNodeDefinition = (EntranceNodeDefinition)nodeDefinition;
        validateCrowdIsMatch(pipelineDefinition, eventPackage, nodeDefinition);

        if (!entranceNodeDefinition.getCrowdId().equals(eventPackage.additiveProfile.crowdId)) {return false;}
        // 有规则限制
        if (!entranceNodeDefinition.getUnlimited()) {
            // 天数限制
            if (entranceNodeDefinition.getLessThanDays() != null) {
                if (validateDayIsAtRestrictedDay(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), pipelineDefinition.getVersion(), entranceNodeDefinition.getId(),
                    eventPackage.mDeviceId, entranceNodeDefinition.getLessThanDays())) {
                    return false;
                }
            }
            // 次数限制
            if (entranceNodeDefinition.getLessThanTimes() != null) {
                if (validateTimesIsAtRestrictedTimes(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), pipelineDefinition.getVersion(), entranceNodeDefinition.getId(),
                    eventPackage.mDeviceId, entranceNodeDefinition.getLessThanTimes())) {
                    return false;
                }
            }
            // 禁止规则限制
            if (StringUtils.isNotBlank(entranceNodeDefinition.getForbiddenExpression())) {
                // TODO 禁止规则校验暂不开发
            }
        }
        //缓存访问记录
        cachedAccessTrace(pipelineDefinition, eventPackage, entranceNodeDefinition);
        return true;
    }

    @Override
    public boolean validateCrowdIsMatch(PipelineDefinition pipelineDef, EventPackage eventPackage,
                                        AbstractNodeDefinition nodeDefinition) throws CrowdNotMatchException {
        EntranceNodeDefinition entranceNodeDefinition = (EntranceNodeDefinition) nodeDefinition;
        if (PipelineExecutor.PIPELINE_DEFINITION_STATUS_APPLY_SUCC.equals(pipelineDef.getStatus()) &&
                !Objects.equals(eventPackage.additiveProfile.crowdId, entranceNodeDefinition.getCrowdId())) {
            logger.info("mDeviceId: {}, eventpackage crowd id: {}, entrance node definition crowd id: {}, validate crowd id not match",
                    eventPackage.mDeviceId, eventPackage.additiveProfile.crowdId, entranceNodeDefinition.getCrowdId());
            throw new CrowdNotMatchException("validate crowd id not match");
        }
        return true;
    }
}
