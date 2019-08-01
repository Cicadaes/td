package com.talkingdata.datacloud.entity.report;

import com.alibaba.fastjson.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by yashiro on 17/2/16.
 */
public class SimpleDataset {

    private String dataId;
    private List<String> columns;

    public SimpleDataset() {
    }

    private SimpleDataset(String dataId, List<String> columns) {
        this.dataId = dataId;
        this.columns = columns;
    }

    public static SimpleDataset builder(JSONObject json) {

        String datasetId = null;
        List<String> columnList = new ArrayList<>();

        List<Map<String, String>> metricsList = (List<Map<String, String>>) json.get("metrics");
        if (null == metricsList || metricsList.size() == 0) {
            return null;
        }

        for (Map<String, String> map : metricsList)
            columnList.add((String) map.get("name"));

        List<Map<String, Object>> dimensionsList = (List<Map<String, Object>>) json.get("dimensions");
        if (null == dimensionsList || dimensionsList.size() == 0) {
            return null;
        }

        for (Map<String, Object> map : dimensionsList) {
            String name = (String) map.get("name");
            if ("dataId".equals(name)) {
                List<String> ids = (List<String>) map.get("value");
                if (null == ids || ids.size() == 0 || "".equals(ids.get(0))) {
                    return null;
                }
                datasetId = ids.get(0);
                break;
            }
            return null;
        }
        return new SimpleDataset(datasetId, columnList);
    }

    public String getDataId() {
        return dataId;
    }

    public void setDataId(String dataId) {
        this.dataId = dataId;
    }

    public List<String> getColumns() {
        return columns;
    }

    public void setColumns(List<String> columns) {
        this.columns = columns;
    }

    @Override
    public String toString() {
        return "SimpleDataset{" +
                "dataId='" + dataId + '\'' +
                ", columns=" + columns +
                '}';
    }
}
