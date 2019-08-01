package com.talkingdata.datacloud.entity.catalog;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>dataset_partition_value DatasetPartitionValueEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetPartitionValue extends BaseEntity {

    private Integer datasetId;
    private String partitionName;
    private String value;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>datasetId -> dataset_id</li>
     * <li>partitionName -> partition_name</li>
     * <li>value -> value</li>
     * <li>createTime -> create_time</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "datasetId": return "dataset_id";
            case "partitionName": return "partition_name";
            case "value": return "value";
            case "createTime": return "create_time";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>dataset_id -> datasetId</li>
     * <li>partition_name -> partitionName</li>
     * <li>value -> value</li>
     * <li>create_time -> createTime</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "dataset_id": return "datasetId";
            case "partition_name": return "partitionName";
            case "value": return "value";
            case "create_time": return "createTime";
            default: return null;
        }
    }
    
    /** 数据集id **/
    public Integer getDatasetId() {
        return this.datasetId;
    }

    /** 数据集id **/
    public void setDatasetId(Integer datasetId) {
        this.datasetId = datasetId;
    }

    /** 分区名字 **/
    public String getPartitionName() {
        return this.partitionName;
    }

    /** 分区名字 **/
    public void setPartitionName(String partitionName) {
        this.partitionName = partitionName;
    }

    /** 分区值 **/
    public String getValue() {
        return this.value;
    }

    /** 分区值 **/
    public void setValue(String value) {
        this.value = value;
    }

    /** 创建时间 **/
    public Date getCreateTime() {
        return this.createTime;
    }

    /** 创建时间 **/
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

}
