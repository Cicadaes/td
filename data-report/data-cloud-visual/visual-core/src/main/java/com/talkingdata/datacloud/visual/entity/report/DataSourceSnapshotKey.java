package com.talkingdata.datacloud.visual.entity.report;

import com.talkingdata.datacloud.base.entity.BaseEntity;

import java.util.Date;

/**
 * <b>功能：</b>TD_DC_VISUAL_DATA_SOURCE_SNAPSHOT DataSourceSnapshotKey Entity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-08-31 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DataSourceSnapshotKey extends BaseEntity {

    private Integer reportId;
    private Integer dataSourceId;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>reportId -> report_id</li>
     * <li>dataSourceId -> data_source_id</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "reportId": return "report_id";
            case "dataSourceId": return "data_source_id";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>report_id -> reportId</li>
     * <li>data_source_id -> dataSourceId</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "report_id": return "reportId";
            case "data_source_id": return "dataSourceId";
            default: return null;
        }
    }
    
    public DataSourceSnapshotKey pk() {
        DataSourceSnapshotKey key = new DataSourceSnapshotKey();
        key.setReportId(this.reportId);
        key.setDataSourceId(this.dataSourceId);
        return key;
    }
    
    /** 报表Id **/
    public Integer getReportId() {
        return this.reportId;
    }

    /** 报表Id **/
    public void setReportId(Integer reportId) {
        this.reportId = reportId;
    }

    /** 数据源Id **/
    public Integer getDataSourceId() {
        return this.dataSourceId;
    }

    /** 数据源Id **/
    public void setDataSourceId(Integer dataSourceId) {
        this.dataSourceId = dataSourceId;
    }


    @Override
    public String toString() {
        StringBuffer sb = new StringBuffer();
        sb.append("reportId").append('=').append(reportId).append(',');
        sb.append("dataSourceId").append('=').append(dataSourceId);
        return sb.toString();
    }

}
