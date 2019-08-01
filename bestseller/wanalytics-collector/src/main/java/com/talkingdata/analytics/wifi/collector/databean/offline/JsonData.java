package com.talkingdata.analytics.wifi.collector.databean.offline;

import java.util.Collections;
import java.util.List;

/**
 * Created by loong on 4/22/16.
 */
public class JsonData {
    private String version;
    private String datatype;
    private int ts;
    private List<String> data;

    public JsonData() {
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDatatype() {
        return this.datatype;
    }

    public void setDatatype(String datatype) {
        this.datatype = datatype;
    }

    public int getTs() {
        return this.ts;
    }

    public void setTs(int ts) {
        this.ts = ts;
    }

    public List<String> getData() {
        return this.data;
    }

    public void setData(List<String> data) {
        this.data = data;
    }

}
