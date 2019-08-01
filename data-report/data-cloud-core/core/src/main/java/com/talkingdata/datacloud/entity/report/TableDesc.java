package com.talkingdata.datacloud.entity.report;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>yashiro<br>
 * <b>日期：</b> 17/2/27 <br>
 * <b>版权所有：<b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class TableDesc {

    public String uuid;

    public Long last_modified;

    public String version;

    public String name;

    public List<Column> columns;

    public Integer source_type;

    public String table_type;

    public String database;

    public TableDesc(
            String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    @JsonCreator
    public TableDesc(
            @JsonProperty("uuid")
                    String uuid,
            @JsonProperty("last_modified")
                    Long last_modified,
            @JsonProperty("version")
                    String version,
            @JsonProperty("name")
                    String name,
            @JsonProperty("columns")
                    List<Column> columns,
            @JsonProperty("source_type")
                    Integer source_type,
            @JsonProperty("table_type")
                    String table_type,
            @JsonProperty("database")
                    String database) {
        this.uuid = uuid;
        this.last_modified = last_modified;
        this.version = version;
        this.name = name;
        this.columns = columns;
        this.source_type = source_type;
        this.table_type = table_type;
        this.database = database;
    }


    public static class Column {

        public final String id;

        public final String name;

        public final String datatype;

        public final String comment;

        @JsonCreator
        public Column(
                @JsonProperty("id")
                        String id,
                @JsonProperty("name")
                        String name,
                @JsonProperty("datatype")
                        String datatype,
                @JsonProperty("comment")
                        String comment) {
            this.id = id;
            this.name = name;
            this.datatype = datatype;
            this.comment = comment;
        }
    }
}
