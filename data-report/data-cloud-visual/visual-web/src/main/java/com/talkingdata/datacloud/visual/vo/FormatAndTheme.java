package com.talkingdata.datacloud.visual.vo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangruobin on 2017/7/19.
 */
public class FormatAndTheme {
    List<OperatorParameter> format =new ArrayList<>();
    List<OperatorParameter> theme = new ArrayList<>();

    public List<OperatorParameter> getFormat() {
        return format;
    }

    public void setFormat(List<OperatorParameter> format) {
        this.format = format;
    }

    public List<OperatorParameter> getTheme() {
        return theme;
    }

    public void setTheme(List<OperatorParameter> theme) {
        this.theme = theme;
    }
}
