package com.talkingdata.datacloud.visual.vo;

/**
 * Created by Administrator on 2017/4/1 0001.
 */
public class DataSourceConnectionVo {
    private Integer id;
    private String querySql;
    private String tableName;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getQuerySql() {
        return querySql;
    }

    public void setQuerySql(String querySql) {
        this.querySql = querySql;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }
}
