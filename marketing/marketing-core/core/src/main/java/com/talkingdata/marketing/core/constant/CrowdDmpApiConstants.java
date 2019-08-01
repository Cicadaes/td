package com.talkingdata.marketing.core.constant;/**
 * Created by yangtao on 2018/2/26.
 */

/**
 * @author tao.yang
 * @date 2018-02-26
 */
public class CrowdDmpApiConstants {

    /**
     * 计算平台getCrowdInfo返回的计算状态常量类
     */
    public static class CrowdDmpCalcRecordStatusConstants {
        /**
         * 任务计算状态：0，未计算
         */
        public static final int CALC_STATUS_PENDING = 0;

        /**
         * 任务计算状态：1，计算中
         */
        public static final int CALC_STATUS_RUNNING = 1;

        /**
         * 任务计算状态：2,计算完成
         */
        public static final int CALC_STATUS_FINISHED = 2;

        /**
         * 任务计算状态：3,终止中
         */
        public static final int CALC_STATUS_STOPING = 3;

        /**
         * 任务计算状态：4,被终止
         */
        public static final int CALC_STATUS_STOPED = 4;

        /**
         * 任务计算状态：5,无需执行
         */
        public static final int CALC_STATUS_SKIPPED = 5;

        /**
         * 任务计算状态：6,重试中
         */
        public static final int CALC_STATUS_RETRYING = 6;

        /**
         * 任务计算状态：-1,计算异常
         */
        public static final int CALC_STATUS_EXCEPTION = -1;

        /**
         * 任务计算状态：-2，计算超时
         */
        public static final int CALC_STATUS_TIMEOUT = -2;

        /**
         * 任务计算状态：-3，待计算
         */
        public static final int CALC_STATUS_TORELAUNCH = -3;

        /**
         * 任务计算状态：-4，重新计算
         */
        public static final int CALC_STATUS_RELAUNCH = -4;
    }

    /**
     * 人群计算API重新计算接口状态常量
     */
    public class CrowdDmpApiRestartStatusConstants {

        /**
         * 成功
         */
        public static final int SUCCESS = 1;

        /**
         * 运行中,包括三种状态,
         * 人群正在计算中
         * 人群正在重试中(即用户已经点击重试,但还未开始计算)
         * 人群正在终止中(即用户已经点击终止,但还未终止,任务正在运行中)
         */
        public static final int RUNNING = -1;

        /**
         * 调用重新计算已经删除的人群
         */
        public static final int CROWD_DETETE = -2;

        /**
         * 重新计算异常
         */
        public static final int EXCEPTION = -3;

    }

}
