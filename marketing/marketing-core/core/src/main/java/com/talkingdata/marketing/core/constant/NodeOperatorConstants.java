package com.talkingdata.marketing.core.constant;

import java.util.Arrays;
import java.util.List;

import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType.CROWD_TYPE_ACCURATE_FILE;
import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType.CROWD_TYPE_ACCURATE_HISTORY;
import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType.CROWD_TYPE_LOOKLIKE;
import static com.talkingdata.marketing.core.constant.CrowdConstants.CrowdType.CROWD_TYPE_SCENE;

/**
 * @author chunyan.ji
 * @create 2018-02-08
 * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
 * @since JDK 1.8
 */
public class NodeOperatorConstants {
    /**
     * 分支触发类型
     *
     * @author chunyan.ji
     * @date 2018-02-08
     */
    public final static class BranchTypeConstants {
        /**
         * 分支类型 单分支触发
         */
        public final static int NODE_BRANCH_TYPE_SINGLE = 1;
        /**
         * 分支类型 多分支触发
         */
        public final static int NODE_BRANCH_TYPE_MULTIPLE = 2;
        /**
         * 分支触发类型列表.
         */
        public final static List<Integer> NODE_BRANCH_TYPE_LIST = Arrays.asList(NODE_BRANCH_TYPE_SINGLE, NODE_BRANCH_TYPE_MULTIPLE);
    }

    /**
     * 触发类型
     *
     * @author chunyan.ji
     * @date 2018-02-08
     */
    public final static class TriggerTypeConstants {
        /**
         * 触发类型：事件
         */
        public final static String TRIGGER_TYPE_EVENT = "event";
        /**
         * 触发类型：指标
         */
        public final static String TRIGGER_TYPE_TARGET = "target";
        /**
         * 触发类型列表.
         */
        public final static List<String> TRIGGER_TYPE_LIST = Arrays.asList(TRIGGER_TYPE_EVENT, TRIGGER_TYPE_TARGET);
    }

    /**
     * 投放时间类型
     *
     * @author chunyan.ji
     * @date 2018-02-08
     */
    public final static class PutTriggerTypeConstants {
        /**
         * 投放时间类型 立即 1
         */
        public final static int PUT_TRIGGER_TYPE_NOW = 1;
        /**
         * 投放时间类型 定时 2
         */
        public final static int PUT_TRIGGER_TYPE_TIME = 2;
        /**
         * 投放时间类型 循环 3
         */
        public final static int PUT_TRIGGER_TYPE_LOOP = 3;
        /**
         * 投放触发类型列表
         */
        public final static List<Integer> PUT_TRIGGER_TYPE_LIST = Arrays.asList(PUT_TRIGGER_TYPE_NOW, PUT_TRIGGER_TYPE_TIME, PUT_TRIGGER_TYPE_LOOP);
    }

    /**
     * 监控时间常量
     *
     * @author chunyan.ji
     * @date 2018-02-08
     */
    public final static class MonitorTypeConstants {
        /**
         * 时间范围
         */
        public final static int NODE_MONITOR_TYPE_TIME_FRAME = 1;
        /**
         * 到达上一节点xx小时内
         */
        public final static int NODE_MONITOR_TYPE_LESS_THAN_HOUR = 2;
        /**
         * 监控时间范围列表
         */
        public final static List<Integer> NODE_MONITOR_TYPE_LIST = Arrays.asList(NODE_MONITOR_TYPE_TIME_FRAME, NODE_MONITOR_TYPE_LESS_THAN_HOUR);
    }

    /**
     * 分流类型
     *
     * @author chunyan.ji
     * @date 2018-02-08
     */
    public final static class SplitTypeConstants {
        /**
         * 分流类型 人数
         */
        public final static int NODE_SPLIT_TYPE_CROWD_NUMBER = 1;
        /**
         * 分流类型    占比
         */
        public final static int NODE_SPLIT_TYPE_PERCENT = 2;
        /**
         * 分流类型   维度
         */
        public final static int NODE_SPLIT_TYPE_DIMENSION = 3;
        /**
         * 分流类型列表.
         */
        public final static List<Integer> NODE_SPLIT_TYPE_LIST = Arrays.asList(NODE_SPLIT_TYPE_CROWD_NUMBER, NODE_SPLIT_TYPE_PERCENT, NODE_SPLIT_TYPE_DIMENSION);
    }

    /**
     * 计时器类型
     *
     * @author chunyan.ji
     * @date 2018-02-08
     */
    public final static class HourMeterTypeConstants {
        /**
         * 目标计时器
         */
        public final static int NODE_HOUR_METER_TYPE_TARGET = 1;
        /**
         * 经时计时器
         */
        public final static int NODE_HOUR_METER_TYPE_TIME = 2;
        /**
         * 计时器列表.
         */
        public final static List<Integer> NODE_HOUR_METER_TYPE_LIST = Arrays.asList(NODE_HOUR_METER_TYPE_TARGET, NODE_HOUR_METER_TYPE_TIME);
    }

    /**
     * 人群计算频率
     *
     * @author chunyan.ji
     * @date 2018-02-08
     */
    public final static class CalcType {
        /**
         * 永不
         */
        public final static int NODE_CALC_TYPE_NEVER = 1;
        /**
         * 实时
         */
        public final static int NODE_CALC_TYPE_REALTIME = 2;
        /**
         * 周期性
         */
        public final static int NODE_CALC_TYPE_CYCLE = 3;
        /**
         * 计算类型列表.
         */
        public final static List<Integer> NODE_CALC_TYPE_LIST = Arrays.asList(NODE_CALC_TYPE_NEVER, NODE_CALC_TYPE_REALTIME, NODE_CALC_TYPE_CYCLE);
        /**
         * 人群类型列表.
         */
        public final static List<Integer> NODE_CROWD_TYPE_LIST =
                Arrays.asList(CROWD_TYPE_LOOKLIKE,CROWD_TYPE_SCENE,CROWD_TYPE_ACCURATE_HISTORY,CROWD_TYPE_ACCURATE_FILE);
    }

}