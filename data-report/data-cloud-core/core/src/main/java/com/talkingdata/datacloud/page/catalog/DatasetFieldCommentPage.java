package com.talkingdata.datacloud.page.catalog;

import com.talkingdata.datacloud.base.page.BasePage;


/**
 * <b>功能：</b>dict_dataset_field_comment DatasetFieldCommentPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetFieldCommentPage extends BasePage {

    private String fieldId;
    private String fieldIdOperator = "=";
    private String commentId;
    private String commentIdOperator = "=";
    private String datasetId;
    private String datasetIdOperator = "=";
    private String isDefault;
    private String isDefaultOperator = "=";

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

    public String getCommentId() {
        return this.commentId;
    }

    public void setCommentId(String commentId) {
        this.commentId = commentId;
    }

    public String getCommentIdOperator() {
        return this.commentIdOperator;
    }

    public void setCommentIdOperator(String commentIdOperator) {
        this.commentIdOperator = commentIdOperator;
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

    public String getIsDefault() {
        return this.isDefault;
    }

    public void setIsDefault(String isDefault) {
        this.isDefault = isDefault;
    }

    public String getIsDefaultOperator() {
        return this.isDefaultOperator;
    }

    public void setIsDefaultOperator(String isDefaultOperator) {
        this.isDefaultOperator = isDefaultOperator;
    }

}
