package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.model.MessageData;
import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.pipeline.definition.node.ShortMessageNodeDefinition;
import com.tendcloud.tenddata.entity.EventPackage;
import org.springframework.stereotype.Component;

/**
 * 短信通知算子
 *
 * @author hongsheng
 * @create 2017-09-27-下午6:06
 * @since JDK 1.8
 */
@Component
public class ShortMessageNodeOperator extends AbstractOperator {

    /**
     * 短信通知算子执行：依据接受条件计算当前用户是否复合通知条件，如果符合则返回用户的MobileId,否则返回null.
     *
     * @param pipelineDefinition pipeline数据
     * @param nodeDefinition 当前执行的具体算子
     * @param eventPackage 用户的属性、行为等数据
     * @return
     * @throws NodeOperatorException
     * @throws CrowdNotMatchException 如果eventpackage人群id与算子人群id不符，抛出此异常
     */
    @Override
    public MessageData executor(PipelineDefinition pipelineDefinition, AbstractNodeDefinition nodeDefinition,
                                EventPackage eventPackage) throws NodeOperatorException, CrowdNotMatchException {
        validateCrowdIsMatch(pipelineDefinition, eventPackage, nodeDefinition);
        ShortMessageNodeDefinition shortMessageNodeDefinition = (ShortMessageNodeDefinition)nodeDefinition;
        // 次数限制
        if (shortMessageNodeDefinition.getMaxDeliveryCount() != null) {
            if (validateTimesIsAtRestrictedTimes(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), pipelineDefinition.getVersion(), shortMessageNodeDefinition.getId(),
                eventPackage.mDeviceId, shortMessageNodeDefinition.getMaxDeliveryCount())) {
                return null;
            }
        }
        // 天数限制
        if (shortMessageNodeDefinition.getFrequency() != null) {
            if (validateDayIsAtRestrictedDay(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), pipelineDefinition.getVersion(), shortMessageNodeDefinition.getId(),
                eventPackage.mDeviceId, shortMessageNodeDefinition.getFrequency())) {
                return null;
            }
        }
        //缓存访问记录
        cachedAccessTrace(pipelineDefinition, eventPackage, shortMessageNodeDefinition);
        MessageData messageData = new MessageData();
        messageData.setId(eventPackage.userProfile.mobileId);
        messageData.setSentType(NOTICE_TYPE_SMS);
        messageData.setTime(calcTimeByTriggerType(shortMessageNodeDefinition.getTriggerType(), shortMessageNodeDefinition.getAppointedTime()));
        return messageData;
    }
}
