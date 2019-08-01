package com.talkingdata.datacloud.entity.catalog;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.List;


/**
 * <b>功能：</b>dict_dataset DatasetEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-11-16 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class Dataset extends BaseEntity {

    private Integer id;
    private String name;
    private String schema;
    private String schemaType;
    private String properties;
    private String fields;
    private String urn;
    private String source;
    private String locationPrefix;
    private String parentName;
    private String compressionType;
    private Object storageType;
    private Integer refDatasetId;
    private Integer statusId;
    private String datasetType;
    private String encoding;
    private String hiveSerdesClass;
    private String isPartitioned;
    private Integer partitionLayoutPatternId;
    private String samplePartitionFullPath;
    private Integer sourceCreatedTime;
    private Integer sourceModifiedTime;
    private Integer createdTime;
    private Integer modifiedTime;
    private Integer whEtlExecId;

    private List<DataPartitionFormat> formatList;

    public List<DataPartitionFormat> getFormatList() {
        return formatList;
    }

    public void setFormatList(List<DataPartitionFormat> formatList) {
        this.formatList = formatList;
    }

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>name -> name</li>
     * <li>schema -> schema</li>
     * <li>schemaType -> schema_type</li>
     * <li>properties -> properties</li>
     * <li>fields -> fields</li>
     * <li>urn -> urn</li>
     * <li>source -> source</li>
     * <li>locationPrefix -> location_prefix</li>
     * <li>parentName -> parent_name</li>
     * <li>compressionType -> compression_type</li>
     * <li>storageType -> storage_type</li>
     * <li>refDatasetId -> ref_dataset_id</li>
     * <li>statusId -> status_id</li>
     * <li>datasetType -> dataset_type</li>
     * <li>encoding -> encoding</li>
     * <li>hiveSerdesClass -> hive_serdes_class</li>
     * <li>isPartitioned -> is_partitioned</li>
     * <li>partitionLayoutPatternId -> partition_layout_pattern_id</li>
     * <li>samplePartitionFullPath -> sample_partition_full_path</li>
     * <li>sourceCreatedTime -> source_created_time</li>
     * <li>sourceModifiedTime -> source_modified_time</li>
     * <li>createdTime -> created_time</li>
     * <li>modifiedTime -> modified_time</li>
     * <li>whEtlExecId -> wh_etl_exec_id</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "id": return "id";
            case "name": return "name";
            case "schema": return "schema";
            case "schemaType": return "schema_type";
            case "properties": return "properties";
            case "fields": return "fields";
            case "urn": return "urn";
            case "source": return "source";
            case "locationPrefix": return "location_prefix";
            case "parentName": return "parent_name";
            case "compressionType": return "compression_type";
            case "storageType": return "storage_type";
            case "refDatasetId": return "ref_dataset_id";
            case "statusId": return "status_id";
            case "datasetType": return "dataset_type";
            case "encoding": return "encoding";
            case "hiveSerdesClass": return "hive_serdes_class";
            case "isPartitioned": return "is_partitioned";
            case "partitionLayoutPatternId": return "partition_layout_pattern_id";
            case "samplePartitionFullPath": return "sample_partition_full_path";
            case "sourceCreatedTime": return "source_created_time";
            case "sourceModifiedTime": return "source_modified_time";
            case "createdTime": return "created_time";
            case "modifiedTime": return "modified_time";
            case "whEtlExecId": return "wh_etl_exec_id";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>id -> id</li>
     * <li>name -> name</li>
     * <li>schema -> schema</li>
     * <li>schema_type -> schemaType</li>
     * <li>properties -> properties</li>
     * <li>fields -> fields</li>
     * <li>urn -> urn</li>
     * <li>source -> source</li>
     * <li>location_prefix -> locationPrefix</li>
     * <li>parent_name -> parentName</li>
     * <li>compression_type -> compressionType</li>
     * <li>storage_type -> storageType</li>
     * <li>ref_dataset_id -> refDatasetId</li>
     * <li>status_id -> statusId</li>
     * <li>dataset_type -> datasetType</li>
     * <li>encoding -> encoding</li>
     * <li>hive_serdes_class -> hiveSerdesClass</li>
     * <li>is_partitioned -> isPartitioned</li>
     * <li>partition_layout_pattern_id -> partitionLayoutPatternId</li>
     * <li>sample_partition_full_path -> samplePartitionFullPath</li>
     * <li>source_created_time -> sourceCreatedTime</li>
     * <li>source_modified_time -> sourceModifiedTime</li>
     * <li>created_time -> createdTime</li>
     * <li>modified_time -> modifiedTime</li>
     * <li>wh_etl_exec_id -> whEtlExecId</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "id": return "id";
            case "name": return "name";
            case "schema": return "schema";
            case "schema_type": return "schemaType";
            case "properties": return "properties";
            case "fields": return "fields";
            case "urn": return "urn";
            case "source": return "source";
            case "location_prefix": return "locationPrefix";
            case "parent_name": return "parentName";
            case "compression_type": return "compressionType";
            case "storage_type": return "storageType";
            case "ref_dataset_id": return "refDatasetId";
            case "status_id": return "statusId";
            case "dataset_type": return "datasetType";
            case "encoding": return "encoding";
            case "hive_serdes_class": return "hiveSerdesClass";
            case "is_partitioned": return "isPartitioned";
            case "partition_layout_pattern_id": return "partitionLayoutPatternId";
            case "sample_partition_full_path": return "samplePartitionFullPath";
            case "source_created_time": return "sourceCreatedTime";
            case "source_modified_time": return "sourceModifiedTime";
            case "created_time": return "createdTime";
            case "modified_time": return "modifiedTime";
            case "wh_etl_exec_id": return "whEtlExecId";
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
    public String getName() {
        return this.name;
    }

    /**  **/
    public void setName(String name) {
        this.name = name;
    }

    /**  **/
    public String getSchema() {
        return this.schema;
    }

    /**  **/
    public void setSchema(String schema) {
        this.schema = schema;
    }

    /** JSON, Hive, DDL, XML, CSV **/
    public String getSchemaType() {
        return this.schemaType;
    }

    /** JSON, Hive, DDL, XML, CSV **/
    public void setSchemaType(String schemaType) {
        this.schemaType = schemaType;
    }

    /**  **/
    public String getProperties() {
        return this.properties;
    }

    /**  **/
    public void setProperties(String properties) {
        this.properties = properties;
    }

    /**  **/
    public String getFields() {
        return this.fields;
    }

    /**  **/
    public void setFields(String fields) {
        this.fields = fields;
    }

    /**  **/
    public String getUrn() {
        return this.urn;
    }

    /**  **/
    public void setUrn(String urn) {
        this.urn = urn;
    }

    /** The original data source type (for dataset in data warehouse). Oracle, Kafka ... **/
    public String getSource() {
        return this.source;
    }

    /** The original data source type (for dataset in data warehouse). Oracle, Kafka ... **/
    public void setSource(String source) {
        this.source = source;
    }

    /**  **/
    public String getLocationPrefix() {
        return this.locationPrefix;
    }

    /**  **/
    public void setLocationPrefix(String locationPrefix) {
        this.locationPrefix = locationPrefix;
    }

    /** Schema Name for RDBMS, Group Name for Jobs/Projects/Tracking Datasets on HDFS  **/
    public String getParentName() {
        return this.parentName;
    }

    /** Schema Name for RDBMS, Group Name for Jobs/Projects/Tracking Datasets on HDFS  **/
    public void setParentName(String parentName) {
        this.parentName = parentName;
    }

    /**  **/
    public String getCompressionType() {
        return this.compressionType;
    }

    /**  **/
    public void setCompressionType(String compressionType) {
        this.compressionType = compressionType;
    }

    /**  **/
    public Object getStorageType() {
        return this.storageType;
    }

    /**  **/
    public void setStorageType(Object storageType) {
        this.storageType = storageType;
    }

    /** Refer to Master/Main dataset for Views/ExternalTables **/
    public Integer getRefDatasetId() {
        return this.refDatasetId;
    }

    /** Refer to Master/Main dataset for Views/ExternalTables **/
    public void setRefDatasetId(Integer refDatasetId) {
        this.refDatasetId = refDatasetId;
    }

    /** Reserve for dataset status **/
    public Integer getStatusId() {
        return this.statusId;
    }

    /** Reserve for dataset status **/
    public void setStatusId(Integer statusId) {
        this.statusId = statusId;
    }

    /** hdfs, hive, kafka, teradata, mysql, sqlserver, file, nfs, pinot, salesforce, oracle, db2, netezza, cassandra, hbase, qfs, zfs **/
    public String getDatasetType() {
        return this.datasetType;
    }

    /** hdfs, hive, kafka, teradata, mysql, sqlserver, file, nfs, pinot, salesforce, oracle, db2, netezza, cassandra, hbase, qfs, zfs **/
    public void setDatasetType(String datasetType) {
        this.datasetType = datasetType;
    }

    /**  **/
    public String getEncoding() {
        return this.encoding;
    }

    /**  **/
    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }

    /**  **/
    public String getHiveSerdesClass() {
        return this.hiveSerdesClass;
    }

    /**  **/
    public void setHiveSerdesClass(String hiveSerdesClass) {
        this.hiveSerdesClass = hiveSerdesClass;
    }

    /**  **/
    public String getIsPartitioned() {
        return this.isPartitioned;
    }

    /**  **/
    public void setIsPartitioned(String isPartitioned) {
        this.isPartitioned = isPartitioned;
    }

    /**  **/
    public Integer getPartitionLayoutPatternId() {
        return this.partitionLayoutPatternId;
    }

    /**  **/
    public void setPartitionLayoutPatternId(Integer partitionLayoutPatternId) {
        this.partitionLayoutPatternId = partitionLayoutPatternId;
    }

    /** sample partition full path of the dataset **/
    public String getSamplePartitionFullPath() {
        return this.samplePartitionFullPath;
    }

    /** sample partition full path of the dataset **/
    public void setSamplePartitionFullPath(String samplePartitionFullPath) {
        this.samplePartitionFullPath = samplePartitionFullPath;
    }

    /** source created time of the flow **/
    public Integer getSourceCreatedTime() {
        return this.sourceCreatedTime;
    }

    /** source created time of the flow **/
    public void setSourceCreatedTime(Integer sourceCreatedTime) {
        this.sourceCreatedTime = sourceCreatedTime;
    }

    /** latest source modified time of the flow **/
    public Integer getSourceModifiedTime() {
        return this.sourceModifiedTime;
    }

    /** latest source modified time of the flow **/
    public void setSourceModifiedTime(Integer sourceModifiedTime) {
        this.sourceModifiedTime = sourceModifiedTime;
    }

    /** wherehows created time **/
    public Integer getCreatedTime() {
        return this.createdTime;
    }

    /** wherehows created time **/
    public void setCreatedTime(Integer createdTime) {
        this.createdTime = createdTime;
    }

    /** latest wherehows modified **/
    public Integer getModifiedTime() {
        return this.modifiedTime;
    }

    /** latest wherehows modified **/
    public void setModifiedTime(Integer modifiedTime) {
        this.modifiedTime = modifiedTime;
    }

    /** wherehows etl execution id that modified this record **/
    public Integer getWhEtlExecId() {
        return this.whEtlExecId;
    }

    /** wherehows etl execution id that modified this record **/
    public void setWhEtlExecId(Integer whEtlExecId) {
        this.whEtlExecId = whEtlExecId;
    }

}
