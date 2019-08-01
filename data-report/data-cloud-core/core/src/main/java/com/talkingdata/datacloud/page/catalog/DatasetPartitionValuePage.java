package com.talkingdata.datacloud.page.catalog;

import com.talkingdata.datacloud.base.page.BasePage;

import java.util.Date;

/**
 * <b>功能：</b>dataset_partition_value DatasetPartitionValuePage<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-19 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetPartitionValuePage extends BasePage {

    private String datasetId;
    private String datasetIdOperator = "=";
    private String partitionName;
    private String partitionNameOperator = "=";
    private String value;
    private String valueOperator = "=";
    private String createTime;
    private String createTime1;
    private String createTime2;
    private String createTimeOperator = "=";

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

    public String getPartitionName() {
        return this.partitionName;
    }

    public void setPartitionName(String partitionName) {
        this.partitionName = partitionName;
    }

    public String getPartitionNameOperator() {
        return this.partitionNameOperator;
    }

    public void setPartitionNameOperator(String partitionNameOperator) {
        this.partitionNameOperator = partitionNameOperator;
    }

    public String getValue() {
        return this.value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getValueOperator() {
        return this.valueOperator;
    }

    public void setValueOperator(String valueOperator) {
        this.valueOperator = valueOperator;
    }

    public String getCreateTime() {
        return this.createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getCreateTime1() {
        return this.createTime1;
    }

    public void setCreateTime1(String createTime1) {
        this.createTime1 = createTime1;
    }

    public String getCreateTime2() {
        return this.createTime2;
    }

    public void setCreateTime2(String createTime2) {
        this.createTime2 = createTime2;
    }

    public String getCreateTimeOperator() {
        return this.createTimeOperator;
    }

    public void setCreateTimeOperator(String createTimeOperator) {
        this.createTimeOperator = createTimeOperator;
    }

}
