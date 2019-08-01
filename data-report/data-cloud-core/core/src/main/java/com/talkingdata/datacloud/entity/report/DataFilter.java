package com.talkingdata.datacloud.entity.report;

import java.util.List;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/3/5 <br>
 * <b>版权所有：<b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */

//非常糟糕的定义，之前数据源接口符合旧版本的数炫后端协议，
//因此，新的后端暂时先兼容原有接口定义，后续必须重构
// TODO: 2017/3/5 数据源接口协议待重构
public class DataFilter {
    private List<DatasetMetric> metrics;
    private List<DatasetDimension> dimensions;

    public List<DatasetMetric> getMetrics() {
        return metrics;
    }

    public void setMetrics(List<DatasetMetric> metrics) {
        this.metrics = metrics;
    }

    public List<DatasetDimension> getDimensions() {
        return dimensions;
    }

    public void setDimensions(List<DatasetDimension> dimensions) {
        this.dimensions = dimensions;
    }


}
