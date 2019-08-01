package com.talkingdata.datacloud.adapter;

import com.mashape.unirest.http.exceptions.UnirestException;
import com.talkingdata.datacloud.adapter.common.AbstractAdapter;
import com.talkingdata.datacloud.adapter.common.JdbcBean;
import com.talkingdata.datacloud.adapter.entity.DataPreviewPage;
import com.talkingdata.datacloud.entity.report.*;
import com.talkingdata.datacloud.service.report.KylinClientWrapper;
import com.talkingdata.datacloud.util.JsonUtils;
import com.talkingdata.datacloud.visual.util.Msg;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.*;

/**
 * Created by Ocean on 2017/4/11.
 */
public class KylinDataSourceAdapter extends AbstractAdapter {
    private static final Logger logger = LoggerFactory.getLogger(KylinDataSourceAdapter.class);

    private KylinClientWrapper kylinClient;

    @Override
    public boolean testConnection(String dataSourceConnectionInfo) {
        try {
            KylinDataSource kylinDataSource = JsonUtils.jsonToObject(dataSourceConnectionInfo, KylinDataSource.class);
            KylinClientWrapper kylinClientWrapper = getKylinClientWrapper(kylinDataSource);
            ProjectDesc projectDesc=kylinClientWrapper.projectByName(kylinDataSource.getProject());
            return projectDesc != null;
        }catch (UnirestException | IOException e){
            logger.error("连接测试失败");
            return false;
        }
    }

    @Override
    public List<String> viewSourceList(String dataSourceConnectionInfo) {
        List<String> sourceList = new ArrayList();
        List<CubeDesc> cubeDescList = null;
        try {
            KylinDataSource kylinDataSource = JsonUtils.jsonToObject(dataSourceConnectionInfo, KylinDataSource.class);
            KylinClientWrapper kylinClientWrapper = getKylinClientWrapper(kylinDataSource);
            cubeDescList = kylinClientWrapper.listCubesByProject(kylinDataSource.getProject());
        } catch (UnirestException e) {
            e.printStackTrace();
        }catch (IOException e) {
            e.printStackTrace();
        }
        for(CubeDesc cubeDesc:cubeDescList){
            sourceList.add(cubeDesc.name);
        }
        return sourceList;
    }

    /**
     * 获取元数据属性
     *
     * @param
     * @return
     */
    @Override
    public List<Map<String, Object>> viewMetadataPropertiesList(String dataSourceConnectionInfo,String dataSourceName) {
        List<Map<String, Object>> resultList=new ArrayList<>();
        try {
            KylinDataSource kylinDataSource = getKylinDataSource(dataSourceConnectionInfo,dataSourceName);
            CubeDetailedDesc cubeDetailedDesc = getCubeDetailedDesc(kylinDataSource);
//            Map<String,Object> headMap=new LinkedHashMap();
//            headMap.put("name","name");
//            headMap.put("table","table");
//            headMap.put("ColumnName","ColumnName");
//            headMap.put("type","type");
//            headMap.put("expression","expression");
//            resultList.add(headMap);
            for(CubeDetailedDesc.Dimension dimension:cubeDetailedDesc.dimensions){
//                dimensionMap.put("name",dimension.name);
//                dimensionMap.put("table",dimension.table);
                if("{FK}".equals(dimension.column)){
                    for(String derived:dimension.derived){
                        Map<String,Object> dimensionMap=new LinkedHashMap<>();
                        dimensionMap.put("ColumnName",derived);
                        dimensionMap.put("type","维度");
                        dimensionMap.put("ColumnType","");
                        resultList.add(dimensionMap);
                    }
                }else{
                    Map<String,Object> dimensionMap=new LinkedHashMap<>();
                    dimensionMap.put("ColumnName",dimension.column);
                    dimensionMap.put("type","维度");
                    dimensionMap.put("ColumnType","");
                    resultList.add(dimensionMap);
                }
            }
            for(CubeDetailedDesc.Measure measure:cubeDetailedDesc.measures){
                Map<String,Object> measureMap=new LinkedHashMap<>();
//                measureMap.put("name",measure.name);
//                measureMap.put("table","");
                measureMap.put("ColumnName",measure.function.parameter.value);
                measureMap.put("type","指标");
                measureMap.put("ColumnType",measure.function.expression);
                resultList.add(measureMap);
            }
        }catch (UnirestException e) {
            e.printStackTrace();
        }catch (IOException e) {
            e.printStackTrace();
        }
        return resultList;
    }

