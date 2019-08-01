package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.cache.EhcacheService;
import com.talkingdata.marketing.streaming.model.PipelineDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.AbstractNodeDefinition;
import com.talkingdata.marketing.streaming.pipeline.exception.CrowdNotMatchException;
import com.talkingdata.marketing.streaming.pipeline.exception.NodeOperatorException;
import com.talkingdata.marketing.streaming.pipeline.definition.PipelineDiagram;
import com.talkingdata.marketing.streaming.pipeline.definition.node.Branch;
import com.talkingdata.marketing.streaming.pipeline.definition.node.EdgeDefinition;
import com.talkingdata.marketing.streaming.pipeline.definition.node.SplitNodeDefinition;
import com.talkingdata.marketing.streaming.util.JsonUtil;
import com.tendcloud.tenddata.entity.EventPackage;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.RandomUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

/**
 * 分流算子
 *
 * @author hongsheng
 * @create 2017-09-27-下午6:07
 * @since JDK 1.8
 */
@Component
public class SplitNodeOperator extends AbstractOperator {

    private static final Logger logger = LoggerFactory.getLogger(SplitNodeOperator.class);
    /**
     * 人数设置下限类型
     */
    private static final int NUMBER_BRANCH_LOWER_LIMIT = 0;
    /**
     * 人数设置上限类型
     */
    private static final int NUMBER_BRANCH_UPPER_LIMIT = 1;
    /**
     * 占比总和值
     */
    private static final int PERCENT_BRANCH_SUM_VALUE = 100;

    @Autowired
    private EhcacheService ehcacheService;

    /**
     * 根据分流类型按不同的计算方式获取当前用户应该走哪个分支
     *  类型分为：人数、占比和维度
     *
     * @param pipelineDefinition pipeline数据
     * @param nodeDefinition 当前执行的具体算子
     * @param eventPackage 用户的属性、行为等数据
     * @return 返回分支的线
     * @throws CrowdNotMatchException 如果eventpackage人群id与算子人群id不符，抛出此异常
     */
    @Override
    public EdgeDefinition executor(PipelineDefinition pipelineDefinition, AbstractNodeDefinition nodeDefinition,
                                   EventPackage eventPackage) throws NodeOperatorException, CrowdNotMatchException {
        validateCrowdIsMatch(pipelineDefinition, eventPackage, nodeDefinition);
        SplitNodeDefinition splitNodeDefinition = null;
        if (nodeDefinition instanceof SplitNodeDefinition) {
            splitNodeDefinition = (SplitNodeDefinition) nodeDefinition;
        } else {
            throw new NodeOperatorException("Illegal Param Node Definition");
        }

        Long currentBranchStatus = initBranchStatus(pipelineDefinition, splitNodeDefinition);
        String branchName = "";
        switch (splitNodeDefinition.getSplitType()) {
            case SplitNodeDefinition.NODE_SPLIT_TYPE_NUMBER : branchName = splitByNumber(splitNodeDefinition, currentBranchStatus, pipelineDefinition);
            break;
            case SplitNodeDefinition.NODE_SPLIT_TYPE_PERCENT : branchName = splitByPercent(splitNodeDefinition, currentBranchStatus);
            break;
            case SplitNodeDefinition.NODE_SPLIT_TYPE_DIMENSION : branchName = splitByDimension(splitNodeDefinition, eventPackage);
            break;
            default : throw new NodeOperatorException("Illegal Param Split Type");
        }
        if (StringUtils.isBlank(branchName)) {
            return null;
        }
        return findEdgeDefinition(pipelineDefinition, splitNodeDefinition, branchName);
    }

    /**
     * debug的逻辑，随机分流
     *
     * @param pipelineDefinition pipeline数据
     * @param nodeDefinition     当前执行的具体算子
     * @param eventPackage       用户的属性、行为等数据
     * @throws NodeOperatorException NodeOperatorException
     * @throws CrowdNotMatchException 如果eventpackage人群id与算子人群id不符，抛出此异常
     */
    @Override
    public EdgeDefinition debug(PipelineDefinition pipelineDefinition, AbstractNodeDefinition nodeDefinition, EventPackage eventPackage)
            throws NodeOperatorException, CrowdNotMatchException {
        SplitNodeDefinition splitNodeDefinition;
        if (nodeDefinition instanceof SplitNodeDefinition) {
            splitNodeDefinition = (SplitNodeDefinition) nodeDefinition;
        } else {
            throw new NodeOperatorException("Illegal Param Node Definition");
        }
        List<Branch> branchList = splitNodeDefinition.getBranchList();
        int index = RandomUtils.nextInt(0, branchList.size());
        Branch branch = branchList.get(index);
        return findEdgeDefinition(pipelineDefinition, splitNodeDefinition, branch.getName());
    }

