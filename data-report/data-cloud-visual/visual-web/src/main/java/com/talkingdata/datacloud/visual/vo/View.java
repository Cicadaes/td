package com.talkingdata.datacloud.visual.vo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2017/4/1 0001.
 */
public class View {
    private String id;
    private String toolTip;
    private List<FieldTab> fieldTabs=new ArrayList<FieldTab>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getToolTip() {
        return toolTip;
    }

    public void setToolTip(String toolTip) {
        this.toolTip = toolTip;
    }

    public List<FieldTab> getFieldTabs() {
        return fieldTabs;
    }

    public void setFieldTabs(List<FieldTab> fieldTabs) {
        this.fieldTabs = fieldTabs;
    }

}
