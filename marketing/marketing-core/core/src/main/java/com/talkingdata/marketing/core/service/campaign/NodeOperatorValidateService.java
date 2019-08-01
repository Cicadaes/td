package com.talkingdata.marketing.core.service.campaign;

import com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType;
import com.talkingdata.marketing.core.entity.campaign.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.Branch;
import com.talkingdata.marketing.core.entity.campaign.definition.node.EntranceNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.FilterNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.GenerateCrowdNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.HourMeterNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.PushNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.ShortMessageNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.SplitNodeDefinition;
import com.talkingdata.marketing.core.entity.campaign.definition.node.TriggerNodeDefinition;
import com.talkingdata.marketing.core.entity.dto.NodeCheckDto;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.BranchTypeConstants.NODE_BRANCH_TYPE_LIST;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.BranchTypeConstants.NODE_BRANCH_TYPE_SINGLE;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.CalcType.NODE_CALC_TYPE_CYCLE;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.CalcType.NODE_CALC_TYPE_LIST;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.CalcType.NODE_CROWD_TYPE_LIST;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.HourMeterTypeConstants.NODE_HOUR_METER_TYPE_LIST;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.HourMeterTypeConstants.NODE_HOUR_METER_TYPE_TARGET;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.HourMeterTypeConstants.NODE_HOUR_METER_TYPE_TIME;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.MonitorTypeConstants.NODE_MONITOR_TYPE_LESS_THAN_HOUR;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.MonitorTypeConstants.NODE_MONITOR_TYPE_LIST;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.MonitorTypeConstants.NODE_MONITOR_TYPE_TIME_FRAME;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.PutTriggerTypeConstants.PUT_TRIGGER_TYPE_LIST;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.PutTriggerTypeConstants.PUT_TRIGGER_TYPE_LOOP;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.PutTriggerTypeConstants.PUT_TRIGGER_TYPE_TIME;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.SplitTypeConstants.NODE_SPLIT_TYPE_CROWD_NUMBER;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.SplitTypeConstants.NODE_SPLIT_TYPE_LIST;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.SplitTypeConstants.NODE_SPLIT_TYPE_PERCENT;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.TriggerTypeConstants.TRIGGER_TYPE_EVENT;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.TriggerTypeConstants.TRIGGER_TYPE_LIST;
import static com.talkingdata.marketing.core.constant.NodeOperatorConstants.TriggerTypeConstants.TRIGGER_TYPE_TARGET;

/**
 * @author Created by tend on 2017/12/8.
 */
@Component public class NodeOperatorValidateService {

    /**
     * 入口算子校验
     *
     * @param entranceNodeDef EntranceNodeDefinition
     * @return NodeCheckDto
     */
    public NodeCheckDto validateEntranceNode(EntranceNodeDefinition entranceNodeDef) {
        List<String> errMsgList = new ArrayList<>();
        validateOperatorBaseInfo(entranceNodeDef, errMsgList);
        if (entranceNodeDef.getCrowdType() == null || (!NODE_CROWD_TYPE_LIST.contains(entranceNodeDef.getCrowdType()))) {
            errMsgList.add("错误的人群类型");
        }
        if (StringUtils.isEmpty(entranceNodeDef.getCrowdName())) {
            errMsgList.add("未选择人群名称");
        }
        if (entranceNodeDef.getCrowdId() == null) {
            errMsgList.add("未选择人群");
        }
        if (!Objects.equals(CrowdType.CROWD_TYPE_ACCURATE_HISTORY, entranceNodeDef.getCrowdType())) {
            if (entranceNodeDef.getCalcType() == null || (!NODE_CALC_TYPE_LIST.contains(entranceNodeDef.getCalcType()))) {
                errMsgList.add("错误的人群计算频率");
            } else {
                if (NODE_CALC_TYPE_CYCLE == entranceNodeDef.getCalcType() && entranceNodeDef.getPeriod() == null) {
                    errMsgList.add("人群计算频率不能为空");
                }
            }
        }
        return errMsgList.size() == 0 ? null : new NodeCheckDto(entranceNodeDef.getId(), errMsgList);
    }

