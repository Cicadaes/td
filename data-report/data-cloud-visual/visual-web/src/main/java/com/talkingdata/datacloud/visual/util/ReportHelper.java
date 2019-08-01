package com.talkingdata.datacloud.visual.util;

import com.talkingdata.datacloud.visual.entity.report.ChartDataConfig;
import com.talkingdata.datacloud.visual.entity.report.ChartStyleConfig;
import com.talkingdata.datacloud.visual.entity.report.Page;
import com.talkingdata.datacloud.visual.vo.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangruobin on 2017/5/11.
 */
public class ReportHelper {
    private static final Logger logger = LoggerFactory.getLogger(ReportHelper.class);

    public static com.talkingdata.datacloud.visual.entity.report.Report report2DBReport(Report report)throws Exception{
        com.talkingdata.datacloud.visual.entity.report.Report dbReport=new com.talkingdata.datacloud.visual.entity.report.Report();
        dbReport.setId(report.getId());
        dbReport.setName(report.getName());
        dbReport.setStatus(report.getStatus());
        dbReport.setDescription(report.getDescription());
        dbReport.setBackgroundColor(report.getBackgroundColor());
        dbReport.setBackgroundImage(report.getBackgroundImage());
        dbReport.setFormatAndTheme(JSONUtils.writeValueAsString(report.getFormatAndTheme()));
        dbReport.setPageList(stageList2PageList(report.getStages()));
        return dbReport;
    }

    public static Report dbReport2Report(com.talkingdata.datacloud.visual.entity.report.Report dbReport)throws Exception{
        Report report=new Report();
        report.setId(dbReport.getId());
        report.setDescription(dbReport.getDescription());
        report.setName(dbReport.getName());
        report.setStatus(dbReport.getStatus());
        report.setStages(pageList2StageList(dbReport.getPageList()));
        report.setBackgroundColor(dbReport.getBackgroundColor());
        report.setBackgroundImage(dbReport.getBackgroundImage());
        if(dbReport.getFormatAndTheme()!=null&&!"".equals(dbReport.getFormatAndTheme())){
            report.setFormatAndTheme(JSONUtils.readValueToBean(dbReport.getFormatAndTheme(),FormatAndTheme.class));
        }
        return report;
    }

    public static Stage page2Stage(Page page)throws Exception{
        Stage stage=new Stage();
        Size size=new Size();
        size.setHeight(page.getHeight());
        size.setWidth(page.getWidth());
        stage.setSize(size);
        stage.setBackgroundColor(page.getBackgroundColor());
        stage.setBackgroundImage(page.getBackgroundImage());
        stage.setName(page.getName());
        stage.setzIndex(page.getZIndex());
        stage.setComponents(dbChartList2ComponentList(page.getChartList()));
        return stage;
    }

    public static List<Stage> pageList2StageList(List<Page> pageList)throws Exception{
        List<Stage> stageList=new ArrayList<>();
        for(Page page:pageList){
            stageList.add(page2Stage(page));
        }
        return stageList;
    }
    public static Page stage2Page(Stage stage)throws Exception{
        Page page=new Page();
        page.setName(stage.getName());
        page.setBackgroundColor(stage.getBackgroundColor());
        page.setBackgroundImage(stage.getBackgroundImage());
        page.setZIndex(stage.getzIndex());
        page.setHeight(stage.getSize().getHeight());
        page.setWidth(stage.getSize().getWidth());
        page.setChartList(componentList2DBChartList(stage.getComponents()));
        return page;
    }

    public static List<Page> stageList2PageList(List<Stage> stageList)throws Exception{
        List<Page> pageList=new ArrayList<>();
        for(Stage stage:stageList){
            pageList.add(stage2Page(stage));
        }
        return pageList;
    }

    public static Component dbChartcomponent2(com.talkingdata.datacloud.visual.entity.report.Chart dbChart)throws Exception{
        Component component=new Component();
        component.setChart(dbChart2Chart(dbChart));
        return component;
    }

    public static List<Component> dbChartList2ComponentList(List<com.talkingdata.datacloud.visual.entity.report.Chart> dbChartList)throws Exception{
        List<Component> componentList=new ArrayList<>();
        for(com.talkingdata.datacloud.visual.entity.report.Chart dbChart:dbChartList){
            componentList.add(dbChartcomponent2(dbChart));
        }
        return componentList;
    }

    public static List<com.talkingdata.datacloud.visual.entity.report.Chart> componentList2DBChartList(List<Component> componentList)throws Exception{
        List<com.talkingdata.datacloud.visual.entity.report.Chart> chartList=new ArrayList<>();
        for(Component component:componentList){
            chartList.add(chart2DBChart(component.getChart()));
        }
        return chartList;
    }

    public static Chart dbChart2Chart(com.talkingdata.datacloud.visual.entity.report.Chart dbChart)throws Exception{
        Chart chart=new Chart();
        chart.setId(dbChart.getId());
        chart.setStyle(JSONUtils.readValueToBean(dbChart.getChartStyleConfig().getValue(),Style.class));
        chart.setType(dbChart.getChartStyleConfig().getType());
        chart.setStyleConfigDefinitionId(dbChart.getChartStyleConfig().getConfigDefinitionId());
        //临时方法，待优化
        List<Integer> limitList=ChartHelper.getChartResultLimit(chart.getStyle(),chart.getType());
        chart.setDataSource(ChartHelper.buildChartDataSource(dbChart,limitList));
//		chart.setDataSource(ChartHelper.buildChartDataSource(dbChart.getChartDataConfig().getValue(),dbChart.getChartStyleConfig().getType(),limitList));

        chart.setDataSourceConfigDefinitionId(dbChart.getChartDataConfig().getConfigDefinitionId());
        chart.setDataSourceId(dbChart.getDataSourceId());
        chart.setUuid(dbChart.getUuid());
        return chart;
    }

    public static com.talkingdata.datacloud.visual.entity.report.Chart chart2DBChart(Chart chart)throws Exception{
        com.talkingdata.datacloud.visual.entity.report.Chart dbChart=new com.talkingdata.datacloud.visual.entity.report.Chart();
        dbChart.setId(chart.getId());
        ChartStyleConfig chartStyleConfig=new ChartStyleConfig();
        chartStyleConfig.setChartId(chart.getId());
        chartStyleConfig.setValue(JSONUtils.writeValueAsString(chart.getStyle()));
        chartStyleConfig.setType(chart.getType());
        chartStyleConfig.setConfigDefinitionId(chart.getStyleConfigDefinitionId());
        dbChart.setChartStyleConfig(chartStyleConfig);
        ChartDataConfig chartDataConfig=new ChartDataConfig();
        chartDataConfig.setChartId(chart.getId());
        chartDataConfig.setValue(JSONUtils.writeValueAsString(chart.getDataSource()));
        chartDataConfig.setConfigDefinitionId(chart.getDataSourceConfigDefinitionId());
        dbChart.setChartDataConfig(chartDataConfig);
        dbChart.setDataSourceId(chart.getDataSourceId());
        dbChart.setUuid(chart.getUuid());
        return dbChart;
    }
}
