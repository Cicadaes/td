package com.talkingdata.datacloud.base.constant;

/**
 * 2016-12-28 copy from dmp
 */
public class DefinitionConstants {

    /**
     * 下划线
     */
    public static String UNDERLINE = "_";

    public static class FilterConstants {
        /**
         * 过滤器：and
         */
        public static String FILTER_AND = "and";

        /**
         * 过滤器：or
         */
        public static String FILTER_OR = "or";

        /**
         * 过滤器：not
         */
        public static String FILTER_NOT = "not";

    }

    public static class BoolFilterConstants {
        /**
         * 布尔过滤器：must
         */
        public static String BOOLFILTER_MUST = "must";

        /**
         * 布尔过滤器：must_not
         */
        public static String BOOLFILTER_MUSTNOT = "must_not";

    }

    public static class QualifierConstants {
        /**
         * 限定器：term
         */
        public static String QUALIFIER_TERM = "term";

        /**
         * 限定器：range
         */
        public static String QUALIFIER_RANGE = "range";
    }

    public static class OperatorConstants {
        /**
         * 操作符：eq，等于
         */
        public static String OPERATOR_EQ = "eq";

        /**
         * 操作符：ne，不等于
         */
        public static String OPERATOR_NE = "ne";

        /**
         * 操作符：gt，大于
         */
        public static String OPERATOR_GT = "gt";

        /**
         * 操作符：gte，大于等于
         */
        public static String OPERATOR_GTE = "gte";

        /**
         * 操作符：lt，小于
         */
        public static String OPERATOR_LT = "lt";

        /**
         * 操作符：lte，小于等于
         */
        public static String OPERATOR_LTE = "lte";

        /**
         * 操作符：like，包含
         */
        public static String OPERATOR_LIKE = "like";

    }

    public static class AggregationConstants {
        /**
         * 聚合函数：count
         */
        public static String AGGREGATION_COUNT = "count";

        /**
         * 聚合函数：sum
         */
        public static String AGGREGATION_SUM = "sum";

        /**
         * 聚合函数：min
         */
        public static String AGGREGATION_MIN = "min";

        /**
         * 聚合函数：max
         */
        public static String AGGREGATION_MAX = "max";

        /**
         * 聚合函数：avg
         */
        public static String AGGREGATION_AVG = "avg";
    }


    public static class ScriptOperatorConstants {
        /**
         * 操作符：=，等于
         */
        public static String OPERATOR_EQ = "=";

        /**
         * 操作符：<>，不等于
         */
        public static String OPERATOR_NE = "<>";

        /**
         * 操作符：>，大于
         */
        public static String OPERATOR_GT = ">";

        /**
         * 操作符：>=，大于等于
         */
        public static String OPERATOR_GTE = ">=";

        /**
         * 操作符：<，小于
         */
        public static String OPERATOR_LT = "<";

        /**
         * 操作符：<=，小于等于
         */
        public static String OPERATOR_LTE = "<=";

        /**
         * 操作符：like
         */
        public static String OPERATOR_LIKE = "like";
    }

    public static class ValueConstants {
        /**
         * 值类型：sv，单值
         */
        public static String SINGLE_VALUE = "sv";

        /**
         * 值类型：mv，多值
         */
        public static String MULTIPLE_VALUE = "mv";
    }
}
