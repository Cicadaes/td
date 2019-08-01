package com.talkingdata.datacloud.page.catalog;

import com.talkingdata.datacloud.base.page.BasePage;

import java.util.Date;

/**
 * <b>功能：</b>dict_field_detail FieldDetailPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class FieldDetailPage extends BasePage {

    private String fieldId;
    private String fieldIdOperator = "=";
    private String datasetId;
    private String datasetIdOperator = "=";
    private String fieldsLayoutId;
    private String fieldsLayoutIdOperator = "=";
    private String sortId;
    private String sortIdOperator = "=";
    private String parentSortId;
    private String parentSortIdOperator = "=";
    private String parentPath;
    private String parentPathOperator = "=";
    private String fieldName;
    private String fieldNameOperator = "=";
    private String fieldLabel;
    private String fieldLabelOperator = "=";
    private String dataType;
    private String dataTypeOperator = "=";
    private String dataSize;
    private String dataSizeOperator = "=";
    private String dataPrecision;
    private String dataPrecisionOperator = "=";
    private String dataFraction;
    private String dataFractionOperator = "=";
    private String defaultCommentId;
    private String defaultCommentIdOperator = "=";
    private String commentIds;
    private String commentIdsOperator = "=";
    private String isNullable;
    private String isNullableOperator = "=";
    private String isIndexed;
    private String isIndexedOperator = "=";
    private String isPartitioned;
    private String isPartitionedOperator = "=";
    private String isDistributed;
    private String isDistributedOperator = "=";
    private String isRecursive;
    private String isRecursiveOperator = "=";
    private String confidentialFlags;
    private String confidentialFlagsOperator = "=";
    private String defaultValue;
    private String defaultValueOperator = "=";
    private String namespace;
    private String namespaceOperator = "=";
    private String javaDataType;
    private String javaDataTypeOperator = "=";
    private String jdbcDataType;
    private String jdbcDataTypeOperator = "=";
    private String pigDataType;
    private String pigDataTypeOperator = "=";
    private String hcatalogDataType;
    private String hcatalogDataTypeOperator = "=";
    private String modified;
    private String modified1;
    private String modified2;
    private String modifiedOperator = "=";

    public String getFieldId() {
        return this.fieldId;
    }

    public void setFieldId(String fieldId) {
        this.fieldId = fieldId;
    }

    public String getFieldIdOperator() {
        return this.fieldIdOperator;
    }

    public void setFieldIdOperator(String fieldIdOperator) {
        this.fieldIdOperator = fieldIdOperator;
    }

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

    public String getFieldsLayoutId() {
        return this.fieldsLayoutId;
    }

    public void setFieldsLayoutId(String fieldsLayoutId) {
        this.fieldsLayoutId = fieldsLayoutId;
    }

    public String getFieldsLayoutIdOperator() {
        return this.fieldsLayoutIdOperator;
    }

    public void setFieldsLayoutIdOperator(String fieldsLayoutIdOperator) {
        this.fieldsLayoutIdOperator = fieldsLayoutIdOperator;
    }

    public String getSortId() {
        return this.sortId;
    }

    public void setSortId(String sortId) {
        this.sortId = sortId;
    }

    public String getSortIdOperator() {
        return this.sortIdOperator;
    }

    public void setSortIdOperator(String sortIdOperator) {
        this.sortIdOperator = sortIdOperator;
    }

    public String getParentSortId() {
        return this.parentSortId;
    }

    public void setParentSortId(String parentSortId) {
        this.parentSortId = parentSortId;
    }

    public String getParentSortIdOperator() {
        return this.parentSortIdOperator;
    }

    public void setParentSortIdOperator(String parentSortIdOperator) {
        this.parentSortIdOperator = parentSortIdOperator;
    }

    public String getParentPath() {
        return this.parentPath;
    }

    public void setParentPath(String parentPath) {
        this.parentPath = parentPath;
    }

    public String getParentPathOperator() {
        return this.parentPathOperator;
    }

    public void setParentPathOperator(String parentPathOperator) {
        this.parentPathOperator = parentPathOperator;
    }

    public String getFieldName() {
        return this.fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldNameOperator() {
        return this.fieldNameOperator;
    }

    public void setFieldNameOperator(String fieldNameOperator) {
        this.fieldNameOperator = fieldNameOperator;
    }

    public String getFieldLabel() {
        return this.fieldLabel;
    }

    public void setFieldLabel(String fieldLabel) {
        this.fieldLabel = fieldLabel;
    }

    public String getFieldLabelOperator() {
        return this.fieldLabelOperator;
    }

    public void setFieldLabelOperator(String fieldLabelOperator) {
        this.fieldLabelOperator = fieldLabelOperator;
    }

    public String getDataType() {
        return this.dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getDataTypeOperator() {
        return this.dataTypeOperator;
    }

    public void setDataTypeOperator(String dataTypeOperator) {
        this.dataTypeOperator = dataTypeOperator;
    }

    public String getDataSize() {
        return this.dataSize;
    }

    public void setDataSize(String dataSize) {
        this.dataSize = dataSize;
    }

    public String getDataSizeOperator() {
        return this.dataSizeOperator;
    }

    public void setDataSizeOperator(String dataSizeOperator) {
        this.dataSizeOperator = dataSizeOperator;
    }

    public String getDataPrecision() {
        return this.dataPrecision;
    }

    public void setDataPrecision(String dataPrecision) {
        this.dataPrecision = dataPrecision;
    }

    public String getDataPrecisionOperator() {
        return this.dataPrecisionOperator;
    }

    public void setDataPrecisionOperator(String dataPrecisionOperator) {
        this.dataPrecisionOperator = dataPrecisionOperator;
    }

    public String getDataFraction() {
        return this.dataFraction;
    }

    public void setDataFraction(String dataFraction) {
        this.dataFraction = dataFraction;
    }

    public String getDataFractionOperator() {
        return this.dataFractionOperator;
    }

    public void setDataFractionOperator(String dataFractionOperator) {
        this.dataFractionOperator = dataFractionOperator;
    }

    public String getDefaultCommentId() {
        return this.defaultCommentId;
    }

    public void setDefaultCommentId(String defaultCommentId) {
        this.defaultCommentId = defaultCommentId;
    }

    public String getDefaultCommentIdOperator() {
        return this.defaultCommentIdOperator;
    }

    public void setDefaultCommentIdOperator(String defaultCommentIdOperator) {
        this.defaultCommentIdOperator = defaultCommentIdOperator;
    }

    public String getCommentIds() {
        return this.commentIds;
    }

    public void setCommentIds(String commentIds) {
        this.commentIds = commentIds;
    }

    public String getCommentIdsOperator() {
        return this.commentIdsOperator;
    }

    public void setCommentIdsOperator(String commentIdsOperator) {
        this.commentIdsOperator = commentIdsOperator;
    }

    public String getIsNullable() {
        return this.isNullable;
    }

    public void setIsNullable(String isNullable) {
        this.isNullable = isNullable;
    }

    public String getIsNullableOperator() {
        return this.isNullableOperator;
    }

    public void setIsNullableOperator(String isNullableOperator) {
        this.isNullableOperator = isNullableOperator;
    }

    public String getIsIndexed() {
        return this.isIndexed;
    }

    public void setIsIndexed(String isIndexed) {
        this.isIndexed = isIndexed;
    }

    public String getIsIndexedOperator() {
        return this.isIndexedOperator;
    }

    public void setIsIndexedOperator(String isIndexedOperator) {
        this.isIndexedOperator = isIndexedOperator;
    }

    public String getIsPartitioned() {
        return this.isPartitioned;
    }

    public void setIsPartitioned(String isPartitioned) {
        this.isPartitioned = isPartitioned;
    }

    public String getIsPartitionedOperator() {
        return this.isPartitionedOperator;
    }

    public void setIsPartitionedOperator(String isPartitionedOperator) {
        this.isPartitionedOperator = isPartitionedOperator;
    }

    public String getIsDistributed() {
        return this.isDistributed;
    }

    public void setIsDistributed(String isDistributed) {
        this.isDistributed = isDistributed;
    }

    public String getIsDistributedOperator() {
        return this.isDistributedOperator;
    }

    public void setIsDistributedOperator(String isDistributedOperator) {
        this.isDistributedOperator = isDistributedOperator;
    }

    public String getIsRecursive() {
        return this.isRecursive;
    }

    public void setIsRecursive(String isRecursive) {
        this.isRecursive = isRecursive;
    }

    public String getIsRecursiveOperator() {
        return this.isRecursiveOperator;
    }

    public void setIsRecursiveOperator(String isRecursiveOperator) {
        this.isRecursiveOperator = isRecursiveOperator;
    }

    public String getConfidentialFlags() {
        return this.confidentialFlags;
    }

    public void setConfidentialFlags(String confidentialFlags) {
        this.confidentialFlags = confidentialFlags;
    }

    public String getConfidentialFlagsOperator() {
        return this.confidentialFlagsOperator;
    }

    public void setConfidentialFlagsOperator(String confidentialFlagsOperator) {
        this.confidentialFlagsOperator = confidentialFlagsOperator;
    }

    public String getDefaultValue() {
        return this.defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    public String getDefaultValueOperator() {
        return this.defaultValueOperator;
    }

    public void setDefaultValueOperator(String defaultValueOperator) {
        this.defaultValueOperator = defaultValueOperator;
    }

    public String getNamespace() {
        return this.namespace;
    }

    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    public String getNamespaceOperator() {
        return this.namespaceOperator;
    }

    public void setNamespaceOperator(String namespaceOperator) {
        this.namespaceOperator = namespaceOperator;
    }

    public String getJavaDataType() {
        return this.javaDataType;
    }

    public void setJavaDataType(String javaDataType) {
        this.javaDataType = javaDataType;
    }

    public String getJavaDataTypeOperator() {
        return this.javaDataTypeOperator;
    }

    public void setJavaDataTypeOperator(String javaDataTypeOperator) {
        this.javaDataTypeOperator = javaDataTypeOperator;
    }

    public String getJdbcDataType() {
        return this.jdbcDataType;
    }

    public void setJdbcDataType(String jdbcDataType) {
        this.jdbcDataType = jdbcDataType;
    }

    public String getJdbcDataTypeOperator() {
        return this.jdbcDataTypeOperator;
    }

    public void setJdbcDataTypeOperator(String jdbcDataTypeOperator) {
        this.jdbcDataTypeOperator = jdbcDataTypeOperator;
    }

    public String getPigDataType() {
        return this.pigDataType;
    }

    public void setPigDataType(String pigDataType) {
        this.pigDataType = pigDataType;
    }

    public String getPigDataTypeOperator() {
        return this.pigDataTypeOperator;
    }

    public void setPigDataTypeOperator(String pigDataTypeOperator) {
        this.pigDataTypeOperator = pigDataTypeOperator;
    }

    public String getHcatalogDataType() {
        return this.hcatalogDataType;
    }

    public void setHcatalogDataType(String hcatalogDataType) {
        this.hcatalogDataType = hcatalogDataType;
    }

    public String getHcatalogDataTypeOperator() {
        return this.hcatalogDataTypeOperator;
    }

    public void setHcatalogDataTypeOperator(String hcatalogDataTypeOperator) {
        this.hcatalogDataTypeOperator = hcatalogDataTypeOperator;
    }

    public String getModified() {
        return this.modified;
    }

    public void setModified(String modified) {
        this.modified = modified;
    }

    public String getModified1() {
        return this.modified1;
    }

    public void setModified1(String modified1) {
        this.modified1 = modified1;
    }

    public String getModified2() {
        return this.modified2;
    }

    public void setModified2(String modified2) {
        this.modified2 = modified2;
    }

    public String getModifiedOperator() {
        return this.modifiedOperator;
    }

    public void setModifiedOperator(String modifiedOperator) {
        this.modifiedOperator = modifiedOperator;
    }

}
