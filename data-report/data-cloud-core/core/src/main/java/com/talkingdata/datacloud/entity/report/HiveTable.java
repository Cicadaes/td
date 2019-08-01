package com.talkingdata.datacloud.entity.report;

import java.util.List;

/**
 * <br>
 * <b>功能:</b><br>
 * <b>作者:</b> yashiro <br>
 * <b>日期:</b> 17/3/3 <br>
 */
public class HiveTable {

    private String databaseName;

    private List<String> tables;

    public HiveTable(String databaseName, List<String> tables) {
        this.databaseName = databaseName;
        this.tables = tables;
    }

    public String getDatabaseName() {
        return databaseName;
    }

    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }

    public List<String> getTables() {
        return tables;
    }

    public void setTables(List<String> tables) {
        this.tables = tables;
    }
}