    @Override
    public Map<String, Object> viewDataSourceDataList(DataPreviewPage dataPreviewPage) {
        StringBuilder operatorSb=new StringBuilder();
        try {
            KylinDataSource kylinDataSource = getKylinDataSource(dataPreviewPage.getDataSourceConnectionInfo(),dataPreviewPage.getQuerySql());
            KylinClientWrapper kylinClientWrapper = getKylinClientWrapper(kylinDataSource);
            String project = kylinDataSource.getProject();
            String cube = kylinDataSource.getCube();
            CubeDetailedDesc cubeDetailedDesc = kylinClientWrapper.queryCubeDesc(cube);

            Map<String,String> dimensionMap=getDimensionMap(cubeDetailedDesc.dimensions);
            Map<String,String> measureMap=getMeasureMap(cubeDetailedDesc.measures);

            operatorSb.append("SELECT ");
            for(String dimension:dimensionMap.keySet()){
                operatorSb.append(dimension+",");
            }

            Set<String> metricSet=new HashSet<>();
            for(String metric:measureMap.values()){
                if("1".equals(metric))continue;
                metricSet.add(metric);
            }
            for(String metric:metricSet){
                operatorSb.append(metric+",");
            }
            operatorSb.deleteCharAt(operatorSb.length()-1);
            operatorSb.append(getJoinSqlByModel(kylinClientWrapper,project,cube));

            List<List<String>> rets=kylinClientWrapper.executeSqlRequest(project,operatorSb.toString(), dataPreviewPage.getPageSize(),0);
            List<String> columns=new ArrayList<>();
            columns.addAll(dimensionMap.keySet());
            columns.addAll(metricSet);
            List<Map<String, Object>> resultList=new ArrayList<>();
            Map<String,Object> headMap=new HashMap<>();
            for(String column:columns){
                headMap.put(column,column);
            }
            resultList.add(headMap);
            resultList.addAll(convertResult(columns,rets));
            return Msg.getSuccessData(resultList);
        }catch (Exception e){
            logger.error("数据查询错误",e);
        }
        return null;
    }



//    @Override
//    public List<Map<String, Object>> findData(QueryParameter queryParameter){
//        StringBuilder operatorSb=new StringBuilder();
//        KylinDataSource kylinDataSource;
//        try {
//            kylinDataSource = getKylinDataSource(queryParameter.getDataSourceConnectionInfo(),queryParameter.getDataSourceName());
//
//            KylinClientWrapper kylinClientWrapper =new KylinClientWrapper(kylinDataSource.getBaseUrl(),kylinDataSource.getUser(),kylinDataSource.getPassword());
//            CubeDetailedDesc cubeDetailedDesc = kylinClientWrapper.queryCubeDesc(kylinDataSource.getTableName());
//
//            Map<String,String> dimensionMap=getDimensionMap(cubeDetailedDesc.dimensions);
//            Map<String,String> measureMap=getMeasureMap(cubeDetailedDesc.measures);
//
//            StringBuilder dimensionSb=new StringBuilder();
//            operatorSb.append("SELECT ");
//            for(String dimension:queryParameter.getDimensions()){
//                dimensionSb.append(dimensionMap.get(dimension)+",");
//                operatorSb.append(dimensionMap.get(dimension)+" AS "+dimension+",");
//            }
//
//            for(String metric:queryParameter.getMetrics()){
//                operatorSb.append(metric+",");
//            }
//            operatorSb.deleteCharAt(operatorSb.length()-1);
//
//
//            operatorSb.append(getJoinSqlByModel(kylinClientWrapper,kylinDataSource.getDatabase(),kylinDataSource.getTableName()));
//
////            if(queryParameter.getFilters()!=null&&queryParameter.getFilters().size()>0){
////                for(Filter filter:queryParameter.getFilters()){
////                    if(filter.getOperator().contains("&&")){
////                        String field=filter.getField();
////                        if(dimensionMap.containsKey(field))
////                            field=dimensionMap.get(field);
////                        String[]operators=filter.getOperator().split("&&");
////                        List valueList=(List)filter.getValue();
////                        for(int i=0;i<operators.length;i++){
////                            Object value=valueList.get(i);
////                            if(value instanceof Long) {
////                                operatorSb.append(" AND " + field + " " + operators[i] + " from_unixtime(" + ((Long) valueList.get(i)) / 1000 + ")");
////                            }else {
////                                operatorSb.append(" AND " + field + " " + operators[i] + " '" + valueList.get(i) + "'");
////                            }
////                        }
////
////                    }
////                }
////            }
//
//            if(queryParameter.getDimensions()!=null&&queryParameter.getDimensions().size()>0) {
//                operatorSb.append(" GROUP BY " + dimensionSb.deleteCharAt(dimensionSb.length() - 1).toString());
//            }
//            List<List<String>> rets=kylinClientWrapper.executeSqlRequest(kylinDataSource.getDatabase(),operatorSb.toString(),queryParameter.getCount(),0);
//            List<String> columns=new ArrayList<>();
//            columns.addAll(queryParameter.getDimensions());
//            columns.addAll(queryParameter.getMetrics());
//            return convertResult(columns,rets);
//        }catch (Exception e){
//            logger.error("数据查询错误",e);
//        }
//        return null;
//    }

