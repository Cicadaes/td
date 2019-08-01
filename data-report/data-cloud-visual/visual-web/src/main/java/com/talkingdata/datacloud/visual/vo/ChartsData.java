package com.talkingdata.datacloud.visual.vo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangruobin on 2017/9/12.
 */
public class ChartsData {
    List<FieldData> chartInsideData=new ArrayList<>();
    String methodName="getData";
    Report report;

    public List<FieldData> getChartInsideData() {
        return chartInsideData;
    }

    public void setChartInsideData(List<FieldData> chartInsideData) {
        this.chartInsideData = chartInsideData;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public Report getReport() {
        return report;
    }

    public void setReport(Report report) {
        this.report = report;
    }
}
