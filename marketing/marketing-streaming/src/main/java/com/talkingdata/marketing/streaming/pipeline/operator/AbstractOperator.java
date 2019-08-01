package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.PipelineUtil;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.pipeline.executor.PipelineExecutor;
import com.talkingdata.marketing.streaming.util.DateUtil;
import com.tendcloud.tenddata.entity.EventPackage;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 算子校验抽象类
 * 封装算子检验中共同的校验方法
 *
 * @author hongsheng
 * @create 2017-10-13-上午10:17
 * @since JDK 1.8
 */
public abstract class AbstractOperator {
    private static final Logger logger = LoggerFactory.getLogger(AbstractOperator.class);

    /**
     * push推送
     */
    static final int NOTICE_TYPE_PUSH = 1;
    /**
     * 短信
     */
    static final int NOTICE_TYPE_SMS = 2;
    /**
     * 广告
     */
    protected static final int NOTICE_TYPE_AD = 3;
    /**
     * 微信
     */
    protected static final int NOTICE_TYPE_WECHAT = 4;
    /**
     * 触发时间类型 立即 1
     */
    public final static int PUT_TRIGGER_TYPE_NOW = 1;
    /**
     * 触发时间类型 定时 2
     */
    public final static int PUT_TRIGGER_TYPE_TIME = 2;

    @Autowired
    private PipelineUtil pipelineUtil;

    /**
     * 算子执行方法
     *
     * @param pipelineDefinition pipeline数据
     * @param nodeDefinition     当前执行的具体算子
     * @param eventPackage       用户的属性、行为等数据
     * @return 根据算子执行返回
     * @throws NodeOperatorException  NodeOperatorException
     * @throws CrowdNotMatchException 如果eventpackage人群id与算子人群id不符，抛出此异常
     */
    public abstract Object executor(PipelineDefinition pipelineDefinition, AbstractNodeDefinition nodeDefinition,
                                    EventPackage eventPackage) throws NodeOperatorException, CrowdNotMatchException;

    /**
     * 算子debug执行的方法
     *
     * @param pipelineDefinition pipeline数据
     * @param nodeDefinition     当前执行的具体算子
     * @param eventPackage       用户的属性、行为等数据
     * @throws NodeOperatorException  NodeOperatorException
     * @throws CrowdNotMatchException 如果eventpackage人群id与算子人群id不符，抛出此异常
     */
    public Object debug(PipelineDefinition pipelineDefinition, AbstractNodeDefinition nodeDefinition,
                        EventPackage eventPackage) throws NodeOperatorException, CrowdNotMatchException {
        return null;
    }

    /**
     * 缓存用户通过记录
     *
     * @param pipelineDefinition pipeline数据
     * @param data               用户的属性、行为等数据
     * @param nodeDefinition     当前执行的具体算子
     */
    public void cachedAccessTrace(PipelineDefinition pipelineDefinition, EventPackage data, AbstractNodeDefinition nodeDefinition) {
        pipelineUtil.saveUserAccessTrace(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), pipelineDefinition.getVersion(), nodeDefinition.getId(),
                data.mDeviceId, true, true);
    }

    /**
     * 校验当前用户是否超过次数限定,true表示超出限制天数内,false表示没有超出
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 活动流程ID
     * @param version              版本
     * @param accessNode           通过点，指每个算子或全局设置等等
     * @param lessThanTimes        距离上次进入的天数
     * @param deviceId             用户ID
     * @return
     */
    protected boolean validateTimesIsAtRestrictedTimes(Integer campaignId, Integer pipelineDefinitionId, String version, String accessNode, String deviceId,
                                                       Integer lessThanTimes) {
        return pipelineUtil.isOverRestrictedTimes(campaignId, pipelineDefinitionId, version, accessNode, deviceId, lessThanTimes);
    }

    /**
     * 校验当前用户是否在天数限定内,true表示在限制天数内，false表示不在
     *
     * @param campaignId           营销活动ID
     * @param pipelineDefinitionId 活动流程ID
     * @param version              版本
     * @param accessNode           通过点，指每个算子或全局设置等等
     * @param lessThanDays         距离上次进入的天数
     * @param deviceId             用户ID
     * @return
     */
    protected boolean validateDayIsAtRestrictedDay(Integer campaignId, Integer pipelineDefinitionId, String version, String accessNode, String deviceId,
                                                   Integer lessThanDays) {
        return pipelineUtil.isAtRestrictedDay(campaignId, pipelineDefinitionId, version, accessNode, deviceId, lessThanDays);
    }

    /**
     * 按触发类型计算通知时间
     * -立即-1、定时-2、循环-3
     *
     * @param triggerType
     * @param appointedTime
     * @return
     */
    protected String calcTimeByTriggerType(Integer triggerType, String appointedTime) {
        if (PUT_TRIGGER_TYPE_NOW == triggerType) {
            return DateUtil.format(System.currentTimeMillis(), DateUtil.dtf_y4mmdd_hhmmss);
        }
        if (PUT_TRIGGER_TYPE_TIME == triggerType) {
            return appointedTime;
        }
        return null;
    }

    /**
     * 校验eventpackage 的人群id和算子的人群id是否一致
     *
     * @param eventPackage   EventPackage
     * @param nodeDefinition AbstractNodeDefinition
     * @throws CrowdNotMatchException CrowdNotMatchException
     */
    public boolean validateCrowdIsMatch(PipelineDefinition pipelineDef, EventPackage eventPackage,
                                        AbstractNodeDefinition nodeDefinition) throws CrowdNotMatchException {
        if (PipelineExecutor.PIPELINE_DEFINITION_STATUS_APPLY_SUCC.equals(pipelineDef.getStatus()) &&
                !nodeDefinition.getCrowdIds().contains(eventPackage.additiveProfile.crowdId)) {
            logger.warn("mDeviceId: {}, eventpackage crowd id: {}, node definition crowd ids: {}, validate crowd id not match",
                    eventPackage.mDeviceId, eventPackage.additiveProfile.crowdId, StringUtils.join(nodeDefinition.getCrowdIds(), ","));
            throw new CrowdNotMatchException("validate crowd id not match");
        }
        return true;
    }

}
