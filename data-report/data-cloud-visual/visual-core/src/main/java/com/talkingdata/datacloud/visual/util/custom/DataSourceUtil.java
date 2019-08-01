package com.talkingdata.datacloud.visual.util.custom;


import com.talkingdata.datacloud.visual.entity.custom.DataSource;
import com.talkingdata.datacloud.visual.entity.custom.Source;
import com.talkingdata.datacloud.visual.entity.report.VisualDataSource;
import com.talkingdata.datacloud.visual.entity.report.VisualDataSourceDefinition;

import java.util.ArrayList;
import java.util.List;

/**
 * <br>
 * <b>功能：</b><br>
 * <b>作者：</b>ss.qin<br>
 * <b>日期：</b> 2017/3/17 <br>
 * <b>版权所有：<b>Copyright(C) 2017, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */

public class DataSourceUtil {
    public static Source transSource(VisualDataSource visualDataSource) throws Exception{
        Source source = new Source();
        source.setId(visualDataSource.getId());
        source.setDataSourceId(visualDataSource.getDataSourceDefinitionId());
        source.setParams(visualDataSource.getParams());
        return source;
    }

    public static VisualDataSource transDataSource(Source source, Integer chartID) throws Exception{
        VisualDataSource dataSource = new VisualDataSource();
        dataSource.setChartId(chartID);
        dataSource.setId(source.getId());
        dataSource.setParams(source.getParams());
        dataSource.setDataSourceDefinitionId(source.getDataSourceId());
        return dataSource;
    }

    public static DataSource transDataSourceDef(VisualDataSourceDefinition definition) {
        DataSource dataSource = new DataSource();
        dataSource.setId(definition.getId());
        dataSource.setName(definition.getName());
        dataSource.setUrl(definition.getConfig());
        return dataSource;
    }

    public static List<DataSource> transDataSourceDefs(List<VisualDataSourceDefinition> definitions) throws Exception{
        List<DataSource> dataSources = new ArrayList<>();
        for (VisualDataSourceDefinition def : definitions) {
            dataSources.add(transDataSourceDef(def));
        }
        return dataSources;
    }

}
