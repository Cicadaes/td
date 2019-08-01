package com.talkingdata.marketing.core.constant;

import java.util.Arrays;
import java.util.List;

/**
 *
 * @author xiaoming.kang
 * @date 2018/01/17
 */
public class CrowdConstants {

    public static class CrowdType{
        /**
         * Lookalike人群
         */
        public static final int CROWD_TYPE_LOOKLIKE =1;
        /**
         * 场景人群（pipeline精细化人群）
         */
        public static final int CROWD_TYPE_SCENE =2;
        /**
         * 历史人群（投放精细化已有人群、pipeline用户运营人群）
         */
        public static final int CROWD_TYPE_ACCURATE_HISTORY = 3;
        /**
         * 一方人群
         */
        public static final int CROWD_TYPE_ACCURATE_FILE = 4;
        /**
         * 子人群
         */
        public static final int CROWD_TYPE_SUB_CROWD = 5;

        /**
         * 人群类型集合
         */
        public final static List<Integer> NODE_CROWD_TYPE_LIST =
            Arrays.asList(CROWD_TYPE_LOOKLIKE,CROWD_TYPE_SCENE,CROWD_TYPE_ACCURATE_HISTORY,CROWD_TYPE_ACCURATE_FILE);
    }

    /**
     * 对应用户管家状态
     */
    public static class CrowdStatus{

        /**
         * 未开始      //TODO 人群管家可能没有这个状态
         */
        public static final int STATUS_NOT_START = 0;

        /**
         * 未生效
         */
        public static final int STATUS_INEFFECTIVE = 1;
        /**
         * 已生效
         */
        public static final int STATUS_EFFECTIVE = 2;
        /**
         * 已删除或禁用
         */
        public static final int STATUS_DELETE = -1;
    }

    public static class CrowdCalcStatus{
        /**
         * 异常
         */
        public static final int STATUS_UNUSUAL = -1;
        /**
         * 未开始
         */
        public static final int STATUS_NOT_START = 0;
        /**
         * 进行中
         */
        public static final int STATUS_IN_PROGRESS =1;
        /**
         * 已完成
         */
        public static final int STATUS_FINISH = 2;
        /**
         * 已删除
         */
        public static final int STATUS_DELETE = 100;

    }

    /**
     * crowd批量处理操作符
     *
     * @author chunyan.ji
     * @date 2018-02-08
     */
    public static class CrowdCalcOutputOperator {
        /**
         * Crowd输出分隔符.
         */
        public static final String SEPARATER = ",";
        /**
         * Crowd批量输出分割符.
         */
        public static final String BETCH_COUNT_OUTPUT_FORMAT_SEPARATOR = "\t";
        /**
         * Crowd批量输出换行符.
         */
        public static final String BETCH_COUNT_OUTPUT_FORMAT_LINE_BREAK = "\n";
    }

}
