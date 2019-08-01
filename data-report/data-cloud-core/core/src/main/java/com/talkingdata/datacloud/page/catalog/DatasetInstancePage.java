package com.talkingdata.datacloud.page.catalog;

import com.talkingdata.datacloud.base.page.BasePage;


/**
 * <b>功能：</b>dict_dataset_instance DatasetInstancePage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetInstancePage extends BasePage {

    private String datasetId;
    private String datasetIdOperator = "=";
    private String dbId;
    private String dbIdOperator = "=";
    private String deploymentTier;
    private String deploymentTierOperator = "=";
    private String dataCenter;
    private String dataCenterOperator = "=";
    private String serverCluster;
    private String serverClusterOperator = "=";
    private String slice;
    private String sliceOperator = "=";
    private String statusId;
    private String statusIdOperator = "=";
    private String nativeName;
    private String nativeNameOperator = "=";
    private String logicalName;
    private String logicalNameOperator = "=";
    private String version;
    private String versionOperator = "=";
    private String versionSortId;
    private String versionSortIdOperator = "=";
    private String schemaText;
    private String schemaTextOperator = "=";
    private String ddlText;
    private String ddlTextOperator = "=";
    private String instanceCreatedTime;
    private String instanceCreatedTimeOperator = "=";
    private String createdTime;
    private String createdTimeOperator = "=";
    private String modifiedTime;
    private String modifiedTimeOperator = "=";
    private String whEtlExecId;
    private String whEtlExecIdOperator = "=";

    public String getDatasetId() {
        return this.datasetId;
    }

    public void setDatasetId(String datasetId) {
        this.datasetId = datasetId;
    }

    public String getDatasetIdOperator() {
        return this.datasetIdOperator;
    }

    public void setDatasetIdOperator(String datasetIdOperator) {
        this.datasetIdOperator = datasetIdOperator;
    }

    public String getDbId() {
        return this.dbId;
    }

    public void setDbId(String dbId) {
        this.dbId = dbId;
    }

    public String getDbIdOperator() {
        return this.dbIdOperator;
    }

    public void setDbIdOperator(String dbIdOperator) {
        this.dbIdOperator = dbIdOperator;
    }

    public String getDeploymentTier() {
        return this.deploymentTier;
    }

    public void setDeploymentTier(String deploymentTier) {
        this.deploymentTier = deploymentTier;
    }

    public String getDeploymentTierOperator() {
        return this.deploymentTierOperator;
    }

    public void setDeploymentTierOperator(String deploymentTierOperator) {
        this.deploymentTierOperator = deploymentTierOperator;
    }

    public String getDataCenter() {
        return this.dataCenter;
    }

    public void setDataCenter(String dataCenter) {
        this.dataCenter = dataCenter;
    }

    public String getDataCenterOperator() {
        return this.dataCenterOperator;
    }

    public void setDataCenterOperator(String dataCenterOperator) {
        this.dataCenterOperator = dataCenterOperator;
    }

    public String getServerCluster() {
        return this.serverCluster;
    }

    public void setServerCluster(String serverCluster) {
        this.serverCluster = serverCluster;
    }

    public String getServerClusterOperator() {
        return this.serverClusterOperator;
    }

    public void setServerClusterOperator(String serverClusterOperator) {
        this.serverClusterOperator = serverClusterOperator;
    }

    public String getSlice() {
        return this.slice;
    }

    public void setSlice(String slice) {
        this.slice = slice;
    }

    public String getSliceOperator() {
        return this.sliceOperator;
    }

    public void setSliceOperator(String sliceOperator) {
        this.sliceOperator = sliceOperator;
    }

    public String getStatusId() {
        return this.statusId;
    }

    public void setStatusId(String statusId) {
        this.statusId = statusId;
    }

    public String getStatusIdOperator() {
        return this.statusIdOperator;
    }

    public void setStatusIdOperator(String statusIdOperator) {
        this.statusIdOperator = statusIdOperator;
    }

    public String getNativeName() {
        return this.nativeName;
    }

    public void setNativeName(String nativeName) {
        this.nativeName = nativeName;
    }

    public String getNativeNameOperator() {
        return this.nativeNameOperator;
    }

    public void setNativeNameOperator(String nativeNameOperator) {
        this.nativeNameOperator = nativeNameOperator;
    }

    public String getLogicalName() {
        return this.logicalName;
    }

    public void setLogicalName(String logicalName) {
        this.logicalName = logicalName;
    }

    public String getLogicalNameOperator() {
        return this.logicalNameOperator;
    }

    public void setLogicalNameOperator(String logicalNameOperator) {
        this.logicalNameOperator = logicalNameOperator;
    }

    public String getVersion() {
        return this.version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getVersionOperator() {
        return this.versionOperator;
    }

    public void setVersionOperator(String versionOperator) {
        this.versionOperator = versionOperator;
    }

    public String getVersionSortId() {
        return this.versionSortId;
    }

    public void setVersionSortId(String versionSortId) {
        this.versionSortId = versionSortId;
    }

    public String getVersionSortIdOperator() {
        return this.versionSortIdOperator;
    }

    public void setVersionSortIdOperator(String versionSortIdOperator) {
        this.versionSortIdOperator = versionSortIdOperator;
    }

    public String getSchemaText() {
        return this.schemaText;
    }

    public void setSchemaText(String schemaText) {
        this.schemaText = schemaText;
    }

    public String getSchemaTextOperator() {
        return this.schemaTextOperator;
    }

    public void setSchemaTextOperator(String schemaTextOperator) {
        this.schemaTextOperator = schemaTextOperator;
    }

    public String getDdlText() {
        return this.ddlText;
    }

    public void setDdlText(String ddlText) {
        this.ddlText = ddlText;
    }

    public String getDdlTextOperator() {
        return this.ddlTextOperator;
    }

    public void setDdlTextOperator(String ddlTextOperator) {
        this.ddlTextOperator = ddlTextOperator;
    }

    public String getInstanceCreatedTime() {
        return this.instanceCreatedTime;
    }

    public void setInstanceCreatedTime(String instanceCreatedTime) {
        this.instanceCreatedTime = instanceCreatedTime;
    }

    public String getInstanceCreatedTimeOperator() {
        return this.instanceCreatedTimeOperator;
    }

    public void setInstanceCreatedTimeOperator(String instanceCreatedTimeOperator) {
        this.instanceCreatedTimeOperator = instanceCreatedTimeOperator;
    }

    public String getCreatedTime() {
        return this.createdTime;
    }

    public void setCreatedTime(String createdTime) {
        this.createdTime = createdTime;
    }

    public String getCreatedTimeOperator() {
        return this.createdTimeOperator;
    }

    public void setCreatedTimeOperator(String createdTimeOperator) {
        this.createdTimeOperator = createdTimeOperator;
    }

    public String getModifiedTime() {
        return this.modifiedTime;
    }

    public void setModifiedTime(String modifiedTime) {
        this.modifiedTime = modifiedTime;
    }

    public String getModifiedTimeOperator() {
        return this.modifiedTimeOperator;
    }

    public void setModifiedTimeOperator(String modifiedTimeOperator) {
        this.modifiedTimeOperator = modifiedTimeOperator;
    }

    public String getWhEtlExecId() {
        return this.whEtlExecId;
    }

    public void setWhEtlExecId(String whEtlExecId) {
        this.whEtlExecId = whEtlExecId;
    }

    public String getWhEtlExecIdOperator() {
        return this.whEtlExecIdOperator;
    }

    public void setWhEtlExecIdOperator(String whEtlExecIdOperator) {
        this.whEtlExecIdOperator = whEtlExecIdOperator;
    }

}
