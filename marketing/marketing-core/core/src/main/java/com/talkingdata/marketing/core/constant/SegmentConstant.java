package com.talkingdata.marketing.core.constant;

/**
 * Segment常量类
 * @author xiaoming.kang
 */
public class SegmentConstant {

    public static class ContentType {
        public final static String LOCAL = "1";
        public final static String REMOTE = "2";
    }

    public static class SegmentStatusConstant{

        /**
         * 草稿
         */
        public final static int SEGMENT_STATUS_DRAFT = 1;
        /**
         * 等待开始
         */
        public final static int SEGMENT_STATUS_WAITING = 2;
        /**
         * 进行中
         */
        public final static int SEGMENT_STATUS_PROGRESS = 3;
        /**
         * 已暂停
         */
        public final static int SEGMENT_STATUS_PAUSE = 4;
        /**
         * 循环中
         */
        public final static int SEGMENT_STATUS_LOOP = 5;
        /**
         * 已结束
         */
        public final static int SEGMENT_STATUS_FINISH = 6;
        /**
         * 失败
         */
        public final static int SEGMENT_STATUS_FAIL = 7;

        /**
         * 已删除
         */
        public final static int SEGMENT_STATUS_DELETE = -1;

    }

    /**
     * 投放单元，投放前是否更新人群类型
     * @author tao.yang
     */
    public static class SegmentCrowdUpdateTypeConstants {

        /**
         * 投放前人群不更新
         */
        public final static int SEGMENT_CROWD_NOT_UPDATED = 0;

        /**
         * 投放前人群更新
         */
        public final static int SEGMENT_CROWD_UPDATED = 1;

    }
}
