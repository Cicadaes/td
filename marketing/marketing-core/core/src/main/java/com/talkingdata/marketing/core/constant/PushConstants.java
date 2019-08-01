package com.talkingdata.marketing.core.constant;


/**
 * push常量类,最好不要使用，以后会清除掉
 * @author tao.yang
 */
public class PushConstants {

    /**
     * The constant PUSH_SENT.
     */
    public final static String PUSH_SENT = "sent";
    /**
     * The constant PUSH_CLICK.
     */
    public final static String PUSH_CLICK = "click";
    /**
     * The constant PUSH_ARRIVALED.
     */
    public final static String PUSH_ARRIVALED = "arrivaled";
    /**
     * The constant PUSH_IMPRESSIONS.
     */
    public final static String PUSH_IMPRESSIONS = "impressions";

    /**
     * push 日志名称
     */
    public final static String PUSH_LOG_TABLE = "td_push_log";

    /**
     *
     */
    public final static Integer PUSH_STAT_HOUR_RANGE = 8;

    /**
     * The constant EVENT_TYPE_ARRAY.
     */
    public final static String[] EVENT_TYPE_ARRAY = new String[] {PUSH_SENT, PUSH_CLICK, PUSH_ARRIVALED, PUSH_IMPRESSIONS};

    /**
     * The constant PUSH_WITH_SILENCE.
     */
    public final static int PUSH_WITH_SILENCE = 0;
    /**
     * The constant PUSH_OPEN_WITH_APP.
     */
    public final static int PUSH_OPEN_WITH_APP = 2;

    /**
     * The type Gateway accurate constant.
     */
    public static class GatewayAccurateConstant {
        /**
         * The constant GATEWAY_ACCURATE_INPUT.
         */
        public final static int GATEWAY_ACCURATE_INPUT = 3;
        /**
         * The constant GATEWAY_ACCURATE_JSON.
         */
        public final static int GATEWAY_ACCURATE_JSON = 7;
    }

    /**
     * The type Gateway source constant.
     */
    public static class GatewaySourceConstant {
        /**
         * The constant MARKETING_PUSH_SOURCE.
         */
        public final static String MARKETING_PUSH_SOURCE = "app";
    }
}
