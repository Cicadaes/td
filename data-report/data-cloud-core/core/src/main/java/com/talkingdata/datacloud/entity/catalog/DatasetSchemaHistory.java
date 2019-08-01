package com.talkingdata.datacloud.entity.catalog;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>dict_dataset_schema_history DatasetSchemaHistoryEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetSchemaHistory extends BaseEntity {

    private Integer id;
    private Integer datasetId;
    private String urn;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date modifiedDate;
    private String schema;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>datasetId -> dataset_id</li>
     * <li>urn -> urn</li>
     * <li>modifiedDate -> modified_date</li>
     * <li>schema -> schema</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "id": return "id";
            case "datasetId": return "dataset_id";
            case "urn": return "urn";
            case "modifiedDate": return "modified_date";
            case "schema": return "schema";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>dataset_id -> datasetId</li>
     * <li>urn -> urn</li>
     * <li>modified_date -> modifiedDate</li>
     * <li>schema -> schema</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "id": return "id";
            case "dataset_id": return "datasetId";
            case "urn": return "urn";
            case "modified_date": return "modifiedDate";
            case "schema": return "schema";
            default: return null;
        }
    }
    
    /**  **/
    public Integer getId() {
        return this.id;
    }

    /**  **/
    public void setId(Integer id) {
        this.id = id;
    }

    /**  **/
    public Integer getDatasetId() {
        return this.datasetId;
    }

    /**  **/
    public void setDatasetId(Integer datasetId) {
        this.datasetId = datasetId;
    }

    /**  **/
    public String getUrn() {
        return this.urn;
    }

    /**  **/
    public void setUrn(String urn) {
        this.urn = urn;
    }

    /**  **/
    public Date getModifiedDate() {
        return this.modifiedDate;
    }

    /**  **/
    public void setModifiedDate(Date modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    /**  **/
    public String getSchema() {
        return this.schema;
    }

    /**  **/
    public void setSchema(String schema) {
        this.schema = schema;
    }

}
