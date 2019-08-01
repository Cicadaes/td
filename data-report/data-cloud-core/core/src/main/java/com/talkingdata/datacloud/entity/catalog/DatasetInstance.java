package com.talkingdata.datacloud.entity.catalog;


/**
 * <b>功能：</b>dict_dataset_instance DatasetInstanceEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetInstance extends DatasetInstanceKey {

    private Object deploymentTier;
    private String dataCenter;
    private String serverCluster;
    private String slice;
    private Integer statusId;
    private String nativeName;
    private String logicalName;
    private String version;
    private String schemaText;
    private String ddlText;
    private Integer instanceCreatedTime;
    private Integer createdTime;
    private Integer modifiedTime;
    private Integer whEtlExecId;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>datasetId -> dataset_id</li>
     * <li>dbId -> db_id</li>
     * <li>deploymentTier -> deployment_tier</li>
     * <li>dataCenter -> data_center</li>
     * <li>serverCluster -> server_cluster</li>
     * <li>slice -> slice</li>
     * <li>statusId -> status_id</li>
     * <li>nativeName -> native_name</li>
     * <li>logicalName -> logical_name</li>
     * <li>version -> version</li>
     * <li>versionSortId -> version_sort_id</li>
     * <li>schemaText -> schema_text</li>
     * <li>ddlText -> ddl_text</li>
     * <li>instanceCreatedTime -> instance_created_time</li>
     * <li>createdTime -> created_time</li>
     * <li>modifiedTime -> modified_time</li>
     * <li>whEtlExecId -> wh_etl_exec_id</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "deploymentTier": return "deployment_tier";
            case "dataCenter": return "data_center";
            case "serverCluster": return "server_cluster";
            case "slice": return "slice";
            case "statusId": return "status_id";
            case "nativeName": return "native_name";
            case "logicalName": return "logical_name";
            case "version": return "version";
            case "schemaText": return "schema_text";
            case "ddlText": return "ddl_text";
            case "instanceCreatedTime": return "instance_created_time";
            case "createdTime": return "created_time";
            case "modifiedTime": return "modified_time";
            case "whEtlExecId": return "wh_etl_exec_id";
            default: return DatasetInstanceKey.fieldToColumn(fieldName);
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>dataset_id -> datasetId</li>
     * <li>db_id -> dbId</li>
     * <li>deployment_tier -> deploymentTier</li>
     * <li>data_center -> dataCenter</li>
     * <li>server_cluster -> serverCluster</li>
     * <li>slice -> slice</li>
     * <li>status_id -> statusId</li>
     * <li>native_name -> nativeName</li>
     * <li>logical_name -> logicalName</li>
     * <li>version -> version</li>
     * <li>version_sort_id -> versionSortId</li>
     * <li>schema_text -> schemaText</li>
     * <li>ddl_text -> ddlText</li>
     * <li>instance_created_time -> instanceCreatedTime</li>
     * <li>created_time -> createdTime</li>
     * <li>modified_time -> modifiedTime</li>
     * <li>wh_etl_exec_id -> whEtlExecId</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "deployment_tier": return "deploymentTier";
            case "data_center": return "dataCenter";
            case "server_cluster": return "serverCluster";
            case "slice": return "slice";
            case "status_id": return "statusId";
            case "native_name": return "nativeName";
            case "logical_name": return "logicalName";
            case "version": return "version";
            case "schema_text": return "schemaText";
            case "ddl_text": return "ddlText";
            case "instance_created_time": return "instanceCreatedTime";
            case "created_time": return "createdTime";
            case "modified_time": return "modifiedTime";
            case "wh_etl_exec_id": return "whEtlExecId";
            default: return DatasetInstanceKey.columnToField(columnName);
        }
    }
    
    /**  **/
    public Object getDeploymentTier() {
        return this.deploymentTier;
    }

    /**  **/
    public void setDeploymentTier(Object deploymentTier) {
        this.deploymentTier = deploymentTier;
    }

    /** data center code: lva1, ltx1, dc2, dc3... **/
    public String getDataCenter() {
        return this.dataCenter;
    }

    /** data center code: lva1, ltx1, dc2, dc3... **/
    public void setDataCenter(String dataCenter) {
        this.dataCenter = dataCenter;
    }

    /** sfo1-bigserver, jfk3-sqlserver03 **/
    public String getServerCluster() {
        return this.serverCluster;
    }

    /** sfo1-bigserver, jfk3-sqlserver03 **/
    public void setServerCluster(String serverCluster) {
        this.serverCluster = serverCluster;
    }

    /** virtual group/tenant id/instance tag **/
    public String getSlice() {
        return this.slice;
    }

    /** virtual group/tenant id/instance tag **/
    public void setSlice(String slice) {
        this.slice = slice;
    }

    /** Reserve for dataset status **/
    public Integer getStatusId() {
        return this.statusId;
    }

    /** Reserve for dataset status **/
    public void setStatusId(Integer statusId) {
        this.statusId = statusId;
    }

    /**  **/
    public String getNativeName() {
        return this.nativeName;
    }

    /**  **/
    public void setNativeName(String nativeName) {
        this.nativeName = nativeName;
    }

    /**  **/
    public String getLogicalName() {
        return this.logicalName;
    }

    /**  **/
    public void setLogicalName(String logicalName) {
        this.logicalName = logicalName;
    }

    /** 1.2.3 or 0.3.131 **/
    public String getVersion() {
        return this.version;
    }

    /** 1.2.3 or 0.3.131 **/
    public void setVersion(String version) {
        this.version = version;
    }

    /**  **/
    public String getSchemaText() {
        return this.schemaText;
    }

    /**  **/
    public void setSchemaText(String schemaText) {
        this.schemaText = schemaText;
    }

    /**  **/
    public String getDdlText() {
        return this.ddlText;
    }

    /**  **/
    public void setDdlText(String ddlText) {
        this.ddlText = ddlText;
    }

    /** source instance created time **/
    public Integer getInstanceCreatedTime() {
        return this.instanceCreatedTime;
    }

    /** source instance created time **/
    public void setInstanceCreatedTime(Integer instanceCreatedTime) {
        this.instanceCreatedTime = instanceCreatedTime;
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
