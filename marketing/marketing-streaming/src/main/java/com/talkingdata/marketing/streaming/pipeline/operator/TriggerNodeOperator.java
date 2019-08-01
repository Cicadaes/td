package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.ExpressionExecute;
import com.talkingdata.marketing.streaming.model.CampaignTargetConfig;
import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.PipelineUtil;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.model.OperatorResult;
import com.talkingdata.marketing.streaming.pipeline.definition.PipelineDiagram;
import com.talkingdata.marketing.streaming.pipeline.definition.node.EdgeDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.node.TriggerNodeDefinition;
import com.talkingdata.marketing.streaming.util.DateUtil;
import com.talkingdata.marketing.streaming.util.JsonUtil;
import com.talkingdata.marketing.streaming.util.RedisUtils;
import com.tendcloud.tenddata.entity.AppEvent;
import com.tendcloud.tenddata.entity.EventPackage;
import com.tendcloud.tenddata.entity.TMessage;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.RandomUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 触发器算子
 *
 * @author hongsheng
 * @create 2017-09-27-下午6:07
 * @since JDK 1.8
 */
@Component
public class TriggerNodeOperator extends AbstractOperator {
    private static final Logger logger = LoggerFactory.getLogger(TriggerNodeOperator.class);
    /**
     * 时间范围
     */
    private final static int NODE_MONITOR_TYPE_TIME_FRAME = 1;
    /**
     * 到达上一节点xx小时内
     */
    private final static int NODE_MONITOR_TYPE_LESS_THAN_HOUR = 2;
    /**
     * 分支类型 单分支触发
     */
    private final static int NODE_BRANCH_TYPE_SINGLE = 1;
    /**
     * 同一用户达到更大的指标值可再次触发
     */
    private final static int SAME_USER_BIGGER_TARGET = 1;
    /**
     * 同一用户达到更小的指标值可再次触发
     */
    private final static int SAME_USER_SMALLER_TARGET = 0;
    /**
     * 触发类型：事件
     */
    private final static String TRIGGER_TYPE_EVENT = "event";
    /**
     * 触发类型：指标
     */
    private final static String TRIGGER_TYPE_TARGET = "target";
    /**
     * 缓存Map中，用户通过天数毫秒值的Key
     */
    private final static String DAY_KEY = "day";
    /**
     * 缓存Map中，用户通过次数的Key
     */
    private final static String TIMES_KEY = "times";
    /**
     * 缓存Map中，用户上次通过的指标的Key
     */
    private final static String TARGET_KEY = "target";
    /**
     * 缓存Map中，当前算子的Key后缀
     */
    private final static String TRIGGER_KEY_SUFFIX = "trigger";
    /**
     * 一天的毫秒值
     */
    private final static Integer ONE_DAY_MILLS = 24 * 60 * 60 * 1000;
    /**
     * 一小时的毫秒值
     */
    private final static Integer ONE_HOUR_MILLS = 60 * 60 * 1000;
    /**
     * 用于提取指标值的正则
     */
    private Pattern pattern = Pattern.compile("[>|<|==|>=|<=|=]\\d+");

    @Autowired
    private PipelineUtil pipelineUtil;
    @Autowired
    private RedisUtils redisUtils;

