package com.talkingdata.datacloud.entity.catalog;

import com.talkingdata.datacloud.base.entity.BaseEntity;


/**
 * <b>功能：</b>dict_dataset_instance DatasetInstanceKey Entity<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-01-03 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class DatasetInstanceKey extends BaseEntity {

    private Integer datasetId;
    private Integer dbId;
    private Integer versionSortId;

    /**
     * java字段名转换为原始数据库列名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>datasetId -> dataset_id</li>
     * <li>dbId -> db_id</li>
     * <li>versionSortId -> version_sort_id</li>
     */
    public static String fieldToColumn(String fieldName) {
        if (fieldName == null) return null;
        switch (fieldName) {
            case "datasetId": return "dataset_id";
            case "dbId": return "db_id";
            case "versionSortId": return "version_sort_id";
            default: return null;
        }
    }

    /**
     * 原始数据库列名转换为java字段名。<b>如果不存在则返回null</b><br>
     * <p>字段列表：</p>
     * <li>dataset_id -> datasetId</li>
     * <li>db_id -> dbId</li>
     * <li>version_sort_id -> versionSortId</li>
     */
    public static String columnToField(String columnName) {
        if (columnName == null) return null;
        switch (columnName) {
            case "dataset_id": return "datasetId";
            case "db_id": return "dbId";
            case "version_sort_id": return "versionSortId";
            default: return null;
        }
    }
    
    public DatasetInstanceKey pk() {
        DatasetInstanceKey key = new DatasetInstanceKey();
        key.setDatasetId(this.datasetId);
        key.setDbId(this.dbId);
        key.setVersionSortId(this.versionSortId);
        return key;
    }
    
    /**  **/
    public Integer getDatasetId() {
        return this.datasetId;
    }

    /**  **/
    public void setDatasetId(Integer datasetId) {
        this.datasetId = datasetId;
    }

    /** FK to cfg_database **/
    public Integer getDbId() {
        return this.dbId;
    }

    /** FK to cfg_database **/
    public void setDbId(Integer dbId) {
        this.dbId = dbId;
    }

    /** 4-digit for each version number: 000100020003, 000000030131 **/
    public Integer getVersionSortId() {
        return this.versionSortId;
    }

    /** 4-digit for each version number: 000100020003, 000000030131 **/
    public void setVersionSortId(Integer versionSortId) {
        this.versionSortId = versionSortId;
    }


    @Override
    public String toString() {
        StringBuffer sb = new StringBuffer();
        sb.append("datasetId").append('=').append(datasetId).append(',');
        sb.append("dbId").append('=').append(dbId).append(',');
        sb.append("versionSortId").append('=').append(versionSortId);
        return sb.toString();
    }

}
