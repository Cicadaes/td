package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.ExpressionExecute;
import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.model.OperatorResult;
import com.talkingdata.marketing.streaming.pipeline.definition.node.HourMeterNodeDefinition;
import com.talkingdata.marketing.streaming.util.DateUtil;
import com.tendcloud.tenddata.entity.AppEvent;
import com.tendcloud.tenddata.entity.EventPackage;
import com.tendcloud.tenddata.entity.TMessage;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 计时器算子
 *
 * @author hongsheng
 * @create 2017-09-27-下午6:03
 * @since JDK 1.8
 */
@Component
public class HourMeterNodeOperator extends AbstractOperator {
    private static final Logger logger = LoggerFactory.getLogger(HourMeterNodeOperator.class);
    /**
     * 目标计时器
     */
    private final static int NODE_HOUR_METER_TYPE_TARGET = 1;
    /**
     * 经时计时器
     */
    private final static int NODE_HOUR_METER_TYPE_TIME = 2;
    private final static String APP = "app";
    private final static String TIME = "time";
    private SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    //    private final static String EVENT = "event";

    /**
     * 计时器是否停止计时
     *
     * @param pipelineDefinition pipeline数据
     * @param nodeDefinition     当前执行的具体算子
     * @param eventPackage       用户的属性、行为等数据
     * @return 是否停止计时，true停止，false不停止
     * @throws NodeOperatorException  NodeOperatorException
     * @throws CrowdNotMatchException 如果eventpackage人群id与算子人群id不符，抛出此异常
     */
    @Override
    public OperatorResult executor(PipelineDefinition pipelineDefinition, AbstractNodeDefinition nodeDefinition,
                                   EventPackage eventPackage) throws NodeOperatorException, CrowdNotMatchException {
        validateCrowdIsMatch(pipelineDefinition, eventPackage, nodeDefinition);
        HourMeterNodeDefinition hourMeterNodeDef;
        if (nodeDefinition instanceof HourMeterNodeDefinition) {
            hourMeterNodeDef = (HourMeterNodeDefinition) nodeDefinition;
        } else {
            throw new NodeOperatorException("AbstractNodeDefinition 不是正确的HourMeterNodeDefinition类型");
        }
        // 计时器类型
        if (hourMeterNodeDef.getHourMeterType() == NODE_HOUR_METER_TYPE_TARGET) {
            return processTargetTimer(eventPackage, hourMeterNodeDef);
        } else if (hourMeterNodeDef.getHourMeterType() == NODE_HOUR_METER_TYPE_TIME) {
            return processTimeTimer(pipelineDefinition, hourMeterNodeDef, eventPackage);
        } else {
            throw new NodeOperatorException("计时器类型: {}, 不正确");
        }
    }

    /**
     * 处理经时计时器
     * 时间格式：5 : 8 : 9, 未填写则用0补齐如：5 : 8 : 0
     *
     * @return 是否停止计时
     */
    private OperatorResult processTimeTimer(PipelineDefinition pipelineDefinition, HourMeterNodeDefinition hourMeterNodeDef, EventPackage eventPackage) throws NodeOperatorException {
        int exprLen = 3;
        String timeExpression = hourMeterNodeDef.getTimeSchedulingExpression();
        if (StringUtils.isEmpty(timeExpression)) {
            throw new NodeOperatorException("经时计时器,时间表达式不能为空");
        }
        String[] expressions = timeExpression.split(" : ");
        if (expressions.length != exprLen) {
            throw new NodeOperatorException(String.format("经时计时器,时间表达式: %s不正确", timeExpression));
        }
        long interval;
        try {
            int day = Integer.parseInt(expressions[0]);
            int hour = Integer.parseInt(expressions[1]);
            int minute = Integer.parseInt(expressions[2]);
            interval = day * 24 * 60 * 60 * 1000 + hour * 60 * 60 * 1000 + minute * 60 * 1000;
        } catch (NumberFormatException e) {
            throw new NodeOperatorException(String.format("经时计时器,时间表达式: %s, 需是正整数", timeExpression));
        }
        // pipelineDefinition中开始时间为活动开始时间，PipelineInstance中为活动上线，下线时间
        Date startTime = pipelineDefinition.getStartTime();
        // 如果计时器为第一个stage,则passBeforeNodeTime字段未空,因此取当前时间
        Long passBeforeNodeTime = eventPackage.additiveProfile.passBeforeNodeTime;
        if (passBeforeNodeTime == null || passBeforeNodeTime == 0) {
            passBeforeNodeTime = System.currentTimeMillis();
        }
        boolean result = passBeforeNodeTime - startTime.getTime() >= interval;
        if (!result) {
            logger.warn("mDeviceId: {}, pipelineId: {}, nodeName: {}, expression: {}, startTime: {}, passBeforeNodeTime: {} ,hourMeteOperator still waiting for",
                    eventPackage.mDeviceId, pipelineDefinition.getId(), hourMeterNodeDef.getName(), timeExpression,
                    startTime.getTime(), eventPackage.additiveProfile.passBeforeNodeTime);
            return OperatorResult.lessThanResult(DateUtil.format(startTime.getTime() + interval, DateUtil.dtf_y4mmdd_hhmmss));
        }
        return OperatorResult.betweenAndResult(DateUtil.format(0L, DateUtil.dtf_y4mmdd_hhmmss));
    }