    /**
     * 分流器算子校验
     *
     * @param splitNodeDef SplitNodeDefinition
     * @return NodeCheckDto
     */
    public NodeCheckDto validateSplitNode(SplitNodeDefinition splitNodeDef) {
        List<String> errMsgList = new ArrayList<>();
        validateOperatorBaseInfo(splitNodeDef, errMsgList);
        if (splitNodeDef.getSplitType() == null || !NODE_SPLIT_TYPE_LIST.contains(splitNodeDef.getSplitType())) {
            errMsgList.add("错误的分流类型");
        } else {
            if (splitNodeDef.getSplitType().equals(NODE_SPLIT_TYPE_CROWD_NUMBER) || splitNodeDef.getSplitType().equals(NODE_SPLIT_TYPE_PERCENT)) {
                if (splitNodeDef.getCount() == null || splitNodeDef.getCount().equals(0)) {
                    errMsgList.add("未选择分支数量");
                }
            } else {
                if (StringUtils.isBlank(splitNodeDef.getDimensionCode())) {
                    errMsgList.add("未选择维度");
                }
            }
        }
        List<Branch> branchList = splitNodeDef.getBranchList();
        if (branchList == null || branchList.isEmpty()) {
            errMsgList.add("分支不能为空");
        } else {
            if (ObjectUtils.compare(branchList.size(), splitNodeDef.getCount()) != 0) {
                errMsgList.add("分支数量与实际分支不符");
            }
            if (NODE_SPLIT_TYPE_CROWD_NUMBER == splitNodeDef.getSplitType()) {
                for (Branch branch : branchList) {
                    if (branch.getMax() == null || branch.getMin() == null) {
                        continue;
                    }
                    if (branch.getMax() != 0 && branch.getMax() < branch.getMin()) {
                        errMsgList.add("分支的上限值不能小于下限值");
                    }
                }
            }
        }
        return errMsgList.size() == 0 ? null : new NodeCheckDto(splitNodeDef.getId(), errMsgList);
    }

    /**
     * 应用推送算子校验
     *
     * @param pushNodeDef PushNodeDefinition
     * @return NodeCheckDto
     */
    public NodeCheckDto validatePushNode(PushNodeDefinition pushNodeDef) {
        List<String> errMsgList = new ArrayList<>();
        String pushOsIos = "ios";
        validateOperatorBaseInfo(pushNodeDef, errMsgList);
        // 目标平台
        if (StringUtils.isEmpty(pushNodeDef.getPlatform())) {
            errMsgList.add("目标平台不能为空");
        }
        // APP
        if (StringUtils.isEmpty(pushNodeDef.getAppid())) {
            errMsgList.add("APP不能为空");
        }
        // 消息标题
        if (!pushOsIos.equalsIgnoreCase(pushNodeDef.getPlatform()) && StringUtils.isEmpty(pushNodeDef.getTitle())) {
            errMsgList.add("消息标题不能为空");
        }
        // 消息内容
        if (StringUtils.isEmpty(pushNodeDef.getMessage())) {
            errMsgList.add("消息内容不能为空");
        }
        // 推送通道
        if (StringUtils.isEmpty(pushNodeDef.getChannel())) {
            errMsgList.add("推送通道不能为空");
        }
        validateTriggerType(errMsgList, pushNodeDef.getTriggerType(), pushNodeDef.getCronExpression(), pushNodeDef.getAppointedTime());
        return errMsgList.size() == 0 ? null : new NodeCheckDto(pushNodeDef.getId(), errMsgList);
    }

    /**
     * 短信通知算子校验
     *
     * @param shortMessageNodeDef ShortMessageNodeDefinition
     * @return NodeCheckDto
     */
    public NodeCheckDto validateShortMessageNode(ShortMessageNodeDefinition shortMessageNodeDef) {
        List<String> errMsgList = new ArrayList<>();
        validateOperatorBaseInfo(shortMessageNodeDef, errMsgList);
        // 投放渠道
        if (StringUtils.isEmpty(shortMessageNodeDef.getChannelCode())) {
            errMsgList.add("投放渠道不能为空");
        }
        // 短信内容
        if (StringUtils.isEmpty(shortMessageNodeDef.getContent())) {
            errMsgList.add("短信内容不能为空");
        }
        validateTriggerType(errMsgList, shortMessageNodeDef.getTriggerType(), shortMessageNodeDef.getAppointedTime(),
            shortMessageNodeDef.getCronExpression());
        return errMsgList.size() == 0 ? null : new NodeCheckDto(shortMessageNodeDef.getId(), errMsgList);
    }

    /**
     * 触发器算子校验
     *
     * @param triggerNodeDef TriggerNodeDefinition
     * @return NodeCheckDto
     */
    public NodeCheckDto validateTriggerNode(TriggerNodeDefinition triggerNodeDef) {
        List<String> errMsgList = new ArrayList<>();
        validateOperatorBaseInfo(triggerNodeDef, errMsgList);
        validateTriggerMonitorTime(triggerNodeDef, errMsgList);
        validateTriggerMainExpr(triggerNodeDef, errMsgList);
        validateTriggerAdditionExpr(triggerNodeDef, errMsgList);
        return errMsgList.size() == 0 ? null : new NodeCheckDto(triggerNodeDef.getId(), errMsgList);
    }

