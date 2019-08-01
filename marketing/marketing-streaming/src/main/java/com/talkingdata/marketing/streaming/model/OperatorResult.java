package com.talkingdata.marketing.streaming.model;

import java.util.List;

/**
 * 算子执行完后的状态
 * 用于判断是否继续写eventPackage依据
 * 用于触发器和计时器校验是否到时间触发或停止计时
 *
 * @author Created by tend on 2017/10/31.
 */
public class OperatorResult {

    /**
     * 小于开始时间
     */
    public static final Integer LESS_THAN_STATUS = 1;
    /**
     * 时间区间内
     */
    private static final Integer BETWEEN_AND_STATUS = 2;
    /**
     * 大于结束时间
     */
    public static final Integer GREATER_THAN_STATUS = 3;
    /**
     * 不满足算子执行条件
     */
    private static final Integer DISSATISFY_STATUS = 4;
    /**
     * 算子执行完毕
     */
    public static final Integer COMPLETED_STATUS = 5;

    /**
     * 算子执行完状态
     */
    private Integer status;
    /**
     * 开始触发时间或停止计时时间
     */
    private String untilTime;
    /**
     * 上次暂停,stage中已经处理过的NodeId,暂停完毕执行过的不在执行,例：执行到计时器或触发器需要暂停等待触发
     */
    private List<String> lastProcessedNodeIds;
    /**
     * 上个stage,算子所走的分支,需要根据分支信息计算下个stage中那些能执行那些不能执行
     */
    private List<String> lastBranchEdgeIds;

    private List<ExecutorResultData> resultData;

    private OperatorResult(Integer status) {
        this.status = status;
    }

    private OperatorResult(Integer status, String untilTime) {
        this.status = status;
        this.untilTime = untilTime;
    }

    private OperatorResult(Integer status, String untilTime, List<String> nodeIds) {
        this.status = status;
        this.untilTime = untilTime;
        this.lastProcessedNodeIds = nodeIds;
    }

    public static OperatorResult lessThanResult(String untilTime) {
        return new OperatorResult(LESS_THAN_STATUS, untilTime);
    }

    public static OperatorResult lessThanResultNodeId(String untilTime, List<String> nodeIds) {
        return new OperatorResult(LESS_THAN_STATUS, untilTime, nodeIds);
    }

    public static OperatorResult betweenAndResult(String untilTime) {
        return new OperatorResult(BETWEEN_AND_STATUS, untilTime);
    }

    public static OperatorResult greaterThanResult(String untilTime) {
        return new OperatorResult(GREATER_THAN_STATUS, untilTime);
    }

    public static OperatorResult dissatisfyResult() {
        return new OperatorResult(DISSATISFY_STATUS);
    }

    public static OperatorResult completedResult() {
        return new OperatorResult(COMPLETED_STATUS);
    }

    public Integer getStatus() {
        return status;
    }

    public String getUntilTime() {
        return untilTime;
    }

    public void setUntilTime(String untilTime) {
        this.untilTime = untilTime;
    }

    public List<String> getLastProcessedNodeIds() {
        return lastProcessedNodeIds;
    }

    public OperatorResult setLastProcessedNodeIds(List<String> lastProcessedNodeIds) {
        this.lastProcessedNodeIds = lastProcessedNodeIds;
        return this;
    }

    public List<String> getLastBranchEdgeIds() {
        return lastBranchEdgeIds;
    }

    public OperatorResult setLastBranchEdgeIds(List<String> lastBranchEdgeIds) {
        this.lastBranchEdgeIds = lastBranchEdgeIds;
        return this;
    }

    public List<ExecutorResultData> getResultData() {
        return resultData;
    }

    public OperatorResult setResultData(List<ExecutorResultData> resultData) {
        this.resultData = resultData;
        return this;
    }

    @Override
    public String toString() {
        return "OperatorResult{" +
                "status=" + status +
                ", untilTime=" + untilTime +
                '}';
    }
}