    /**
     * 处理目标计时器的时间和事件组合
     * 时间格式：2017-10-10 11:03:00
     * 事件组合格式：time : >= : '2017-10-10 11:03:00' : && : ( : 'app' : == : 'app1' : && : 'event' : == : 'event1' : ) : && : ( : 'app' : == : 'app2' : && : 'event' : == : 'event2' : )
     *
     * @return 是否停止计时
     */
    private OperatorResult processTargetTimer(EventPackage eventPackage, HourMeterNodeDefinition hourMeterNodeDef) throws NodeOperatorException {
        OperatorResult stmResult = validateStopTimeMillis(eventPackage, hourMeterNodeDef.getStopTimeMillis());
        if (Objects.equals(stmResult.getStatus(), OperatorResult.LESS_THAN_STATUS)) {
            return stmResult;
        }
        String expression = hourMeterNodeDef.getExpression();
        if (StringUtils.isEmpty(expression)) {
            throw new NodeOperatorException("目标计时器,表达式不能为空");
        }
        List<TMessage> mTMessages = eventPackage.mTMessages;
        List<String> eventIds = new ArrayList<>();
        for (TMessage mTMessage : mTMessages) {
            if (mTMessage.session != null) {
                for (AppEvent appEvent : mTMessage.session.appEvents) {
                    eventIds.add("'" + appEvent.id + "'");
                }
            }
        }
        if (eventIds.isEmpty()) {
            logger.warn("mDeviceId: {}, eventPackage mTMessage.session.appEvents is empty", eventPackage.mDeviceId);
        }
        String userEvents = "[" + StringUtils.join(eventIds, ",") + "]";
        String exprSplit = "&&";
        for (String event : expression.split(exprSplit)) {
            int index = event.indexOf(")");
            if (index != -1) {
                String subEvent = event.substring(0, index);
                String[] eventArr = subEvent.replaceAll(" : ", "").split("==");
                if (eventArr.length != 2) {
                    logger.error("pipelineId: {}, mDeviceId: {}, hourMeterNode expression: {}, is incomplete",
                            eventPackage.additiveProfile.pipelineDefinitionId, eventPackage.mDeviceId, expression);
                }
                expression = expression.replace(subEvent, " " + userEvents + ".contains(" + eventArr[1] + ")");
            }
        }
        Map<String, Object> data = new HashMap<>(16);
        // 如果计时器为第一个stage,则passBeforeNodeTime字段未空,因此取当前时间
        Long passBeforeNodeTime = eventPackage.additiveProfile.passBeforeNodeTime;
        if (passBeforeNodeTime == null || passBeforeNodeTime == 0) {
            passBeforeNodeTime = System.currentTimeMillis();
        }
        data.put(TIME, dateFormat.format(passBeforeNodeTime));
        data.put(APP, eventPackage.mAppProfile.mAppPackageName);
        boolean result = ExpressionExecute.executeForBooleanResult(expression, data);
        if (!result) {
            logger.warn("mDeviceId: {}, pipelineId: {}, nodeName: {}, expression: {}, app: {}, eventIds: {} ,app or event, hourMeteOperator break",
                    eventPackage.mDeviceId, eventPackage.additiveProfile.pipelineDefinitionId, hourMeterNodeDef.getName(), expression,
                    eventPackage.mAppProfile.mAppPackageName, userEvents);
            return OperatorResult.greaterThanResult(DateUtil.format(0L, DateUtil.dtf_y4mmdd_hhmmss));
        }
        return OperatorResult.betweenAndResult(DateUtil.format(0L, DateUtil.dtf_y4mmdd_hhmmss));
    }

    /**
     * 判断等待直到满足以下条件停止计时
     *
     * @return 如果小于，则需要继续等待，返回OperatorResult.lessThanResult, 否则继续执行
     */
    private OperatorResult validateStopTimeMillis(EventPackage eventPackage, Long stopTimeMillis) {
        // 如果计时器为第一个stage,则passBeforeNodeTime字段未空,因此取当前时间
        Long passBeforeNodeTime = eventPackage.additiveProfile.passBeforeNodeTime;
        if (passBeforeNodeTime == null || passBeforeNodeTime == 0) {
            passBeforeNodeTime = System.currentTimeMillis();
        }
        if (passBeforeNodeTime < stopTimeMillis) {
            return OperatorResult.lessThanResult(DateUtil.format(stopTimeMillis, DateUtil.dtf_y4mmdd_hhmmss));
        }
        return OperatorResult.betweenAndResult(DateUtil.format(0L, DateUtil.dtf_y4mmdd_hhmmss));
    }

}