    //获取度量元数据名称
    @Override
    public List<String> viewMetricList(String dataSourceConnectionInfo,String dataSourceName){
        List<String> metricList=new ArrayList<>();
        try {
            KylinDataSource kylinDataSource = getKylinDataSource(dataSourceConnectionInfo,dataSourceName);
            CubeDetailedDesc cubeDetailedDesc = getCubeDetailedDesc(kylinDataSource);
            Map<String,String> metricMap=getMeasureMap(cubeDetailedDesc.measures);
            metricList.addAll(metricMap.keySet());
        }catch (Exception e){
            logger.error("获取度量元数据失败");
        }
        return metricList;
    }

    //获取所有维度元数据名称
    @Override
    public List<String> viewDimensionList(String dataSourceConnectionInfo,String dataSourceName){
        List<String> dimensionList=new ArrayList<>();
        try {
            KylinDataSource kylinDataSource = getKylinDataSource(dataSourceConnectionInfo,dataSourceName);
            CubeDetailedDesc cubeDetailedDesc = getCubeDetailedDesc(kylinDataSource);
            Map<String,String> dimensionMap=getDimensionMap(cubeDetailedDesc.dimensions);
            dimensionList.addAll(dimensionMap.keySet());
        }catch (Exception e){
            logger.error("获取度量元数据失败");
        }
        return dimensionList;
    }

