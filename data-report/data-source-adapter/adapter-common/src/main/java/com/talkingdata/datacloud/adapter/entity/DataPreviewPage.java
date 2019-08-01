package com.talkingdata.datacloud.adapter.entity;

import com.talkingdata.datacloud.base.page.BasePage;

/**
 * Created by yangruobin on 2017/8/20.
 */
public class DataPreviewPage extends BasePage {
    private Integer id;
    private String querySql;
    private String dataSourceConnectionInfo;

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

    public String getDataSourceConnectionInfo() {
        return dataSourceConnectionInfo;
    }

    public void setDataSourceConnectionInfo(String dataSourceConnectionInfo) {
        this.dataSourceConnectionInfo = dataSourceConnectionInfo;
    }

    public String getMysqlQueryCondition() {
        super.getPager().setRowCount(super.getPageSize());
        return super.getPager().getMysqlQueryCondition();
    }
}
