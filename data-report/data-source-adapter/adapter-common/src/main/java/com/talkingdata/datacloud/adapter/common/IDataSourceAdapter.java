package com.talkingdata.datacloud.adapter.common;

import com.talkingdata.datacloud.adapter.entity.DataPreviewPage;
import com.talkingdata.datacloud.adapter.entity.QueryParameter;

import java.util.List;
import java.util.Map;

/**
 * Created by Ocean on 2017/4/11.
 */
public interface IDataSourceAdapter {
    //测试连接
    boolean testConnection(String dataSourceConnectionInfo);

    //获取资源名称列表
    List<String> viewSourceList(String dataSourceConnectionInfo);

    //获取视图列表
    List<String> getViewList(String dataSourceConnectionInfo);

    //获取元数据属性
    List<Map<String,Object>> viewMetadataPropertiesList(String dataSourceConnectionInfo,String dataSourceName);

    //获取数据源数据
    Map<String, Object> viewDataSourceDataList(DataPreviewPage dataPreviewPage);

    //获取数据源的查询结果数据
    Object findData(QueryParameter queryParameter);

    //获取度量元数据名称
    List<String> viewMetricList(String dataSourceConnectionInfo,String dataSourceName);

    //获取所有维度元数据名称
    List<String> viewDimensionList(String dataSourceConnectionInfo,String dataSourceName);

    //获取时间维度元数据名称
    List<String> viewDateDimensionList(String dataSourceConnectionInfo,String dataSourceName);

    //获取Sql语句
    String getQuerySql(String dataSourceConnectionInfo,String dataSourceName);

}
