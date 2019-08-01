package com.talkingdata.datacloud.entity.catalog;

import com.talkingdata.datacloud.base.entity.BaseEntity;


/**
 * <b>功能：</b>dataset_partition DatasetPartitionEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-06-13 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetPartition extends BaseEntity {

    private Integer datasetId;
    private String datasetUrn;
    private Integer totalPartitionLevel;
    private String partitionSpecText;
    private Integer hasTimePartition;
    private Integer hasHashPartition;
    private String partitionKeys;
    private String timePartitionExpression;
    private Integer modifiedTime;
    private String partitionOrder;
    private String timePartitionName;
    private String hashPartitionName;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>datasetId -> dataset_id</li>
     * <li>datasetUrn -> dataset_urn</li>
     * <li>totalPartitionLevel -> total_partition_level</li>
     * <li>partitionSpecText -> partition_spec_text</li>
     * <li>hasTimePartition -> has_time_partition</li>
     * <li>hasHashPartition -> has_hash_partition</li>
     * <li>partitionKeys -> partition_keys</li>
     * <li>timePartitionExpression -> time_partition_expression</li>
     * <li>modifiedTime -> modified_time</li>
     * <li>partitionOrder -> partition_order</li>
     * <li>timePartitionName -> time_partition_name</li>
     * <li>hashPartitionName -> hash_partition_name</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "datasetId": return "dataset_id";
            case "datasetUrn": return "dataset_urn";
            case "totalPartitionLevel": return "total_partition_level";
            case "partitionSpecText": return "partition_spec_text";
            case "hasTimePartition": return "has_time_partition";
            case "hasHashPartition": return "has_hash_partition";
            case "partitionKeys": return "partition_keys";
            case "timePartitionExpression": return "time_partition_expression";
            case "modifiedTime": return "modified_time";
            case "partitionOrder": return "partition_order";
            case "timePartitionName": return "time_partition_name";
            case "hashPartitionName": return "hash_partition_name";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>dataset_id -> datasetId</li>
     * <li>dataset_urn -> datasetUrn</li>
     * <li>total_partition_level -> totalPartitionLevel</li>
     * <li>partition_spec_text -> partitionSpecText</li>
     * <li>has_time_partition -> hasTimePartition</li>
     * <li>has_hash_partition -> hasHashPartition</li>
     * <li>partition_keys -> partitionKeys</li>
     * <li>time_partition_expression -> timePartitionExpression</li>
     * <li>modified_time -> modifiedTime</li>
     * <li>partition_order -> partitionOrder</li>
     * <li>time_partition_name -> timePartitionName</li>
     * <li>hash_partition_name -> hashPartitionName</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "dataset_id": return "datasetId";
            case "dataset_urn": return "datasetUrn";
            case "total_partition_level": return "totalPartitionLevel";
            case "partition_spec_text": return "partitionSpecText";
            case "has_time_partition": return "hasTimePartition";
            case "has_hash_partition": return "hasHashPartition";
            case "partition_keys": return "partitionKeys";
            case "time_partition_expression": return "timePartitionExpression";
            case "modified_time": return "modifiedTime";
            case "partition_order": return "partitionOrder";
            case "time_partition_name": return "timePartitionName";
            case "hash_partition_name": return "hashPartitionName";
            default: return null;
        }
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
    public String getDatasetUrn() {
        return this.datasetUrn;
    }

    /**  **/
    public void setDatasetUrn(String datasetUrn) {
        this.datasetUrn = datasetUrn;
    }

    /**  **/
    public Integer getTotalPartitionLevel() {
        return this.totalPartitionLevel;
    }

    /**  **/
    public void setTotalPartitionLevel(Integer totalPartitionLevel) {
        this.totalPartitionLevel = totalPartitionLevel;
    }

    /**  **/
    public String getPartitionSpecText() {
        return this.partitionSpecText;
    }

    /**  **/
    public void setPartitionSpecText(String partitionSpecText) {
        this.partitionSpecText = partitionSpecText;
    }

    /**  **/
    public Integer getHasTimePartition() {
        return this.hasTimePartition;
    }

    /**  **/
    public void setHasTimePartition(Integer hasTimePartition) {
        this.hasTimePartition = hasTimePartition;
    }

    /**  **/
    public Integer getHasHashPartition() {
        return this.hasHashPartition;
    }

    /**  **/
    public void setHasHashPartition(Integer hasHashPartition) {
        this.hasHashPartition = hasHashPartition;
    }

    /**  **/
    public String getPartitionKeys() {
        return this.partitionKeys;
    }

    /**  **/
    public void setPartitionKeys(String partitionKeys) {
        this.partitionKeys = partitionKeys;
    }

    /**  **/
    public String getTimePartitionExpression() {
        return this.timePartitionExpression;
    }

    /**  **/
    public void setTimePartitionExpression(String timePartitionExpression) {
        this.timePartitionExpression = timePartitionExpression;
    }

    /** the modified time in epoch **/
    public Integer getModifiedTime() {
        return this.modifiedTime;
    }

    /** the modified time in epoch **/
    public void setModifiedTime(Integer modifiedTime) {
        this.modifiedTime = modifiedTime;
    }

    /**  **/
    public String getPartitionOrder() {
        return this.partitionOrder;
    }

    /**  **/
    public void setPartitionOrder(String partitionOrder) {
        this.partitionOrder = partitionOrder;
    }

    /**  **/
    public String getTimePartitionName() {
        return this.timePartitionName;
    }

    /**  **/
    public void setTimePartitionName(String timePartitionName) {
        this.timePartitionName = timePartitionName;
    }

    /**  **/
    public String getHashPartitionName() {
        return this.hashPartitionName;
    }

    /**  **/
    public void setHashPartitionName(String hashPartitionName) {
        this.hashPartitionName = hashPartitionName;
    }

}
