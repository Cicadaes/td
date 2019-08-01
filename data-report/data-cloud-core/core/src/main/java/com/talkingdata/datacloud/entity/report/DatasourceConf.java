package com.talkingdata.datacloud.entity.report;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/3/4 <br>
 * <b>版权所有：<b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasourceConf {
    private String url;
    private String schema;
    private String data;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
