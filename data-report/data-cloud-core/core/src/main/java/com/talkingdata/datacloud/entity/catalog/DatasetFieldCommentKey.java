package com.talkingdata.datacloud.entity.catalog;

import com.talkingdata.datacloud.base.entity.BaseEntity;


/**
 * <b>功能：</b>dict_dataset_field_comment DatasetFieldCommentKey Entity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetFieldCommentKey extends BaseEntity {

    private Integer fieldId;
    private Integer commentId;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>fieldId -> field_id</li>
     * <li>commentId -> comment_id</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "fieldId": return "field_id";
            case "commentId": return "comment_id";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>field_id -> fieldId</li>
     * <li>comment_id -> commentId</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "field_id": return "fieldId";
            case "comment_id": return "commentId";
            default: return null;
        }
    }
    
    public DatasetFieldCommentKey pk() {
        DatasetFieldCommentKey key = new DatasetFieldCommentKey();
        key.setFieldId(this.fieldId);
        key.setCommentId(this.commentId);
        return key;
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
    public Integer getCommentId() {
        return this.commentId;
    }

    /**  **/
    public void setCommentId(Integer commentId) {
        this.commentId = commentId;
    }


    @Override
    public String toString() {
        StringBuffer sb = new StringBuffer();
        sb.append("fieldId").append('=').append(fieldId).append(',');
        sb.append("commentId").append('=').append(commentId);
        return sb.toString();
    }

}
