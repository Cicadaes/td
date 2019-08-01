package com.talkingdata.marketing.core.constant;

/**
 * @author tao.yang
 * @date 2018-02-07
 */
public class TriggerConstants {

    /**
     * 触发类型
     */
    public final static class TriggerTypeConstants {
        /**
         * 立即调度
         */
        public final static int NOW = 1;

        /**
         * 定时调度
         */
        public final static int APPOINTEDTIME = 2;

        /**
         * 循环调度
         */
        public final static int LOOP = 3;
    }

    /**
     * 子触发类型
     *
     * @author tao.yang
     * @date 2018-02-07
     */
    public final static class SubTriggerTypeConstants {
        /**
         * 分钟
         */
        public final static int MINUTE = 1;
        /**
         * 小时
         */
        public final static int HOUR = 2;
        /**
         * 每天
         */
        public final static int DAY = 3;
        /**
         * 每周
         */
        public final static int WEEK = 4;
        /**
         * 每月
         */
        public final static int MONTH = 5;
    }
}