    /**
     * 触发器算子，判断时间，触发规则判断，返回触发的分支
     *
     * @param pipelineDefinition pipeline数据
     * @param nodeDefinition     当前执行的具体算子
     * @param eventPackage       用户的属性、行为等数据
     * @return 如果未到触发时间返回null(需要重写EventPackage, 等待下次触发)，未匹配到分支返回空List，否则返回用户触发的分支
     * @throws NodeOperatorException  NodeOperatorException
     * @throws CrowdNotMatchException 如果eventpackage人群id与算子人群id不符，抛出此异常
     */
    @Override
    public List<EdgeDefinition> executor(PipelineDefinition pipelineDefinition, AbstractNodeDefinition nodeDefinition,
                                         EventPackage eventPackage) throws NodeOperatorException, CrowdNotMatchException {
        validateCrowdIsMatch(pipelineDefinition, eventPackage, nodeDefinition);
        TriggerNodeDefinition triggerNodeDef;
        if (nodeDefinition instanceof TriggerNodeDefinition) {
            triggerNodeDef = (TriggerNodeDefinition) nodeDefinition;
        } else {
            throw new NodeOperatorException("AbstractNodeDefinition 不是正确的TriggerNodeDefinition类型");
        }
        List<EdgeDefinition> edgeDefinitions = new ArrayList<>();
        // 监测时间
        OperatorResult operatorResult = processMoniterTime(triggerNodeDef, eventPackage);
        if (Objects.equals(operatorResult.getStatus(), OperatorResult.LESS_THAN_STATUS)) {
            eventPackage.additiveProfile.nextTriggerTime = operatorResult.getUntilTime();
            return null;
        } else if (Objects.equals(operatorResult.getStatus(), OperatorResult.GREATER_THAN_STATUS)) {
            return edgeDefinitions;
        }

        // 同时满足
        if (!processAdditionExpression(pipelineDefinition, triggerNodeDef)) {
            logger.info("mDeviceId: {}, pipelineId: {}, nodeName: {}, triggerOperator additionExpression was not passed",
                    eventPackage.mDeviceId, pipelineDefinition.getId(), triggerNodeDef.getName());
            return edgeDefinitions;
        }
        // 逻辑判断
        List<String> branchs = processMainExpression(pipelineDefinition, triggerNodeDef, eventPackage);
        logger.info("mDeviceId: {}, pipelineId: {}, nodeName: {}, triggerOperator return branchs: {}",
                eventPackage.mDeviceId, pipelineDefinition.getId(), triggerNodeDef.getName(), StringUtils.join(branchs, ","));
        // 触发规则
        if (!processTriggerRule(pipelineDefinition, triggerNodeDef, eventPackage, branchs)) {
            return edgeDefinitions;
        }
        findEdgeDef(pipelineDefinition, triggerNodeDef, edgeDefinitions, branchs);
        return edgeDefinitions;
    }

    /**
     * 触发器debug执行的方法, 随机分配
     *
     * @param pipelineDefinition pipeline数据
     * @param nodeDefinition     当前执行的具体算子
     * @param eventPackage       用户的属性、行为等数据
     * @throws NodeOperatorException  NodeOperatorException
     * @throws CrowdNotMatchException 如果eventpackage人群id与算子人群id不符，抛出此异常
     */
    @Override
    public List<EdgeDefinition> debug(PipelineDefinition pipelineDefinition, AbstractNodeDefinition nodeDefinition,
                                      EventPackage eventPackage) throws NodeOperatorException, CrowdNotMatchException {
        TriggerNodeDefinition triggerNodeDef;
        if (nodeDefinition instanceof TriggerNodeDefinition) {
            triggerNodeDef = (TriggerNodeDefinition) nodeDefinition;
        } else {
            throw new NodeOperatorException("AbstractNodeDefinition 不是正确的TriggerNodeDefinition类型");
        }
        List<String> mainExpr = triggerNodeDef.getMainExpression();
        int index = RandomUtils.nextInt(0, mainExpr.size());
        String expression = mainExpr.get(index);
        String[] exprArr = expression.split("==");
        List<String> branchs = new ArrayList<>();
        int branchLen = 2;
        if (exprArr.length >= branchLen) {
            branchs.add(exprArr[1].replaceAll(":", "").trim());
        } else {
            branchs.add(expression.trim());
        }
        List<EdgeDefinition> edgeDefinitions = new ArrayList<>();
        findEdgeDef(pipelineDefinition, triggerNodeDef, edgeDefinitions, branchs);
        return edgeDefinitions;
    }

    private void findEdgeDef(PipelineDefinition pipelineDefinition, TriggerNodeDefinition triggerNodeDef,
                             List<EdgeDefinition> edgeDefinitions, List<String> branchs) throws NodeOperatorException {
        PipelineDiagram pipelineDiagram;
        try {
            pipelineDiagram = JsonUtil.toObject(pipelineDefinition.getDiagram(), PipelineDiagram.class);
        } catch (IOException e) {
            logger.error("解析pipelineDiagram失败", e);
            throw new NodeOperatorException("解析失败");
        }
        for (EdgeDefinition edgeDefinition : pipelineDiagram.findBySourceNodeId(triggerNodeDef.getId())) {
            if (branchs.contains(edgeDefinition.getExpression())) {
                edgeDefinitions.add(edgeDefinition);
            }
        }
    }

