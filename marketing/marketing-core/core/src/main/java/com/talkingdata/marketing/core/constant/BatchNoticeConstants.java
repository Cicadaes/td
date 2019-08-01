package com.talkingdata.marketing.core.constant;

/**
 * 营销流程批处推送常量类
 *
 * @author tao.yang
 * @date 2018-02-07
 */
public class BatchNoticeConstants {

    /**
     * 营销流程批处理ETL任务类型
     *
     * @author sheng.hong
     * @date 2018-02-08
     */
    public static class BatchNoticeEtlJobTypeConstants {
        /**
         * 人群信息计算任务
         */
        public static final String TYPE_CROWD = "crowd";
        /**
         * push通知任务
         */
        public static final String TYPE_NOTICE_PUSH = "pushNotice";
        /**
         * 短信通知任务
         */
        public static final String TYPE_NOTICE_SMS = "smsNotice";

    }

    /**
     * 营销流程批处理推送状态常量类
     *  --状态值中1到5间待后续扩展使用
     *
     * @author tao.yang
     * @date 2018-02-07
     */
    public static class BatchNoticeStatusConstants {
        /**
         * 未开始
         */
        public static final int STATUS_UNSTART = 0;
        /**
         * 进行中
         */
        public static final int STATUS_PROGRESSING = 1;

        /**
         * 暂停
         */
        public static final int STATUS_PAUSE = 5;
        /**
         * 已下线
         */
        public static final int STATUS_OFFLINE = 6;
        /**
         * 已完成
         */
        public static final int STATUS_FINISH = 7;
    }

    /**
     * 营销流程批处理推送计算状态常量类
     *
     * @author tao.yang
     * @date 2018-02-07
     */
    public static class BatchNoticeCalcStatusConstants {

        /**
         * 计算失败
         */
        public static final int CALC_STATUS_FAIL = -1;
        /**
         * 计算未开始
         */
        public static final int CALC_STATUS_UNSTART = 0;
        /**
         * 计算进行中
         */
        public static final int CALC_STATUS_PROGRESSING = 1;
        /**
         * 计算已完成
         */
        public static final int CALC_STATUS_FINISH = 2;

    }

}