    private EdgeDefinition findEdgeDefinition(PipelineDefinition pipelineDefinition, SplitNodeDefinition splitNodeDefinition,
                                              String branchName) throws NodeOperatorException {
        PipelineDiagram pipelineDiagram;
        try {
            pipelineDiagram = JsonUtil.toObject(pipelineDefinition.getDiagram(), PipelineDiagram.class);
        } catch (IOException e) {
            logger.error("解析pipelineDiagram失败", e);
            throw new NodeOperatorException("解析失败");
        }
        for (EdgeDefinition edgeDefinition : pipelineDiagram.findBySourceNodeId(splitNodeDefinition.getId())) {
            if (branchName.equalsIgnoreCase(edgeDefinition.getExpression())) {
                return edgeDefinition;
            }
        }
        return null;
    }

    /**
     * 初始化当前分支状态值
     *   -获取缓存中上一次分支状态值
     *   -加1计算出当前分支状态值，并更新缓存值
     *
     * @param pipelineDefinition 营销流程数据
     * @param splitNodeDefinition 分流器数据
     * @return
     */
    private Long initBranchStatus(PipelineDefinition pipelineDefinition, SplitNodeDefinition splitNodeDefinition) {
        Long lastTimeBranchStatus = ehcacheService.findPipelineSplitBranchStatus(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(),
            pipelineDefinition.getVersion(), splitNodeDefinition.getId());
        Long currentBranchStatus = lastTimeBranchStatus == null ? 0 : ++lastTimeBranchStatus;
        ehcacheService.savePipelineSplitBranchStatus(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), pipelineDefinition.getVersion(),
            splitNodeDefinition.getId(), currentBranchStatus);
        return currentBranchStatus;
    }

    /**
     * 按维度计算分支
     *  规则：进入用户拥有设置的维度则进入对应的分支
     * @param splitNodeDefinition 分流器数据
     * @param eventPackage 用户的属性、行为等数据
     * @return
     */
    private String splitByDimension(SplitNodeDefinition splitNodeDefinition, EventPackage eventPackage) {
        Map<String, Object> profileMap = eventPackage.userProfile.profileMap;
        Object option = profileMap.get(splitNodeDefinition.getDimensionCode());
        if (option != null) {
            for (Branch branch : splitNodeDefinition.getBranchList()) {
                if (option.equals(branch.getOptionCode())) {
                    return branch.getName();
                }
            }
        }
        return null;
    }

    /**
     * 按占比计算分支
     *  规则：1.按百分数的数值进入
     *       2.采用轮循方式进入分支
     *       3.直到不再进入分流器才停止
     *  实现：采用状态值取余的方式，计算余数在哪个占比中即可。
     * @param splitNodeDefinition 分流器数据
     * @param branchStatus 状态值
     * @return
     */
    private String splitByPercent(SplitNodeDefinition splitNodeDefinition, Long branchStatus) {
        sortBranchByName(splitNodeDefinition);
        int count = splitNodeDefinition.getCount();
        Long remainder = branchStatus % PERCENT_BRANCH_SUM_VALUE;
        List<Branch> branches = splitNodeDefinition.getBranchList();
        int index = 0;
        while (index < splitNodeDefinition.getCount()) {
            Branch branch = branches.get(index);
            if (index == 0){
                if (remainder <= branch.getPercent()) {
                    return branch.getName();
                }
            } else if (index == count - 1) {
                if (remainder > calcCurrentLowerPercent(index, branches)) {
                    return branch.getName();
                }
            } else {
                if (remainder > calcCurrentLowerPercent(index, branches) && remainder <= calcCurrentUpperPercent(index, branches)) {
                    return branch.getName();
                }
            }
            index++;
        }
        return null;
    }

    /**
     * 计算当前分支占比在整体分支占比中区间的最小值(不包含)
     * @param index
     * @param branches
     * @return
     */
    private int calcCurrentLowerPercent(int index, List<Branch> branches) {
        int lowerPercent = 0;
        int n = 0;
        while (n < index) {
            lowerPercent += branches.get(n++).getPercent();
        }
        return lowerPercent;
    }

    /**
     * 计算当前分支占比在整体分支占比中区间的最大值(包含)
     * @param index
     * @param branches
     * @return
     */
    private int calcCurrentUpperPercent(int index, List<Branch> branches) {
        int upperPercent = 0;
        upperPercent += calcCurrentLowerPercent(index, branches);
        upperPercent += branches.get(index).getPercent();
        return upperPercent;
    }

    /**
     * 按人数计算分支
     *  规则：1.优先满足每个分支区间的下限，再满足上限(未设置下限或上限则不进入该分支)
     *       2.采用轮循方式进入分支
     *       3.全部分支上限满足后不再进入分支
     *  实现：采用状态值取余的方式，得出应该在哪个分支中，再依据上、下限判断应该在走哪个分支。
     *       注意上限与下限是分开计算，都是从1开始。
     * @param splitNodeDefinition 分流器数据
     * @param branchStatus 状态值
     * @param pipelineDefinition pipeline数据
     * @return
     */
    private String splitByNumber(SplitNodeDefinition splitNodeDefinition, Long branchStatus, PipelineDefinition pipelineDefinition) {
        sortBranchByName(splitNodeDefinition);
        List<Branch> branches = splitNodeDefinition.getBranchList();
        Long sumMin = calcMinSum(branches);
        Long sumMax = calcMaxSum(branches);
        if (branchStatus > (sumMin + sumMax)) {
            logger.info("当前分流器[{}-{}]分支资源分配结束", splitNodeDefinition.getName(), splitNodeDefinition.getId());
            return null;
        }

        //获取上次计算的分支值
        Integer lastTimeIndex = ehcacheService.findPipelineSplitLastTimeBranchResult(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(),
            pipelineDefinition.getVersion(), splitNodeDefinition.getId());
        int index;
        // 下限
        if (sumMin >= branchStatus) {
            index = calcBranch(splitNodeDefinition.getCount(), branchStatus, branches, NUMBER_BRANCH_LOWER_LIMIT, lastTimeIndex);
        } else {
            // 上限
            index = calcBranch(splitNodeDefinition.getCount(), branchStatus - sumMin , branches, NUMBER_BRANCH_UPPER_LIMIT, lastTimeIndex);
        }
        // 更新缓存
        ehcacheService.savePipelineSplitLastTimeBranchResult(pipelineDefinition.getCampaignId(), pipelineDefinition.getId(), pipelineDefinition.getVersion(),
            splitNodeDefinition.getId(), index);

        return branches.get(index - 1).getName();
    }

    /**
     * 根据条件计算出当前状态值应该走哪个分支
     * @param count 分支数
     * @param branchStatus 状态值
     * @param branches 分支数据
     * @param limitType 限制类型
     * @param lastTimeIndex 上次计算结果
     * @return 返回分支顺序值，注意不是在集合中的下标，减去1才为集合中的下标值
     */
    private Integer calcBranch(Integer count, Long branchStatus, final List<Branch> branches, int limitType, Integer lastTimeIndex) {
        Long merchant = branchStatus / count;
        int remainder = (int) (branchStatus % count);
        int index = remainder == 0 ? count : remainder;
        Branch branch = branches.get(index - 1);
        Long limit = calcLimit(limitType, branch);
        index = calcLegalIndex(merchant, limit, index, count, branch, branches, limitType);

        if (lastTimeIndex != null) {
            if (lastTimeIndex == index) {
                index = initIndex(index, count);
                branch = branches.get(index - 1);
                limit = calcLimit(limitType, branch);
                index = calcLegalIndex(merchant, limit, index, count, branch, branches, limitType);
            }
        }
        return index;
    }

    /**
     * 计算出合法的index值
     * @param merchant
     * @param limit
     * @param index
     * @param count
     * @param branch
     * @param branches
     * @param limitType
     * @return
     */
    public int calcLegalIndex(Long merchant, Long limit, int index, int count, Branch branch, final List<Branch> branches, int limitType) {
        while ((merchant + 1) > limit) {
            index = initIndex(index, count);
            branch = branches.get(index - 1);
            limit = calcLimit(limitType, branch);
        }
        return index;
    }

    /**
     * 初始化index
     *    当index等于分支数是需要重新重分支一开始
     * @param index
     * @param count
     * @return
     */
    private int initIndex(int index, int count) {
        return index == count ? 1 : ++index;
    }

    /**
     * 计算人数类型限制值，分为下限与上限
     * @param limitType 限制类型
     * @param branch 分支数据
     * @return
     */
    private Long calcLimit(int limitType, Branch branch) {
        return limitType == 0 ? branch.getMin() : branch.getMax();
    }

    /**
     * 计算分支中上限和
     * @param branches
     * @return
     */
    private Long calcMaxSum(List<Branch> branches) {
        Long sum = 0L;
        for (Branch branch : branches) {
            sum += branch.getMax();
        }
        return sum;
    }

    /**
     * 计算分支中下限和
     * @param branches
     * @return
     */
    private Long calcMinSum(List<Branch> branches) {
        Long sum = 0L;
        for (Branch branch : branches) {
            sum += branch.getMin();
        }
        return sum;
    }

    /**
     * 按名称排序分支，只适用人数、占比2种类型
     * @param splitNodeDefinition 分流器数据
     */
    private void sortBranchByName(SplitNodeDefinition splitNodeDefinition) {
        Collections.sort(splitNodeDefinition.getBranchList(), Comparator.comparingInt(o -> o.getName().charAt(0)));
    }
}