    /**
     * 触发规则判断
     *
     * @return true符合触发，否则false
     */
    private boolean processTriggerRule(PipelineDefinition pipelineDefinition, TriggerNodeDefinition triggerNodeDef,
                                       EventPackage eventPackage, List<String> branchs) {
        //  && NODE_TRIGGER_TYPE_LIMITED == triggerNodeDef.getUnlimited()
        if (branchs != null && !branchs.isEmpty()) {
            Integer branchType = triggerNodeDef.getBranchType();
            String targetType = triggerNodeDef.getTargetType();
            String key = genCacheKey(pipelineDefinition, triggerNodeDef, eventPackage);
            if (NODE_BRANCH_TYPE_SINGLE == branchType && TRIGGER_TYPE_TARGET.equalsIgnoreCase(targetType)) {
                // [指标] * [单分支]
                return processSingleTargetRule(triggerNodeDef, eventPackage, branchs, key, pipelineDefinition.getEndTime());
            } else {
                // [事件] * [单分支] || [事件] * [多分支] || [指标] * [多分支]
                return processDaysAndTimesRule(triggerNodeDef, key, eventPackage, pipelineDefinition.getEndTime());
            }
        }
        return true;
    }

    /**
     * [事件] * [单分支] || [事件] * [多分支] || [指标] * [多分支]
     * 同一用户*天内不被重复触达
     * 同一用户重复触达次数不超过*
     *
     * @param triggerNodeDef TriggerNodeDefinition
     * @param key            cache的key
     * @return 如果填写了频次与频率则判断，未通过则返回false，否则返回true
     */
    private boolean processDaysAndTimesRule(TriggerNodeDefinition triggerNodeDef, String key, EventPackage ep, Date endTime) {
        Integer sameUserLessThanDays = triggerNodeDef.getSameUserLessThanDays();
        long currMillis = getCurrMillis();
        if (sameUserLessThanDays != null && sameUserLessThanDays != 0) {
            // 根据key去取上一次通过的时间day
            String lastDayVal = redisUtils.getHash(key, DAY_KEY);
            if (StringUtils.isNotEmpty(lastDayVal)) {
                Long lastDayMillis = Long.parseLong(lastDayVal);
                // 判断天数与今天的时间，如果在天数内，则返回false
                if (currMillis - lastDayMillis < sameUserLessThanDays * ONE_DAY_MILLS) {
                    logger.warn("mDeviceId: {}, pipelineId: {}, nodeName: {}, lastTriggerDay: {}, currDay: {}, lessThanDays: {}" +
                                    ", trigger rule return false", ep.mDeviceId, triggerNodeDef.getPipelineDefinitionId(),
                            triggerNodeDef.getName(), DateUtil.format(lastDayMillis, DateUtil.dtf_y4mmdd),
                            DateUtil.format(currMillis, DateUtil.dtf_y4mmdd), sameUserLessThanDays);
                    return false;
                }
            }
        }
        Integer sameUserLessThanTimes = triggerNodeDef.getSameUserLessThanTimes();
        Integer times = 1;
        if (sameUserLessThanTimes != null && sameUserLessThanTimes != 0) {
            // 根据key去取次数
            String lastTimesVal = redisUtils.getHash(key, TIMES_KEY);
            if (StringUtils.isNotEmpty(lastTimesVal)) {
                times = Integer.parseInt(lastTimesVal);
                times++;
                // 判断次数是否超过，超过则返回false，
                if (times > sameUserLessThanTimes) {
                    logger.warn("mDeviceId: {}, pipelineId: {}, nodeName: {}, number of triggered times: {}, lessThanTimes: {}, " +
                                    "trigger rule return false", ep.mDeviceId, triggerNodeDef.getPipelineDefinitionId(),
                            triggerNodeDef.getName(), times, sameUserLessThanTimes);
                    return false;
                }
            }
        }
        long expire = computeExpire(endTime);
        // 两个条件都满足，则表示此次可以触发，则重新设置值（天数：只要是能触发就更改，次数每次加一次）
        if (sameUserLessThanDays != null && sameUserLessThanDays != 0 && expire != 0) {
            redisUtils.setHash(key, DAY_KEY, String.valueOf(currMillis));
            redisUtils.expire(key, expire);
        }
        if (sameUserLessThanTimes != null && sameUserLessThanTimes != 0 && expire != 0) {
            redisUtils.setHash(key, TIMES_KEY, String.valueOf(times));
            redisUtils.expire(key, expire);
        }
        return true;
    }

