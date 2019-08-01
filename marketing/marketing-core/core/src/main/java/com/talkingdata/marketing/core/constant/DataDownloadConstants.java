package com.talkingdata.marketing.core.constant;

/**
 * 数据下载常量类
 * @author tao.yang
 * @date 2018-02-08
 * Copyright(C) 2018 Beijing TendCloud TianXia Technology Co., Ltd.
 */
public class DataDownloadConstants {

    /**
     * 数据下载状态常量类
     * @author tao.yang
     * @date 2018-02-08
     */
    public static class DataDownloadStatusConstants {
        /**
         * 异常
         */
        public final static int DATA_DOWNLOAD_FAIL = -1
            ;
        /**
         * 未开始,等待开始
         */
        public final static int DATA_DOWNLOAD_WAITING = 0;

        /**
         * 进行中
         */
        public final static int DATA_DOWNLOAD_PROGRESS = 1;

        /**
         * 下载完成
         */
        public final static int DATA_DOWNLOAD_FINISH = 2;
    }

    /**
     * 数据下载常量类
     * @author tao.yang
     * @date 2018-02-08
     * Copyright(C) 2018 Beijing TendCloud TianXia Technology Co., Ltd.
     */
    public static class DataDownloadTypeConstants {

        /**
         * 全量
         */
        public final static int DATA_DOWNLOAD_TYPE_ALL = 1;

        /**
         * 增量
         */
        public final static int DATA_DOWNLOAD_TYPE_INC = 2;

    }

}