    /**
     * 计时器算子校验
     *
     * @param hourMeterNodeDef HourMeterNodeDefinition
     * @return NodeCheckDto
     */
    public NodeCheckDto validateHourMeterNode(HourMeterNodeDefinition hourMeterNodeDef) {
        List<String> errMsgList = new ArrayList<>();
        validateOperatorBaseInfo(hourMeterNodeDef, errMsgList);
        String keyForUndefinedExpression = "undefined";
        if (hourMeterNodeDef.getHourMeterType() == null || (!NODE_HOUR_METER_TYPE_LIST.contains(hourMeterNodeDef.getHourMeterType()))) {
            Collections.addAll(errMsgList, "错误的计时器类型");
        } else {
            if (NODE_HOUR_METER_TYPE_TARGET == hourMeterNodeDef.getHourMeterType()) {
                if (hourMeterNodeDef.getStopTimeMillis() == null || StringUtils.isEmpty(hourMeterNodeDef.getExpression())) {
                    errMsgList.add("目标计时器条件不能为空");
                } else if (hourMeterNodeDef.getExpression().contains(keyForUndefinedExpression)) {
                    errMsgList.add("目标计时器条件不完整");
                }
            }
            if (NODE_HOUR_METER_TYPE_TIME == hourMeterNodeDef.getHourMeterType()) {
                if (StringUtils.isEmpty(hourMeterNodeDef.getTimeSchedulingExpression())) {
                    errMsgList.add("经时计时器条件不能为空");
                }
            }
        }
        return errMsgList.size() == 0 ? null : new NodeCheckDto(hourMeterNodeDef.getId(), errMsgList);
    }

    /**
     * 过滤器算子校验
     *
     * @param filterNodeDef FilterNodeDefinition
     * @return NodeCheckDto
     */
    public NodeCheckDto validateFilterNode(FilterNodeDefinition filterNodeDef) {
        List<String> errMsgList = new ArrayList<>();
        validateOperatorBaseInfo(filterNodeDef, errMsgList);
        List<String> tagRowKeyList = filterNodeDef.getTagRowKeyList();
        if (tagRowKeyList == null || tagRowKeyList.isEmpty()) {
            errMsgList.add("过滤条件不能为空");
        } else {
            for (String rowKey : tagRowKeyList) {
                if (StringUtils.isEmpty(rowKey)) {
                    errMsgList.add("过滤条件不能为空");
                    break;
                }
            }
        }
        return errMsgList.size() == 0 ? null : new NodeCheckDto(filterNodeDef.getId(), errMsgList);
    }

    /**
     * 生成人群算子校验
     *
     * @param generateCrowdNodeDef GenerateCrowdNodeDefinition
     * @return NodeCheckDto
     */
    public NodeCheckDto validateGenerateCrowdNode(GenerateCrowdNodeDefinition generateCrowdNodeDef) {
        List<String> errMsgList = new ArrayList<>();
        validateOperatorBaseInfo(generateCrowdNodeDef, errMsgList);
        return errMsgList.size() == 0 ? null : new NodeCheckDto(generateCrowdNodeDef.getId(), errMsgList);
    }

    /**
     * 校验算子基本信息
     *
     * @param nodeDef AbstractNodeDefinition
     * @param errMsgs 错误信息List
     */
    private void validateOperatorBaseInfo(AbstractNodeDefinition nodeDef, List<String> errMsgs) {
        int maxNameLegth = 52;
        if (StringUtils.isEmpty(nodeDef.getName())) {
            Collections.addAll(errMsgs, "未填写组件名称");
        } else if (nodeDef.getName().length() > maxNameLegth) {
            Collections.addAll(errMsgs, "组件名称过长");
        }
        int maxDesLength = 160;
        if ((!StringUtils.isEmpty(nodeDef.getDescription())) && nodeDef.getDescription().length() > maxDesLength) {
            Collections.addAll(errMsgs, "组件描述过长");
        }
    }

    /**
     * 校验投放时间类型，以及对应的时间是否为空
     */
    private void validateTriggerType(List<String> errMsgList, Integer triggerType, String cronExpression, String appointedTime) {
        if (triggerType == null || !PUT_TRIGGER_TYPE_LIST.contains(triggerType)) {
            errMsgList.add("错误的投放时间类型");
        } else {
            if (PUT_TRIGGER_TYPE_TIME == triggerType && StringUtils.isEmpty(appointedTime)) {
                errMsgList.add("定时发送时间不能为空");
            }
            if (PUT_TRIGGER_TYPE_LOOP == triggerType && StringUtils.isEmpty(cronExpression)) {
                errMsgList.add("循环发送时间不能为空");
            }
        }
    }