    /**
     * [指标] * [单分支]
     * 同一用户达到更大的指标值可再次触达(与上一次对比，如果上次区间是200-300，则下一次需要是大于300)
     * 同一用户达到更小的指标值可再次触达(与上一次对比，如果上次区间是200-300，则下一次需要是小于200)
     */
    private Boolean processSingleTargetRule(TriggerNodeDefinition triggerNodeDef, EventPackage eventPackage,
                                            List<String> branchs, String key, Date endTime) {
        Integer sameUserTarget = triggerNodeDef.getSameUserTarget();
        if (sameUserTarget != null) {
            // 根据key去取上次执行节点的target的最大或最小值, 单分支，只会触发一个分支
            String branch = branchs.get(0);
            String lastTargetVal = redisUtils.getHash(key, TARGET_KEY);
            // 指标 : > : 123 : && 指标 : < : 220 : = : 分支1, 指标 : < : 3 : = : 分支2, 分支3
            Map<String, Integer> branchMap = genBranchMap(triggerNodeDef);
            Integer currentTarget = branchMap.get(branch);
            if (currentTarget == null) {
                logger.error("current branch: {}, main expression: {} not match ", branch, triggerNodeDef.getMainExpression());
                return false;
            }
            long expire = computeExpire(endTime);
            if (StringUtils.isEmpty(lastTargetVal) && expire != 0) {
                redisUtils.setHash(key, TARGET_KEY, String.valueOf(branchMap.get(branch)));
                redisUtils.expire(key, expire);
                return true;
            }
            int lastTarget = Integer.parseInt(lastTargetVal);
            // 如果为0，则表示上次为else分支，如果为-1，表示上次指标值转Int失败
            if (lastTarget == 0 || lastTarget == -1) {
                logger.warn("mDeviceId: {}, pipelineId: {}, nodeName: {}, last target value is: {}, trigger rule return false",
                        eventPackage.mDeviceId, triggerNodeDef.getPipelineDefinitionId(), triggerNodeDef.getName(), lastTarget);
                return false;
            }
            // 如果存在，则根据最大，最小比较（获取当前分支的最大或者最小的值）
            // 更大
            if (sameUserTarget == SAME_USER_BIGGER_TARGET && expire != 0) {
                if (currentTarget > lastTarget || currentTarget == 0) {
                    // 如果通过，则设置最大或者最小值
                    redisUtils.setHash(key, TARGET_KEY, String.valueOf(currentTarget));
                    redisUtils.expire(key, expire);
                    return true;
                }
            }
            // 更小
            if (sameUserTarget == SAME_USER_SMALLER_TARGET && currentTarget < lastTarget && expire != 0) {
                // 如果通过，则设置最大或者最小值
                redisUtils.setHash(key, TARGET_KEY, String.valueOf(currentTarget));
                redisUtils.expire(key, expire);
                return true;
            }
            logger.warn("mDeviceId: {}, pipelineId: {}, nodeName: {}, last target value is: {},currentTarget: {}, trigger rule return false",
                    eventPackage.mDeviceId, triggerNodeDef.getPipelineDefinitionId(), triggerNodeDef.getName(), lastTarget, currentTarget);
            return false;
        }
        return true;
    }

