package com.talkingdata.marketing.core.constant;

/**
 * Segment计算对象常量类
 * 数据库发现的值只有-1,0,4 和 NULL(没有值)
 * @author xiaoming.kang
 */
public class SegmentTaskCalcObjectRecordConstant {
    /**
     * The type Status.
     */
    public static class Status{
        /**
         * The constant FAIL.
         */
        public final static Integer FAIL = -1;
        /**
         * The constant WAITING.
         */
        public final static Integer WAITING = 0;
        /**
         * The constant PROGRESS.
         */
        public final static Integer PROGRESS = 1;
        /**
         * The constant SEGMENT_CALC_DOWNLOAD.原来在Constant里面 //TODO  看看是不是需要删除？
         */
        public final static int SEGMENT_CALC_DOWNLOAD = 2;
        /**
         * The constant SEGMENT_CALC_ALREADY_LAUNCH_TASK.原来在Constant里面  //TODO  看看是不是需要删除
         */
        public final static int SEGMENT_CALC_ALREADY_LAUNCH_TASK = 3;
        /**
         * The constant FINISH. 原值2
         */
        public final static Integer FINISH = 4;
    }

    public static class Type{
        /**
         * The constant SEGMENT_CALC_TYPE_SEND.
         */
        public final static int SEGMENT_CALC_TYPE_SEND = 1;
        /**
         * The constant SEGMENT_CALC_TYPE_STAT.
         */
        public final static int SEGMENT_CALC_TYPE_STAT = 2;

    }
}
