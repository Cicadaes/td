package com.talkingdata.datacloud.visual.vo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2017/4/5 0005.
 */
public class Parameter {
    private Integer id;
    private String name;
    private String scripts;
    private List<Field> fields=new ArrayList<>();

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

    public String getScripts() {
        return scripts;
    }

    public void setScripts(String scripts) {
        this.scripts = scripts;
    }

    public List<Field> getFields() {
        return fields;
    }

    public void setFields(List<Field> fields) {
        this.fields = fields;
    }
}