    /**
     * 校验触发器逻辑类型, 触发类型, 触发分支
     */
    private void validateTriggerMainExpr(TriggerNodeDefinition triggerNodeDef, List<String> errMsgList) {
        if (triggerNodeDef.getBranchType() == null || (!NODE_BRANCH_TYPE_LIST.contains(triggerNodeDef.getBranchType()))) {
            errMsgList.add("错误的逻辑类型");
        }
        if (StringUtils.isEmpty(triggerNodeDef.getTargetType()) || (!TRIGGER_TYPE_LIST.contains(triggerNodeDef.getTargetType()))) {
            errMsgList.add("错误的触发类型");
        } else {
            List<String> mainExpression = triggerNodeDef.getMainExpression();
            if (mainExpression == null || mainExpression.isEmpty()) {
                errMsgList.add("触发分支不能为空");
                return;
            }
            Map<String, Integer> branchs = new HashMap<>(16);
            // 单分支：事件1 : == : 分支1, 事件2 : == : 分支2, 分支3
            // 多分支：事件1 : == : 分支1, 事件1 : == : 分支1, 事件2 : == : 分支2
            for (int i = 0; i < mainExpression.size(); i++) {
                String expression = mainExpression.get(i);
                if (StringUtils.isEmpty(expression)) {
                    errMsgList.add("分支名不能为空");
                    break;
                }
                String[] exprArr = expression.replaceAll(":", "").split("==");
                String branch;
                if (exprArr.length < 2) {
                    // 只有单分支并且最后一个else分支，被切分后才会小于2
                    if (NODE_BRANCH_TYPE_SINGLE == triggerNodeDef.getBranchType() && i == mainExpression.size() - 1) {
                        if (expression.contains("undefined")) {
                            errMsgList.add("分支名不能为空");
                            break;
                        }
                        branch = expression.trim();
                    } else {
                        errMsgList.add("分支表达式不正确");
                        break;
                    }
                } else {
                    if (StringUtils.isEmpty(exprArr[1].trim()) || exprArr[1].contains("undefined")) {
                        errMsgList.add("分支名不能为空");
                        break;
                    }
                    if (TRIGGER_TYPE_EVENT.equals(triggerNodeDef.getTargetType())) {
                        if (StringUtils.isEmpty(exprArr[0].trim()) || exprArr[0].contains("undefined")) {
                            errMsgList.add("事件不能为空");
                            break;
                        }
                    }
                    if (TRIGGER_TYPE_TARGET.equals(triggerNodeDef.getTargetType())) {
                        if (StringUtils.isEmpty(exprArr[0].trim()) || exprArr[0].contains("undefined")) {
                            errMsgList.add("指标或指标条件不能为空");
                            break;
                        }
                    }
                    branch = exprArr[1].trim();
                }
                if (branchs.get(branch) == null) {
                    branchs.put(branch, 1);
                } else {
                    errMsgList.add("分支名称不能重复");
                    break;
                }
            }
        }
    }

    /**
     * 校验触发器同时满足的条件
     */
    private void validateTriggerAdditionExpr(TriggerNodeDefinition triggerNodeDef, List<String> errMsgList) {
        List<String> additionExprs = triggerNodeDef.getAdditionExpression();
        if (additionExprs != null && !additionExprs.isEmpty()) {
            for (String expression : additionExprs) {
                if (StringUtils.isNotEmpty(expression) && expression.contains("undefined")) {
                    errMsgList.add("同时满足条件不完整");
                    return;
                }
            }
        }
    }

    /**
     * 校验触发器检测时间, 监测类型
     */
    private void validateTriggerMonitorTime(TriggerNodeDefinition triggerNodeDef, List<String> errMsgList) {
        if (triggerNodeDef.getMonitorType() == null || !NODE_MONITOR_TYPE_LIST.contains(triggerNodeDef.getMonitorType())) {
            errMsgList.add("错误的监测类型");
        } else {
            boolean isLessThanHour = NODE_MONITOR_TYPE_LESS_THAN_HOUR == triggerNodeDef.getMonitorType();
            if (NODE_MONITOR_TYPE_TIME_FRAME == triggerNodeDef.getMonitorType()) {
                if (triggerNodeDef.getStartTime() == null || triggerNodeDef.getEndTime() == null) {
                    errMsgList.add("未选择监测开始和结束时间");
                }
            } else if (isLessThanHour && triggerNodeDef.getLessThanHour() == null) {
                errMsgList.add("未填写距到达上一节点的小时数");
            }
        }
    }

}

