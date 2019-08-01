package com.talkingdata.datacloud.entity.report;

import java.util.List;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/2/21 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
public class KylinQueryResult {
    private String project;
    private String table;
    private List<String> columns;
    private List<List<String>> results;

    public KylinQueryResult(String project, String table, List<String> columns, List<List<String>> results) {
        this.project = project;
        this.table = table;
        this.columns = columns;
        this.results = results;
    }

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public String getTable() {
        return table;
    }

    public void setTable(String table) {
        this.table = table;
    }

    public List<String> getColumns() {
        return columns;
    }

    public void setColumns(List<String> columns) {
        this.columns = columns;
    }

    public List<List<String>> getResults() {
        return results;
    }

    public void setResults(List<List<String>> results) {
        this.results = results;
    }
}
