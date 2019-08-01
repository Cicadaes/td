package com.talkingdata.datacloud.base.page;

/**
 * 2016-12-28 copy from dmp
 */
public class BaseHbasePage extends BasePage {
    /**
     * HBase第一页
     */
    public static final String HBASE_PAGE_FIRST = "first";

    /**
     * HBase上一页
     */
    public static final String HBASE_PAGE_PREV = "prev";

    /**
     * HBase下一页
     */
    public static final String HBASE_PAGE_NEXT = "next";

    /**
     * HBase最后一页（暂时不支持）
     */
    public static final String HBASE_PAGE_LAST = "last";

    /**
     * HBase内部迭代下一页
     */
    public static final String HBASE_PAGE_ITERATE = "iterate";


    /**
     * HBase刷新当前页
     */
    public static final String HBASE_PAGE_REFRESH = "refresh";

    private String startRowKey;
    private String endRowKey;
    private String navigator;

    public String getStartRowKey() {
        return startRowKey;
    }

    public void setStartRowKey(String startRowKey) {
        this.startRowKey = startRowKey;
    }

    public String getEndRowKey() {
        return endRowKey;
    }

    public void setEndRowKey(String endRowKey) {
        this.endRowKey = endRowKey;
    }

    public String getNavigator() {
        return navigator;
    }

    public void setNavigator(String navigator) {
        this.navigator = navigator;
    }
}
