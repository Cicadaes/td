package com.talkingdata.datacloud.entity.report;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.talkingdata.datacloud.entity.catalog.Dataset;
import com.talkingdata.datacloud.enums.report.DatasetFieldTypeEnum;
import com.talkingdata.datacloud.enums.report.SchemaTypeEnum;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yashiro on 17/2/14.
 */
public class DatasetDec{

    private String dataId;
    private String fileName;
    private List<DatasetField> fields;

    public DatasetDec() {

    }

    public DatasetDec(String dataId,
                      String fileName,
                      List<Map<String, String>> datasetFieldsMap) {
        this.dataId = dataId;
        this.fileName = fileName;
        this.fields = new ArrayList<>();
        for (Map<String, String> map : datasetFieldsMap) {
            String fieldId = map.get("fieldId");
            String fieldName = map.get("fieldName");
            String fieldType = map.get("fieldType");
            DatasetField datasetField = new DatasetField(fieldId, fieldName, fieldType);
            fields.add(datasetField);
        }
    }

    /**
     * 可以放在Factory里
     *
     * @param dataset
     * @return
     */
    public static DatasetDec builder(Dataset dataset) {
        String schema = dataset.getSchema();
        List<Map<String, String>> fieldsList = new ArrayList<>();
        if ( SchemaTypeEnum.contain(dataset.getStorageType().toString())
                && null != schema) {
//            int fieldId = 0;
            JSONObject schemaJson = JSON.parseObject(dataset.getSchema());
            List<Map<String, String>> fieldMap = (List<Map<String, String>>) schemaJson.get("fields");
            for (Map<String, String> entry : fieldMap) {
                Map<String, String> yIdMap = new HashMap<>();
                try {
                    yIdMap.put("fieldId", (String)entry.get("name"));
                    yIdMap.put("fieldName", (String)entry.get("name"));
                    yIdMap.put("fieldType", DatasetFieldTypeEnum.parseKey((String)entry.get("type")));
                } catch (ClassCastException e) {
                    //.TODO 后续处理下特殊类型,目前先跳过 skip..
                }
                fieldsList.add(yIdMap);
            }
        }
        return new DatasetDec(dataset.getId().toString(), dataset.getName(), fieldsList);
    }

    public String getDataId() {
        return dataId;
    }

    public void setDataId(String dataId) {
        this.dataId = dataId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public List<DatasetField> getFields() {
        return fields;
    }

    public void setFields(List<DatasetField> fields) {
        this.fields = fields;
    }

}
