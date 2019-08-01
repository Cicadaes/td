package com.talkingdata.marketing.core.constant;

/**
 * 系统Job常量类
 *
 * @author xiaoming.kang
 */
public class SysJobConfigConstants {

    /**
     * job配置中触发类型常量
     *
     * @author tao.yang
     */
    public static class SysJobConfigTriggerTypeConstants {

        /**
         * 简单触发,即使用周期性调度
         */
        public final static String JOB_TRIGGER_TYPE_SIMPLE = "S";

        /**
         * 复杂出发，即使用crontab配置进行触发
         */
        public final static String JOB_TRIGGER_TYPE_CRON = "C";

    }

    /**
     * The type Status.
     */
    public static class SysJobConfigStatusConstants {
        /**
         * The constant VALID.
         */
        public static final int VALID = 1;
        /**
         * The constant INVALID.
         */
        public static final int INVALID = 0;

    }

}
