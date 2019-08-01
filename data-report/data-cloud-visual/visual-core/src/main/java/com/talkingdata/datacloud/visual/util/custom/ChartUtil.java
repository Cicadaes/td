package com.talkingdata.datacloud.visual.util.custom;

import com.talkingdata.datacloud.visual.entity.custom.Chart;
import com.talkingdata.datacloud.visual.entity.custom.ChartProperty;
import com.talkingdata.datacloud.visual.entity.custom.Style;
import com.talkingdata.datacloud.visual.entity.report.VisualChart;
import com.talkingdata.datacloud.visual.entity.report.VisualChartProperties;
import com.talkingdata.datacloud.visual.entity.report.VisualChartStyle;
import org.apache.commons.beanutils.BeanUtils;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/3/17 <br>
 * <b>版权所有：<b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */

public class ChartUtil {
    public static Chart transChart(VisualChart visualChart) throws Exception{
        Chart chart = new Chart();
        //同名及类型相同的属性会自动赋值
        BeanUtils.copyProperties(chart, visualChart);
        chart.setIndex(visualChart.getZIndex().toString());
        chart.setSourceId(visualChart.getDataSourceId());
        chart.setReportPropertyId(visualChart.getChartPropertiesId());
        return chart;
    }

    public static VisualChart transVisualChart(Chart chart) throws Exception{
        VisualChart visualChart = new VisualChart();
        visualChart.setId(chart.getId());
        visualChart.setChartPropertiesId(chart.getReportPropertyId());
        visualChart.setDataSourceId(chart.getSourceId());
        visualChart.setPageId(chart.getPageId());
        visualChart.setStyleId(chart.getStyleId());
        visualChart.setZIndex(Integer.valueOf(chart.getIndex()));
        return visualChart;
    }

    public static Style transStyle(VisualChartStyle visualChartStyle) throws Exception {
        Style style = new Style();
        BeanUtils.copyProperties(style, visualChartStyle);
        return style;
    }

    public static VisualChartStyle transVisualChartStyle(Style style, Integer chartID) throws Exception{
        VisualChartStyle chartStyle = new VisualChartStyle();
        BeanUtils.copyProperties(chartStyle, style);
        chartStyle.setChartId(chartID);
        return chartStyle;
    }

    public static ChartProperty transProperty(VisualChartProperties visualChartProperties) {
        ChartProperty chartProperty = new ChartProperty();
        chartProperty.setId(visualChartProperties.getId());
        chartProperty.setProperty(visualChartProperties.getProperties());
        chartProperty.setType(visualChartProperties.getType());
        return chartProperty;
    }

    public static VisualChartProperties transVisualChartProperties( ChartProperty property, Integer chartID) {
        VisualChartProperties chartProperties = new VisualChartProperties();
        chartProperties.setId(property.getId());
        chartProperties.setChartId(chartID);
        chartProperties.setProperties(property.getProperty());
        chartProperties.setType(property.getType());
        return chartProperties;
    }

}
