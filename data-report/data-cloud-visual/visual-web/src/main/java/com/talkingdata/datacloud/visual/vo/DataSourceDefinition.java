package com.talkingdata.datacloud.visual.vo;

/**
 * Created by Administrator on 2017/4/1 0001.
 */
public class DataSourceDefinition {
    private Integer id;
    private String name;
//    private BasicInfo dataSourceBasicInfo;
    private View dataSourceView;
//    private DataSourceImpl dataSourceImpl;
    private Integer type;
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

    public View getDataSourceView() {
        return dataSourceView;
    }

    public void setDataSourceView(View dataSourceView) {
        this.dataSourceView = dataSourceView;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}