    /**
     * 根据算子选择的更大或者更小指标值，生成分支与分支值的映射
     *
     * @return 如果是else分支，则指标值为0，如果指标值转换为int失败，则指标值为-1。
     * 如果指标值为区间值，则根据更大和更小，如果更大则是区间中最大的值，反之
     */
    private Map<String, Integer> genBranchMap(TriggerNodeDefinition triggerNodeDef) {
        Map<String, Integer> branchMap = new HashMap<>(16);
        List<String> mainExpression = triggerNodeDef.getMainExpression();
        Integer sameUserTarget = triggerNodeDef.getSameUserTarget();
        Integer target = -1;
        for (String expression : mainExpression) {
            String[] expressionArr = expression.split(": = :");
            // else 分支
            if (expressionArr.length == 1) {
                branchMap.put(expressionArr[0].replaceAll(":| ", ""), 0);
                continue;
            }
            Matcher matcher = pattern.matcher(expressionArr[0].replaceAll(":| ", ""));
            while (matcher.find()) {
                String oneTargetStr = matcher.group(0).replaceAll("[>|<|==|>=|<=|=]", "");
                try {
                    int oneTarget = Integer.parseInt(oneTargetStr);
                    // 更大
                    if (sameUserTarget == SAME_USER_BIGGER_TARGET) {
                        if (oneTarget > target) {
                            target = oneTarget;
                        }
                    }
                    // 更小
                    if (sameUserTarget == SAME_USER_SMALLER_TARGET) {
                        if (target == -1 || target > oneTarget) {
                            target = oneTarget;
                        }
                    }
                } catch (NumberFormatException e) {
                    logger.error("mainExpression: {}, target is not number", mainExpression);
                }
            }
            branchMap.put(expressionArr[1].replaceAll(":| ", ""), target);
            target = -1;
        }
        return branchMap;
    }

    private String genCacheKey(PipelineDefinition pipelineDefinition, TriggerNodeDefinition triggerNodeDef, EventPackage eventPackage) {
        return pipelineDefinition.getCampaignId() + "_" + pipelineDefinition.getId() + "_" + pipelineDefinition.getVersion() +
                "_" + TRIGGER_KEY_SUFFIX + "_" + triggerNodeDef.getId() + "_" + eventPackage.mDeviceId;
    }

