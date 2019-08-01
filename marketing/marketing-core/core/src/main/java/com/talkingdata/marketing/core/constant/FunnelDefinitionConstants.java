package com.talkingdata.marketing.core.constant;

/**
 * @author chunyan.ji
 * @create 2018-02-08
 * Copyright(C) 2018, Beijing TendCloud Science & Technology Co., Ltd.
 * @since JDK 1.8
 */
public class FunnelDefinitionConstants {
    /**
     * 过滤器算子
     *
     * @author chunyan.ji
     * @date 2018-02-08
     */
    public final static class FilterCalcConstants {
        /**
         * 查询DMP中Hbase rowkey长度（过滤器算子）
         */
        public static final int HBASE_ROWKEY_LENGTH = 128;

        /**
         * 查询DMP中Hbase rowkey最小值占位符（过滤器算子）
         */
        public static final String HBASE_ROWKEY_MIN_PLACEHOLDER = " ";
    }
}