    //获取时间维度元数据名称
    @Override
    public List<String> viewDateDimensionList(String dataSourceConnectionInfo,String dataSourceName){
        List<String> dateDimensionList=new ArrayList<>();
        try {
            KylinDataSource kylinDataSource = getKylinDataSource(dataSourceConnectionInfo,dataSourceName);
            KylinClientWrapper kylinClientWrapper = getKylinClientWrapper(kylinDataSource);
            String project = kylinDataSource.getProject();
            String cube = kylinDataSource.getCube();
            List<KylinMetaTable> kylinMetaTableList = kylinClientWrapper.getTablesAndColumns(project);
            CubeDetailedDesc cubeDetailedDesc = kylinClientWrapper.queryCubeDesc(cube);
            Map<String,String> dimensionsMap=getDimensionMap(cubeDetailedDesc.dimensions);

            for(String key:dimensionsMap.keySet()){
                String table=dimensionsMap.get(key).split("\\.")[0];
                for(KylinMetaTable kylinMetaTable:kylinMetaTableList){
                    if(table.equals(kylinMetaTable.getTableName())){
                        List<KylinMetaColumn> kylinMetaColumns=kylinMetaTable.getKylinMetaColumns();
                        for(KylinMetaColumn kylinMetaColumn:kylinMetaColumns){
                            if(key.equals(kylinMetaColumn.getColumnName())){
                                //元数据类型参考org.apache.kylin.jdbc.KylinMeta和MetaImpl
                                if(kylinMetaColumn.getDataType()==91||kylinMetaColumn.getDataType()==92||kylinMetaColumn.getDataType()==93){
                                    dateDimensionList.add(key);
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }catch (UnirestException | IOException e){
            logger.error("拼装JOIN语句错误",e);
        }
        return dateDimensionList;
    }


    //获取cube信息
    private CubeDetailedDesc getCubeDetailedDesc(KylinDataSource kylinDataSource) throws UnirestException, IOException{
        KylinClientWrapper kylinClientWrapper = getKylinClientWrapper(kylinDataSource);
        String cube = kylinDataSource.getCube();
        return kylinClientWrapper.queryCubeDesc(cube);
    }
    //获取cube中table的Join关系的sql语句
    private String getJoinSqlByModel(KylinClientWrapper kylinClient,String project,String cube){
        StringBuilder querySql= new StringBuilder();
        try {
            CubeDetailedDesc cubeDetailedDesc = kylinClient.queryCubeDesc(cube);
            String modelName = cubeDetailedDesc.model_name;
            ModelDesc modelDesc = kylinClient.modelByName(project, modelName);

            querySql.append(" from " + getJoinTableByModel(modelDesc));
            querySql.append(" where 1=1 ");
            if (modelDesc.filter_condition != null) {
                querySql.append(" AND " + modelDesc.filter_condition);
            }
        }catch (UnirestException | IOException e){
            logger.error("拼装JOIN语句错误",e);
        }
        return querySql.toString();
    }

    //获取cube中table的Join关系
    private String getJoinTableByModel(ModelDesc modelDesc){
        String fact_table=modelDesc.fact_table.replace("DEFAULT.","");
        StringBuffer tableJoinSb=new StringBuffer();
        tableJoinSb.append(fact_table+" ");
        for(ModelDesc.Lookups lookups:modelDesc.lookups){
            StringBuilder tableJoin=new StringBuilder();
            String lookupsTable=lookups.table.replace("DEFAULT.","");
            ModelDesc.Join join=lookups.join;
            tableJoin.append(" "+join.type + " join "+ lookupsTable + " on ");
            for(int index=0;index<join.primary_key.size();index++){
                if(index > 0){
                    tableJoin.append(" AND ");
                }
                String primary_key=join.primary_key.get(index);
                String foreign_key=join.foreign_key.get(index);
                tableJoin.append(fact_table + "."+foreign_key + " = " + lookupsTable + "." + primary_key);
            }
            tableJoinSb.append(tableJoin.toString());
        }
        return tableJoinSb.toString();
    }



    //获取model中的table名称
    private List<String> getTableByModel(ModelDesc modelDesc){
        List<String> tableList=new ArrayList<>();
        String fact_table=modelDesc.fact_table.replace("DEFAULT.","");
        tableList.add(fact_table);

        for(ModelDesc.Lookups lookups:modelDesc.lookups){
            String lookupsTable=lookups.table.replace("DEFAULT.","");
            tableList.add(lookupsTable);
        }
        return tableList;
    }

    //获取维度字段
    private Map<String,String> getDimensionMap(List<CubeDetailedDesc.Dimension> dimensionList){
        //map的key为字段名，value为表名+字段名
        Map<String,String>dimensionMap=new HashMap();
        for(CubeDetailedDesc.Dimension dimension:dimensionList){
            String table=dimension.table.replace("DEFAULT.","");
            if(!"{FK}".equals(dimension.column)){
                dimensionMap.put(dimension.column,table+"."+dimension.column);
            }else{
                for(String derived:dimension.derived){
                    dimensionMap.put(derived,table+"."+derived);
                }
            }
        }
        return dimensionMap;
    }
    //获取度量字段
    private Map<String,String> getMeasureMap(List<CubeDetailedDesc.Measure> measureList){
        //map的key为字段名，value为表名
        Map<String,String>measureMap=new HashMap();
        for(CubeDetailedDesc.Measure measure:measureList){
            CubeDetailedDesc.Function function=measure.function;
            CubeDetailedDesc.Parameter parameter=function.parameter;
            String expression=function.expression;
            if("COUNT_DISTINCT".equals(expression)){
                measureMap.put("count(distinct "+parameter.value+")",parameter.value);
            }else if("TOP_N".equals(expression)){
                measureMap.put("top("+parameter.value+")",parameter.value);
            }else{
                measureMap.put(expression+"("+parameter.value+")",parameter.value);
            }
        }
        return measureMap;
    }


    //获取kylin链接
    private KylinClientWrapper getKylinClientWrapper(KylinDataSource kylinDataSource){
        if(kylinClient!=null){
            return kylinClient;
        }
        kylinClient=new KylinClientWrapper(kylinDataSource.getBaseUrl(),kylinDataSource.getUser(),kylinDataSource.getPassword());
        return kylinClient;
    }

    private KylinDataSource getKylinDataSource(String dataSourceConnectionInfo,String dataSourceName)throws IOException{
        KylinDataSource kylinDataSource = JsonUtils.jsonToObject(dataSourceConnectionInfo, KylinDataSource.class);
        kylinDataSource.setTableName(dataSourceName);
        return kylinDataSource;
    }

    public static class KylinDataSource extends JdbcBean{
        public String getProject() {
            return getDatabase();
        }

        public String getCube() {
            return getTableName();
        }

        public String getBaseUrl(){
            return "http://"+this.getHost()+":"+this.getPort();
        }
    }

    public static void main(String[]args){
        KylinDataSourceAdapter kylinDataSourceAdapter=new KylinDataSourceAdapter();
        String dataSource="{\"host\": \"172.23.6.3\",\"port\": \"7070\", \"user\": \"ADMIN\", \"password\": \"KYLIN\", \"database\": \"learn_kylin\"}";
//        QueryParameter queryParameter=new QueryParameter();
//        queryParameter.setDatasource("{\"host\": \"172.23.6.3\",\"port\": \"7070\", \"username\": \"ADMIN\", \"password\": \"KYLIN\", \"project\": \"learn_kylin\" , \"cube\":\"kylin_sales_cube\"}");
//        List<String> dimensions=new ArrayList<>();
//        dimensions.add("META_CATEG_NAME");
//        queryParameter.setDimensions(dimensions);
//        List<String> metrics=new ArrayList<>();
//        metrics.add("SUM(PRICE)");
//        queryParameter.setMetrics(metrics);
//
//        List<Filter> filters=new ArrayList<>();
//        Filter filter=new Filter();
//        filter.setField("PART_DT");
//        filter.setOperator(">=&&<=");
//        List<String>values=new ArrayList<>();
//        values.add("2011-01-01");
//        values.add("2013-01-01");
//        filter.setValue(values);
//        filters.add(filter);
//
//        queryParameter.setFilters(filters);
//
//        Object object0=kylinDataSourceAdapter.findData(queryParameter);
//        try{
//            logger.info("返回结果："+JsonUtils.objectToJsonStr(object0));
//        }catch (Exception e){
//            logger.error("Json转换错误",e);
//        }


//        Object object=kylinDataSourceAdapter.testConnection(dataSource);
//        Object object=kylinDataSourceAdapter.viewSourceList(dataSource);
//        Object object=kylinDataSourceAdapter.viewMetadataPropertiesList(dataSource);
//        Object object=kylinDataSourceAdapter.viewMetricList(dataSource);
//        Object object=kylinDataSourceAdapter.viewDimensionList(dataSource);
        Object object=kylinDataSourceAdapter.viewDateDimensionList(dataSource,"kylin_sales_cube");
        try{
            logger.info("返回结果2："+JsonUtils.objectToJsonStr(object));
        }catch (Exception e){
            logger.error("OperatorParameter参数有误",e);
        }


    }

}


