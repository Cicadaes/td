package com.talkingdata.datacloud.page.catalog;

import com.talkingdata.datacloud.base.page.BasePage;

import java.util.Date;

/**
 * <b>功能：</b>dict_dataset_schema_history DatasetSchemaHistoryPage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetSchemaHistoryPage extends BasePage {

    private String id;
    private String idOperator = "=";
    private String datasetId;
    private String datasetIdOperator = "=";
    private String urn;
    private String urnOperator = "=";
    private String modifiedDate;
    private String modifiedDate1;
    private String modifiedDate2;
    private String modifiedDateOperator = "=";
    private String schema;
    private String schemaOperator = "=";

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIdOperator() {
        return this.idOperator;
    }

    public void setIdOperator(String idOperator) {
        this.idOperator = idOperator;
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

    public String getUrn() {
        return this.urn;
    }

    public void setUrn(String urn) {
        this.urn = urn;
    }

    public String getUrnOperator() {
        return this.urnOperator;
    }

    public void setUrnOperator(String urnOperator) {
        this.urnOperator = urnOperator;
    }

    public String getModifiedDate() {
        return this.modifiedDate;
    }

    public void setModifiedDate(String modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public String getModifiedDate1() {
        return this.modifiedDate1;
    }

    public void setModifiedDate1(String modifiedDate1) {
        this.modifiedDate1 = modifiedDate1;
    }

    public String getModifiedDate2() {
        return this.modifiedDate2;
    }

    public void setModifiedDate2(String modifiedDate2) {
        this.modifiedDate2 = modifiedDate2;
    }

    public String getModifiedDateOperator() {
        return this.modifiedDateOperator;
    }

    public void setModifiedDateOperator(String modifiedDateOperator) {
        this.modifiedDateOperator = modifiedDateOperator;
    }

    public String getSchema() {
        return this.schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public String getSchemaOperator() {
        return this.schemaOperator;
    }

    public void setSchemaOperator(String schemaOperator) {
        this.schemaOperator = schemaOperator;
    }

}
