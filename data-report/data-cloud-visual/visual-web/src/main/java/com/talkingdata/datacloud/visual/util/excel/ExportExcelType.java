package com.talkingdata.datacloud.visual.util.excel;

public enum ExportExcelType {

    SELL_AMOUNT (1, "运营概览-销售金额"), //
    PASSENGER_FLOW_DYNAMICS (2, "客流动态-小时动态"),
    TREND_DETAIL (3, "趋势明细"),
    CONVERSION_DETAIL (4, "转化明细"),
    SOURCE_ANALYSIS (5, "来源分析"),
    ORDER_DETAIL (6, "转化明细"),

    GROUPOVERVIEW_INDICATORS (11, "集团概览-指标概览");


    private int    code;
    private String value;

    ExportExcelType(int code, String value) {
        this.code = code;
        this.value = value;
    }

    public int getCode() {
        return code;
    }

    public String getValue() {
        return value;
    }

    public static ExportExcelType getEnum(String value) {
        for (ExportExcelType v : values())
            if (v.toString().equalsIgnoreCase(value))
                return v;
        throw new IllegalArgumentException();
    }
}
