package com.talkingdata.marketing.core.constant;

import java.util.Arrays;
import java.util.List;

/**
 * Pipeline常量类
 *
 * @author tao.yang
 * @date 2018-02-08
 * Copyright(C) 2018 Beijing TendCloud TianXia Technology Co., Ltd.
 */
public class PipelineConstants {

    /**
     * Pipeline入口人群计算频率常量类
     */
    public static class PipelineEntranceNodeCalcType {
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
         * 类型集合
         */
        public final static List<Integer> NODE_CALC_TYPE_LIST = Arrays.asList(NODE_CALC_TYPE_NEVER, NODE_CALC_TYPE_REALTIME, NODE_CALC_TYPE_CYCLE);
    }

    /**
     * Pipeline计算器类型常量
     */
    public static class PipelineHourMeterNodeTypeConstants {

        /**
         * 目标计时器
         */
        public final static int NODE_HOUR_METER_TYPE_TARGET = 1;

        /**
         * 经时计时器
         */
        public final static int NODE_HOUR_METER_TYPE_TIME = 2;

        /**
         * 计时器类型常量集合
         */
        public final static List<Integer> NODE_HOUR_METER_TYPE_LIST = Arrays.asList(NODE_HOUR_METER_TYPE_TARGET, NODE_HOUR_METER_TYPE_TIME);
    }

    /**
     * 营销流程触发器节点监测类型类型常量
     */
    public static class PipelineTrggerNodeMonitorTypeConstants {

        /**
         * 时间范围
         */
        public final static int NODE_MONITOR_TYPE_TIME_FRAME = 1;

        /**
         * 到达上一节点xx小时内
         */
        public final static int NODE_MONITOR_TYPE_LESS_THAN_HOUR = 2;

        /**
         * 监测类型集合
         */
        public final static List<Integer> NODE_MONITOR_TYPE_LIST = Arrays.asList(NODE_MONITOR_TYPE_TIME_FRAME, NODE_MONITOR_TYPE_LESS_THAN_HOUR);
    }

}

