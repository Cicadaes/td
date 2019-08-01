package com.talkingdata.marketing.core.constant;

/**
 * 附件常量类
 *
 * @author tao.yang
 * @date 2018-02-07
 * Copyright(C) 2018 Beijing TendCloud TianXia Technology Co., Ltd.
 */
public class AttachmentConstants {

    /**
     * 附件格式常量类
     *
     * @author tao.yang
     * @date 2018-02-07
     * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
     */
    public static final class AttachmentFormatConstants {
        /**
         * csv格式
         */
        public final static String CSV_SUFFIX = ".csv";

        /**
         * zip格式
         */
        public final static String ZIP_SUFFIX = ".zip";

    }

    /**
     * 附件类型常量类
     *
     * @author tao.yang
     * @date 2018-02-07
     * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
     */
    public static final class AttachmentTypeConstants {

        /**
         * 人群
         */
        public final static int ATTACHMENT_TYPE_CROWD = 1;

        /**
         * 权益附件
         */
        public final static int ATTACHMENT_TYPE_EQUITY_CONFIG = 2;

        /**
         * 黑名单
         */
        public final static int ATTACHMENT_TYPE_BLOCK_LIST = 3;

        /**
         * 投放使用
         */
        public final static int ATTACHMENT_TYPE_SEGMENT = 4;
    }

    /**
     * 附件操作符
     *
     * @author chunyan.ji
     * @date 2018-02-08
     */
    public static final class AttachmentOperationConstants {
        /**
         * CSV分隔符.
         */
        public final static String CSV_SEPARATOR = ",";

        /**
         * CSV换行符.
         */
        public final static String CSV_LINE = "\n";
    }

}

