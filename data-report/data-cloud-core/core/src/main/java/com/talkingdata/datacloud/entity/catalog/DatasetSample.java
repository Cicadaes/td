package com.talkingdata.datacloud.entity.catalog;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>dict_dataset_sample DatasetSampleEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetSample extends BaseEntity {

    private Integer id;
    private Integer datasetId;
    private String urn;
    private Integer refId;
    private String data;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date modified;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date created;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>datasetId -> dataset_id</li>
     * <li>urn -> urn</li>
     * <li>refId -> ref_id</li>
     * <li>data -> data</li>
     * <li>modified -> modified</li>
     * <li>created -> created</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "id": return "id";
            case "datasetId": return "dataset_id";
            case "urn": return "urn";
            case "refId": return "ref_id";
            case "data": return "data";
            case "modified": return "modified";
            case "created": return "created";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>dataset_id -> datasetId</li>
     * <li>urn -> urn</li>
     * <li>ref_id -> refId</li>
     * <li>data -> data</li>
     * <li>modified -> modified</li>
     * <li>created -> created</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "id": return "id";
            case "dataset_id": return "datasetId";
            case "urn": return "urn";
            case "ref_id": return "refId";
            case "data": return "data";
            case "modified": return "modified";
            case "created": return "created";
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

    /** Reference dataset id of which dataset that we fetch sample from. e.g. for tables we do not have permission, fetch sample data from DWH_STG correspond tables **/
    public Integer getRefId() {
        return this.refId;
    }

    /** Reference dataset id of which dataset that we fetch sample from. e.g. for tables we do not have permission, fetch sample data from DWH_STG correspond tables **/
    public void setRefId(Integer refId) {
        this.refId = refId;
    }

    /**  **/
    public String getData() {
        return this.data;
    }

    /**  **/
    public void setData(String data) {
        this.data = data;
    }

    /**  **/
    public Date getModified() {
        return this.modified;
    }

    /**  **/
    public void setModified(Date modified) {
        this.modified = modified;
    }

    /**  **/
    public Date getCreated() {
        return this.created;
    }

    /**  **/
    public void setCreated(Date created) {
        this.created = created;
    }

}
