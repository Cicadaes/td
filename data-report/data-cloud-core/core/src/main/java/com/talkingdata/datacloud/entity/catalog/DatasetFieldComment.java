package com.talkingdata.datacloud.entity.catalog;


/**
 * <b>功能：</b>dict_dataset_field_comment DatasetFieldCommentEntity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetFieldComment extends DatasetFieldCommentKey {

    private Integer datasetId;
    private Integer isDefault;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>fieldId -> field_id</li>
     * <li>commentId -> comment_id</li>
     * <li>datasetId -> dataset_id</li>
     * <li>isDefault -> is_default</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "datasetId": return "dataset_id";
            case "isDefault": return "is_default";
            default: return DatasetFieldCommentKey.fieldToColumn(fieldName);
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>field_id -> fieldId</li>
     * <li>comment_id -> commentId</li>
     * <li>dataset_id -> datasetId</li>
     * <li>is_default -> isDefault</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "dataset_id": return "datasetId";
            case "is_default": return "isDefault";
            default: return DatasetFieldCommentKey.columnToField(columnName);
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
    public Integer getIsDefault() {
        return this.isDefault;
    }

    /**  **/
    public void setIsDefault(Integer isDefault) {
        this.isDefault = isDefault;
    }

}
