package com.talkingdata.datacloud.entity.report;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangruobin on 2017/6/20.
 */
public class HiveTableDesc {
    String uuid;
    Long last_modified;
    String version;
    String name;
    Integer source_type;
    String table_type;
    String database;
    List<column> columnList=new ArrayList<>();
    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Long getLast_modified() {
        return last_modified;
    }

    public void setLast_modified(Long last_modified) {
        this.last_modified = last_modified;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSource_type() {
        return source_type;
    }

    public void setSource_type(Integer source_type) {
        this.source_type = source_type;
    }

    public String getTable_type() {
        return table_type;
    }

    public void setTable_type(String table_type) {
        this.table_type = table_type;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public List<column> getColumnList() {
        return columnList;
    }

    public void setColumnList(List<column> columnList) {
        this.columnList = columnList;
    }

    public static class column{
        Integer id;
        String name;
        String datatype;

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDatatype() {
            return datatype;
        }

        public void setDatatype(String datatype) {
            this.datatype = datatype;
        }
    }

}

