package com.talkingdata.datacloud.visual.vo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Administrator on 2017/3/31 0031.
 */
public class Report {
    private Integer id;
    private String name;
    private Integer status=0;
    private String description;
    private Integer componentCount;
    private String backgroundColor;
    private String backgroundImage;
    private FormatAndTheme formatAndTheme=new FormatAndTheme();
    private List<Stage> stages=new ArrayList<>();

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public String getBackgroundImage() {
        return backgroundImage;
    }

    public void setBackgroundImage(String backgroundImage) {
        this.backgroundImage = backgroundImage;
    }



    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }


    public List<Stage> getStages() {
        return stages;
    }

    public void setStages(List<Stage> stages) {
        this.stages = stages;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getComponentCount() {
        return componentCount;
    }

    public void setComponentCount(Integer componentCount) {
        this.componentCount = componentCount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public FormatAndTheme getFormatAndTheme() {
        return formatAndTheme;
    }

    public void setFormatAndTheme(FormatAndTheme formatAndTheme) {
        this.formatAndTheme = formatAndTheme;
    }
}