    private long getCurrMillis() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTimeInMillis();
    }

    /**
     * 处理同时满足的条件，表达式如下：
     * 指标 : > : 123 : && 指标 : < : 220
     *
     * @return 满足返回true，否则false
     */
    private boolean processAdditionExpression(PipelineDefinition pipelineDefinition, TriggerNodeDefinition triggerNodeDef) {
        List<String> additionExpression = triggerNodeDef.getAdditionExpression();
        if (additionExpression == null || additionExpression.isEmpty()) {
            return true;
        }
        for (String expression : additionExpression) {
            int index = expression.indexOf(":");
            if (index == -1) {
                logger.error("pipelineId: {}, nodeName: {}, additionExpression: {}, additionExpression is incomplete",
                        pipelineDefinition.getId(), triggerNodeDef.getName(), expression);
                return false;
            }
            // 截取指标
            String targetCode = expression.substring(0, index).trim();
            //  根据活动id + 指标 获取指标值
            CampaignTargetConfig targetConfig = pipelineUtil.findCampaignTargetConfig(pipelineDefinition.getCampaignId(), targetCode);
            if (targetConfig == null) {
                logger.error("pipelineId: {}, nodeName: {}, campaignId: {}, targetCode: {}, CampaignTargetConfig is null",
                        pipelineDefinition.getId(), triggerNodeDef.getName(), pipelineDefinition.getCampaignId(), targetCode);
                return false;
            }
            Map<String, Object> data = new HashMap<>(16);
            data.put(targetCode, targetConfig.getValue());
            if (!ExpressionExecute.executeForBooleanResult(expression, data)) {
                logger.warn("pipelineId: {}, nodeName: {}, additionExpression: {}, targetValue: {}, execute result false",
                        pipelineDefinition.getId(), triggerNodeDef.getName(), expression, targetConfig.getValue());
                return false;
            }
        }
        return true;
    }

    /**
     * 处理触发的分支信息
     *
     * @return 该用户的分支信息，单分支为单个，多分支为多个，为空则表示未匹配到
     */
    private List<String> processMainExpression(PipelineDefinition pipelineDefinition, TriggerNodeDefinition triggerNodeDef, EventPackage eventPackage) throws NodeOperatorException {
        List<String> branchs = new ArrayList<>();
        List<String> mainExpression = triggerNodeDef.getMainExpression();
        Integer branchType = triggerNodeDef.getBranchType();
        String targetType = triggerNodeDef.getTargetType();
        if (TRIGGER_TYPE_EVENT.equals(targetType)) {
            eventBranch(eventPackage, branchs, mainExpression, branchType);
        } else if (TRIGGER_TYPE_TARGET.equals(targetType)) {
            targetBranch(pipelineDefinition, branchs, mainExpression, branchType);
        } else {
            throw new NodeOperatorException(String.format("not support targetType， targetType：%s", targetType));
        }
        return branchs;
    }

    /**
     * 处理指标, 该用户所返回的分支信息，分为单分支和多分支，样例数据如下：
     * 单分支：指标 : > : 123 : && 指标 : < : 220 : == : 分支1, 指标 : < : 3 : == : 分支2, 分支3
     * 多分支：指标 : > : 123 : && 指标 : < : 220 : == : 分支1, 指标 : < : 3 : == : 分支1, 指标 : < : 3 : == : 分支2
     */
    private void targetBranch(PipelineDefinition pipelineDefinition, List<String> branchs, List<String> mainExpression, Integer branchType) {
        if (mainExpression == null || mainExpression.isEmpty()) {
            logger.error("pipelineId: {}, triggerNode mainExpression is empty", pipelineDefinition.getId());
            return;
        }
        int index = mainExpression.get(0).indexOf(":");
        if (index == -1) {
            logger.error("pipelineId: {}, triggerNode mainExpression: {}, mainExpression is incomplete",
                    pipelineDefinition.getId(), mainExpression.get(0));
            return;
        }
        //  截取指标
        String targetCode = mainExpression.get(0).substring(0, index).trim();
        //  根据活动id + 指标 获取指标值
        CampaignTargetConfig targetConfig = pipelineUtil.findCampaignTargetConfig(pipelineDefinition.getCampaignId(), targetCode);
        if (targetConfig == null) {
            logger.error("pipelineId: {}, campaignId: {}, targetCode: {}, CampaignTargetConfig is null",
                    pipelineDefinition.getId(), pipelineDefinition.getCampaignId(), targetCode);
            return;
        }
        Map<String, Object> data = new HashMap<>(16);
        data.put(targetCode, targetConfig.getValue());
        String[] expressionArr;
        for (int i = 0; i < mainExpression.size(); i++) {
            expressionArr = mainExpression.get(i).split(": == :");
            // 表达式切割完结果不正确，并且不是最后一个else分支
            if (expressionArr.length != 2 && i != mainExpression.size() - 1) {
                logger.error("pipelineId: {}, campaignId: {}, triggerNode mainExpression: {}, is incomplete",
                        pipelineDefinition.getId(), pipelineDefinition.getCampaignId(), mainExpression.get(i));
            }
            if (expressionArr.length == 2 && ExpressionExecute.executeForBooleanResult(expressionArr[0].trim(), data)) {
                branchs.add(expressionArr[1].replaceAll(":", "").trim());
                // 单分支不在判断
                if (NODE_BRANCH_TYPE_SINGLE == branchType) {
                    return;
                }
            }
            // 最后一个else并且分支List中没有记录的时候
            if (NODE_BRANCH_TYPE_SINGLE == branchType && i == mainExpression.size() - 1 && branchs.isEmpty()) {
                branchs.add(mainExpression.get(i).trim());
            }
        }
    }

    /**
     * 处理事件，该用户所返回的分支信息，分为单分支和多分支，样例数据如下：
     * 单分支：事件1 : == : 分支1, 事件2 : == : 分支2, 分支3
     * 多分支：事件1 : == : 分支1, 事件1 : == : 分支1, 事件2 : == : 分支2
     */
    private void eventBranch(EventPackage eventPackage, List<String> branchs, List<String> mainExpression, Integer branchType) {
        List<TMessage> mTMessages = eventPackage.mTMessages;
        List<String> eventTypes = new ArrayList<>();
        for (TMessage mTMessage : mTMessages) {
            if (mTMessage.session != null) {
                for (AppEvent appEvent : mTMessage.session.appEvents) {
                    eventTypes.add(appEvent.id);
                }
            }
        }
        if (eventTypes.isEmpty()) {
            logger.warn("mDeviceId: {}, eventPackage mTMessage.session.appEvents is empty", eventPackage.mDeviceId);
        }
        for (int i = 0; i < mainExpression.size(); i++) {
            String[] subExprArr = mainExpression.get(i).replaceAll(":", "").split("==");
            // 表达式切割完结果不正确，并且不是最后一个else分支
            if (subExprArr.length != 2 && i != mainExpression.size() - 1) {
                logger.error("pipelineId: {}, mDeviceId: {}, triggerNode mainExpression: {}, is incomplete",
                        eventPackage.additiveProfile.pipelineDefinitionId, eventPackage.mDeviceId, mainExpression.get(i));
            }
            if (subExprArr.length == 2 && eventTypes.contains(subExprArr[0].trim())) {
                branchs.add(subExprArr[1].trim());
                // 单分支不在判断
                if (NODE_BRANCH_TYPE_SINGLE == branchType) {
                    return;
                }
            }
            // 最后一个else并且分支List中没有记录的时候，为最后一个分支
            if (NODE_BRANCH_TYPE_SINGLE == branchType && i == mainExpression.size() - 1 && branchs.isEmpty()) {
                branchs.add(mainExpression.get(i).trim());
            }
        }
    }

    /**
     * 监测时间判断，分为：对时间区间的校验和对距离上一个节点的时间判断
     *
     * @return 如果在区间内或者距离上一个节点时间满足输入的小时内，返回true；否则false
     * @throws NodeOperatorException MonitorType 不支持
     */
    private OperatorResult processMoniterTime(TriggerNodeDefinition triggerNodeDef, EventPackage eventPackage) throws NodeOperatorException {
        // 采集时间
        Long rectime = eventPackage.rectime;
        if (Objects.equals(NODE_MONITOR_TYPE_TIME_FRAME, triggerNodeDef.getMonitorType())) {
            // 时间区间
            Long startTime = triggerNodeDef.getStartTime();
            Long endTime = triggerNodeDef.getEndTime();
            if (rectime < startTime) {
                logger.warn("mDeviceId: {}, pipelineId: {}, nodeName: {}, rectime: {}, eventPackage not to trigger time",
                        eventPackage.mDeviceId, eventPackage.additiveProfile.pipelineDefinitionId, triggerNodeDef.getName(), rectime);
                return OperatorResult.lessThanResult(DateUtil.format(startTime, DateUtil.dtf_y4mmdd_hhmmss));
            } else if (rectime >= startTime && rectime <= endTime) {
                return OperatorResult.betweenAndResult(DateUtil.format(endTime, DateUtil.dtf_y4mmdd_hhmmss));
            } else {
                logger.warn("mDeviceId: {}, pipelineId: {}, nodeName: {}, rectime: {}, eventPackage exceeds trigger time",
                        eventPackage.mDeviceId, eventPackage.additiveProfile.pipelineDefinitionId, triggerNodeDef.getName(), rectime);
                return OperatorResult.greaterThanResult(DateUtil.format(endTime, DateUtil.dtf_y4mmdd_hhmmss));
            }
        } else if (Objects.equals(NODE_MONITOR_TYPE_LESS_THAN_HOUR, triggerNodeDef.getMonitorType())) {
            // 距离上一个节点时间 单位：小时
            Integer lessThanHour = triggerNodeDef.getLessThanHour();
            // 获取该user通过上一个节点的时间毫秒值
            Long times = eventPackage.additiveProfile.passBeforeNodeTime;
            // 如果触发器为第一个stage,则passBeforeNodeTime字段未空,因此取当前时间
            if (times == null || times == 0) {
                times = System.currentTimeMillis();
            }
            if (rectime <= times + lessThanHour * ONE_HOUR_MILLS) {
                return OperatorResult.betweenAndResult(DateUtil.format(0L, DateUtil.dtf_y4mmdd_hhmmss));
            } else {
                logger.warn("mDeviceId: {}, pipelineId: {}, nodeName: {}, passBeforeNodeTime: {}, eventPackage exceeds trigger time",
                        eventPackage.mDeviceId, eventPackage.additiveProfile.pipelineDefinitionId, triggerNodeDef.getName(), times);
                return OperatorResult.greaterThanResult(DateUtil.format(0L, DateUtil.dtf_y4mmdd_hhmmss));
            }
        } else {
            throw new NodeOperatorException(String.format("not support MonitorType， MonitorType：%s", triggerNodeDef.getMonitorType()));
        }
    }

    /**
     * 计算写入redis中的key的到期时间, Pipeline的结束时间减去当前时间除以1000，单位秒
     *
     * @param endTime Pipeline的结束时间
     * @return 到期时间
     */
    private long computeExpire(Date endTime) {
        long expire = (endTime.getTime() - System.currentTimeMillis()) / 1000;
        if (expire < 0) {
            expire = 0;
        }
        return expire;
    }
}
