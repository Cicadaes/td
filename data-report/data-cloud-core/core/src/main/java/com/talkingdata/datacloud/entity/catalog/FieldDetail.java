package com.talkingdata.datacloud.entity.catalog;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>dict_field_detail FieldDetailEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class FieldDetail extends BaseEntity {

    private Integer fieldId;
    private Integer datasetId;
    private Integer fieldsLayoutId;
    private Integer sortId;
    private Integer parentSortId;
    private String parentPath;
    private String fieldName;
    private String fieldLabel;
    private String dataType;
    private Integer dataSize;
    private Integer dataPrecision;
    private Integer dataFraction;
    private Integer defaultCommentId;
    private String commentIds;
    private String isNullable;
    private String isIndexed;
    private String isPartitioned;
    private Integer isDistributed;
    private String isRecursive;
    private String confidentialFlags;
    private String defaultValue;
    private String namespace;
    private String javaDataType;
    private String jdbcDataType;
    private String pigDataType;
    private String hcatalogDataType;
    @org.springframework.format.annotation.DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date modified;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>fieldId -> field_id</li>
     * <li>datasetId -> dataset_id</li>
     * <li>fieldsLayoutId -> fields_layout_id</li>
     * <li>sortId -> sort_id</li>
     * <li>parentSortId -> parent_sort_id</li>
     * <li>parentPath -> parent_path</li>
     * <li>fieldName -> field_name</li>
     * <li>fieldLabel -> field_label</li>
     * <li>dataType -> data_type</li>
     * <li>dataSize -> data_size</li>
     * <li>dataPrecision -> data_precision</li>
     * <li>dataFraction -> data_fraction</li>
     * <li>defaultCommentId -> default_comment_id</li>
     * <li>commentIds -> comment_ids</li>
     * <li>isNullable -> is_nullable</li>
     * <li>isIndexed -> is_indexed</li>
     * <li>isPartitioned -> is_partitioned</li>
     * <li>isDistributed -> is_distributed</li>
     * <li>isRecursive -> is_recursive</li>
     * <li>confidentialFlags -> confidential_flags</li>
     * <li>defaultValue -> default_value</li>
     * <li>namespace -> namespace</li>
     * <li>javaDataType -> java_data_type</li>
     * <li>jdbcDataType -> jdbc_data_type</li>
     * <li>pigDataType -> pig_data_type</li>
     * <li>hcatalogDataType -> hcatalog_data_type</li>
     * <li>modified -> modified</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "fieldId": return "field_id";
            case "datasetId": return "dataset_id";
            case "fieldsLayoutId": return "fields_layout_id";
            case "sortId": return "sort_id";
            case "parentSortId": return "parent_sort_id";
            case "parentPath": return "parent_path";
            case "fieldName": return "field_name";
            case "fieldLabel": return "field_label";
            case "dataType": return "data_type";
            case "dataSize": return "data_size";
            case "dataPrecision": return "data_precision";
            case "dataFraction": return "data_fraction";
            case "defaultCommentId": return "default_comment_id";
            case "commentIds": return "comment_ids";
            case "isNullable": return "is_nullable";
            case "isIndexed": return "is_indexed";
            case "isPartitioned": return "is_partitioned";
            case "isDistributed": return "is_distributed";
            case "isRecursive": return "is_recursive";
            case "confidentialFlags": return "confidential_flags";
            case "defaultValue": return "default_value";
            case "namespace": return "namespace";
            case "javaDataType": return "java_data_type";
            case "jdbcDataType": return "jdbc_data_type";
            case "pigDataType": return "pig_data_type";
            case "hcatalogDataType": return "hcatalog_data_type";
            case "modified": return "modified";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>field_id -> fieldId</li>
     * <li>dataset_id -> datasetId</li>
     * <li>fields_layout_id -> fieldsLayoutId</li>
     * <li>sort_id -> sortId</li>
     * <li>parent_sort_id -> parentSortId</li>
     * <li>parent_path -> parentPath</li>
     * <li>field_name -> fieldName</li>
     * <li>field_label -> fieldLabel</li>
     * <li>data_type -> dataType</li>
     * <li>data_size -> dataSize</li>
     * <li>data_precision -> dataPrecision</li>
     * <li>data_fraction -> dataFraction</li>
     * <li>default_comment_id -> defaultCommentId</li>
     * <li>comment_ids -> commentIds</li>
     * <li>is_nullable -> isNullable</li>
     * <li>is_indexed -> isIndexed</li>
     * <li>is_partitioned -> isPartitioned</li>
     * <li>is_distributed -> isDistributed</li>
     * <li>is_recursive -> isRecursive</li>
     * <li>confidential_flags -> confidentialFlags</li>
     * <li>default_value -> defaultValue</li>
     * <li>namespace -> namespace</li>
     * <li>java_data_type -> javaDataType</li>
     * <li>jdbc_data_type -> jdbcDataType</li>
     * <li>pig_data_type -> pigDataType</li>
     * <li>hcatalog_data_type -> hcatalogDataType</li>
     * <li>modified -> modified</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "field_id": return "fieldId";
            case "dataset_id": return "datasetId";
            case "fields_layout_id": return "fieldsLayoutId";
            case "sort_id": return "sortId";
            case "parent_sort_id": return "parentSortId";
            case "parent_path": return "parentPath";
            case "field_name": return "fieldName";
            case "field_label": return "fieldLabel";
            case "data_type": return "dataType";
            case "data_size": return "dataSize";
            case "data_precision": return "dataPrecision";
            case "data_fraction": return "dataFraction";
            case "default_comment_id": return "defaultCommentId";
            case "comment_ids": return "commentIds";
            case "is_nullable": return "isNullable";
            case "is_indexed": return "isIndexed";
            case "is_partitioned": return "isPartitioned";
            case "is_distributed": return "isDistributed";
            case "is_recursive": return "isRecursive";
            case "confidential_flags": return "confidentialFlags";
            case "default_value": return "defaultValue";
            case "namespace": return "namespace";
            case "java_data_type": return "javaDataType";
            case "jdbc_data_type": return "jdbcDataType";
            case "pig_data_type": return "pigDataType";
            case "hcatalog_data_type": return "hcatalogDataType";
            case "modified": return "modified";
            default: return null;
        }
    }
    
    /**  **/
    public Integer getFieldId() {
        return this.fieldId;
    }

    /**  **/
    public void setFieldId(Integer fieldId) {
        this.fieldId = fieldId;
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
    public Integer getFieldsLayoutId() {
        return this.fieldsLayoutId;
    }

    /**  **/
    public void setFieldsLayoutId(Integer fieldsLayoutId) {
        this.fieldsLayoutId = fieldsLayoutId;
    }

    /**  **/
    public Integer getSortId() {
        return this.sortId;
    }

    /**  **/
    public void setSortId(Integer sortId) {
        this.sortId = sortId;
    }

    /**  **/
    public Integer getParentSortId() {
        return this.parentSortId;
    }

    /**  **/
    public void setParentSortId(Integer parentSortId) {
        this.parentSortId = parentSortId;
    }

    /**  **/
    public String getParentPath() {
        return this.parentPath;
    }

    /**  **/
    public void setParentPath(String parentPath) {
        this.parentPath = parentPath;
    }

    /**  **/
    public String getFieldName() {
        return this.fieldName;
    }

    /**  **/
    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    /**  **/
    public String getFieldLabel() {
        return this.fieldLabel;
    }

    /**  **/
    public void setFieldLabel(String fieldLabel) {
        this.fieldLabel = fieldLabel;
    }

    /**  **/
    public String getDataType() {
        return this.dataType;
    }

    /**  **/
    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    /**  **/
    public Integer getDataSize() {
        return this.dataSize;
    }

    /**  **/
    public void setDataSize(Integer dataSize) {
        this.dataSize = dataSize;
    }

    /** only in decimal type **/
    public Integer getDataPrecision() {
        return this.dataPrecision;
    }

    /** only in decimal type **/
    public void setDataPrecision(Integer dataPrecision) {
        this.dataPrecision = dataPrecision;
    }

    /** only in decimal type **/
    public Integer getDataFraction() {
        return this.dataFraction;
    }

    /** only in decimal type **/
    public void setDataFraction(Integer dataFraction) {
        this.dataFraction = dataFraction;
    }

    /** a list of comment_id **/
    public Integer getDefaultCommentId() {
        return this.defaultCommentId;
    }

    /** a list of comment_id **/
    public void setDefaultCommentId(Integer defaultCommentId) {
        this.defaultCommentId = defaultCommentId;
    }

    /**  **/
    public String getCommentIds() {
        return this.commentIds;
    }

    /**  **/
    public void setCommentIds(String commentIds) {
        this.commentIds = commentIds;
    }

    /**  **/
    public String getIsNullable() {
        return this.isNullable;
    }

    /**  **/
    public void setIsNullable(String isNullable) {
        this.isNullable = isNullable;
    }

    /** only in RDBMS **/
    public String getIsIndexed() {
        return this.isIndexed;
    }

    /** only in RDBMS **/
    public void setIsIndexed(String isIndexed) {
        this.isIndexed = isIndexed;
    }

    /** only in RDBMS **/
    public String getIsPartitioned() {
        return this.isPartitioned;
    }

    /** only in RDBMS **/
    public void setIsPartitioned(String isPartitioned) {
        this.isPartitioned = isPartitioned;
    }

    /** only in RDBMS **/
    public Integer getIsDistributed() {
        return this.isDistributed;
    }

    /** only in RDBMS **/
    public void setIsDistributed(Integer isDistributed) {
        this.isDistributed = isDistributed;
    }

    /**  **/
    public String getIsRecursive() {
        return this.isRecursive;
    }

    /**  **/
    public void setIsRecursive(String isRecursive) {
        this.isRecursive = isRecursive;
    }

    /**  **/
    public String getConfidentialFlags() {
        return this.confidentialFlags;
    }

    /**  **/
    public void setConfidentialFlags(String confidentialFlags) {
        this.confidentialFlags = confidentialFlags;
    }

    /**  **/
    public String getDefaultValue() {
        return this.defaultValue;
    }

    /**  **/
    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    /**  **/
    public String getNamespace() {
        return this.namespace;
    }

    /**  **/
    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }

    /** correspond type in java **/
    public String getJavaDataType() {
        return this.javaDataType;
    }

    /** correspond type in java **/
    public void setJavaDataType(String javaDataType) {
        this.javaDataType = javaDataType;
    }

    /** correspond type in jdbc **/
    public String getJdbcDataType() {
        return this.jdbcDataType;
    }

    /** correspond type in jdbc **/
    public void setJdbcDataType(String jdbcDataType) {
        this.jdbcDataType = jdbcDataType;
    }

    /** correspond type in pig **/
    public String getPigDataType() {
        return this.pigDataType;
    }

    /** correspond type in pig **/
    public void setPigDataType(String pigDataType) {
        this.pigDataType = pigDataType;
    }

    /** correspond type in hcatalog **/
    public String getHcatalogDataType() {
        return this.hcatalogDataType;
    }

    /** correspond type in hcatalog **/
    public void setHcatalogDataType(String hcatalogDataType) {
        this.hcatalogDataType = hcatalogDataType;
    }

    /**  **/
    public Date getModified() {
        return this.modified;
    }

    /**  **/
    public void setModified(Date modified) {
        this.modified = modified;
    }

}
