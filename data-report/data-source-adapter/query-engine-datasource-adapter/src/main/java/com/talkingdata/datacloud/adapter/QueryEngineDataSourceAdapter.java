package com.talkingdata.datacloud.adapter;

import com.talkingdata.datacloud.adapter.common.AbstractAdapter;
import com.talkingdata.datacloud.adapter.common.JdbcBean;
import com.talkingdata.datacloud.adapter.util.DataBaseUtil;
import com.talkingdata.datacloud.adapter.util.HttpRestUtil;
import com.talkingdata.datacloud.adapter.entity.QueryParameter;
import com.talkingdata.datacloud.visual.util.JSONUtils;
import org.json.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

/**
 * Created by Ocean on 2017/4/11.
 */
public class QueryEngineDataSourceAdapter extends AbstractAdapter{
    private static final Logger logger = LoggerFactory.getLogger(QueryEngineDataSourceAdapter.class);

    @Override
    public boolean testConnection(String dataSourceConnectionInfo) {
        QueryEngineJdbcBean queryEngineJdbcBean=JdbcBean.getJdbcBean(dataSourceConnectionInfo,QueryEngineJdbcBean.class);
        return HttpRestUtil.testConnection(queryEngineJdbcBean.getTableUrl());
    }

    @Override
    public List<String> viewSourceList(String dataSourceConnectionInfo) {
        List<String> sourceList = new ArrayList();
        QueryEngineJdbcBean queryEngineJdbcBean=JdbcBean.getJdbcBean(dataSourceConnectionInfo,QueryEngineJdbcBean.class);
        JSONArray jsonArray=HttpRestUtil.getJson(queryEngineJdbcBean.getTableUrl());
        for(int i=0;i<jsonArray.length();i++){
            sourceList.add(jsonArray.getString(i));
        }
        return sourceList;
    }


    @Override
    public List<Map<String, Object>> viewMetadataPropertiesList(String dataSourceConnectionInfo,String dataSourceName) {
        QueryEngineJdbcBean queryEngineJdbcBean=getQueryEngineJdbcBean(dataSourceConnectionInfo,dataSourceName);
        String querySql = "select * from "+ queryEngineJdbcBean.getTableName();
        Map<String, Object> requestParameter = new HashMap<>();
        requestParameter.put("sql", querySql);
        requestParameter.put("project", queryEngineJdbcBean.getIndex());
        requestParameter.put("limit", 1);
        try {
            String body= JSONUtils.writeValueAsString(requestParameter);
            String responseJson=HttpRestUtil.postJson(queryEngineJdbcBean.getQueryUrl(),body);
            return getColumnProperties(responseJson);
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

//    @Override
    public List<Map<String,Object>> viewSampleDataList(String dataSourceConnectionInfo,String dataSourceName,Integer count) {
        List<Map<String,Object>> sampleDataMapList=new ArrayList<>();
        QueryEngineJdbcBean queryEngineJdbcBean=getQueryEngineJdbcBean(dataSourceConnectionInfo,dataSourceName);
        String querySql = "select * from "+ queryEngineJdbcBean.getTableName();
        Map<String, Object> requestParameter = new HashMap<>();
        requestParameter.put("sql", querySql);
        requestParameter.put("project", queryEngineJdbcBean.getIndex());
        requestParameter.put("limit", count);
        List<Map<String,Object>>resultMapList = getResult(queryEngineJdbcBean,requestParameter);
        //增加表头
        Map<String,Object> headMap=new HashMap<>();
        for(String key:resultMapList.get(0).keySet()){
            headMap.put(key,key);
        }
        sampleDataMapList.add(headMap);
        sampleDataMapList.addAll(resultMapList);
        return sampleDataMapList;
    }

    @Override
    public List<Map<String, Object>> findData(QueryParameter queryParameter) {
        //便于测试，把查询语句去掉
        queryParameter.setFilters(null);


        QueryEngineJdbcBean queryEngineJdbcBean=
                getQueryEngineJdbcBean(queryParameter.getDataSourceConnectionInfo(),queryParameter.getDataSourceName());
        String querySql= DataBaseUtil.assemblingSql(queryEngineJdbcBean,queryParameter);
        Map<String, Object> requestParameter = new HashMap<>();
        requestParameter.put("sql", querySql);
        requestParameter.put("project", queryEngineJdbcBean.getIndex());
        requestParameter.put("limit", queryParameter.getCount());

        return getResult(queryEngineJdbcBean,requestParameter);
    }

    //获取度量元数据名称
    @Override
    public List<String> viewMetricList(String dataSourceConnectionInfo,String dataSourceName){
        QueryEngineJdbcBean queryEngineJdbcBean=getQueryEngineJdbcBean(dataSourceConnectionInfo,dataSourceName);
        String querySql = "select * from "+ queryEngineJdbcBean.getTableName();
        Map<String, Object> requestParameter = new HashMap<>();
        requestParameter.put("sql", querySql);
        requestParameter.put("project", queryEngineJdbcBean.getIndex());
        requestParameter.put("limit", 1);
        try {
            String body= JSONUtils.writeValueAsString(requestParameter);
            String responseJson=HttpRestUtil.postJson(queryEngineJdbcBean.getQueryUrl(),body);
            return  getMeasure(responseJson);
        }catch (Exception e){
            logger.error("获取度量元数据失败");
        }
        return new ArrayList<>();
    }

    //获取维度元数据名称
    @Override
    public List<String> viewDimensionList(String dataSourceConnectionInfo,String dataSourceName){
        List<String> dimensionList = new ArrayList();
        QueryEngineJdbcBean queryEngineJdbcBean=getQueryEngineJdbcBean(dataSourceConnectionInfo,dataSourceName);
        JSONArray jsonArray=HttpRestUtil.getJson(queryEngineJdbcBean.getFieldUrl());
        for(int i=0;i<jsonArray.length();i++){
            dimensionList.add(jsonArray.getString(i));
        }
        return dimensionList;
    }

    private List<String> getMeasure(String body){
        List<String> resultList=new ArrayList<>();
        Set<String> measureTypeSet=new HashSet<>();
        measureTypeSet.add("TINYINT");
        measureTypeSet.add("SMALLINT");
        measureTypeSet.add("INT");
        measureTypeSet.add("INTEGER");
        measureTypeSet.add("MEDIUMINT");
        measureTypeSet.add("BIGINT");
        measureTypeSet.add("DECIMAL");
        measureTypeSet.add("NUMERIC");
        measureTypeSet.add("FLOAT");
        measureTypeSet.add("DOUBLE");
        measureTypeSet.add("REAL");
        try {
            Map<String, Object> resultMap = JSONUtils.readValueToMap(body);
            List<Map<String,String>>columnMetas=(List)resultMap.get("columnMetas");
            for(Map<String,String> columnMeta:columnMetas){
                String columnType=columnMeta.get("columnTypeName");
                if(measureTypeSet.contains(columnType)){
                    resultList.add(columnMeta.get("name"));
                }
            }
            return resultList;
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ArrayList<>();
    }



    private List<Map<String, Object>> getColumnProperties(String body){
        List<Map<String,Object>> resultMapList=new ArrayList<>();
        try {
            Map<String, Object> resultMap = JSONUtils.readValueToMap(body);
            List<Map<String,Object>>columnMetas=(List)resultMap.get("columnMetas");
            List<Map<String,Object>>showColumnMetas=new ArrayList<>();
            for(Map columnMap:columnMetas){
                Map<String,Object> showColumnMap=new LinkedHashMap<>();
                showColumnMap.put("name",columnMap.get("name"));
                showColumnMap.put("type",columnMap.get("columnTypeName")+"("+columnMap.get("displaySize")+")");
                showColumnMetas.add(showColumnMap);
            }

            //增加表头
            Map<String,Object> headMap=new LinkedHashMap<>();
            headMap.put("name","name");
            headMap.put("type","type");

            resultMapList.add(headMap);

            resultMapList.addAll(showColumnMetas);
            return resultMapList;
        }catch (Exception e){
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

    private List<Map<String, Object>> getResult(QueryEngineJdbcBean queryEngineJdbcBean,Map<String, Object> requestParameter){
        try {
            String body= JSONUtils.writeValueAsString(requestParameter);
            String responseJson=HttpRestUtil.postJson(queryEngineJdbcBean.getQueryUrl(),body);
            return convertResult(responseJson);
        }catch (Exception e){
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private List<Map<String, Object>> convertResult(String resultJson){
        List<Map<String,Object>> resultMapList=new ArrayList<>();
        try {
            List<String> columnList=new ArrayList<>();
            Map<String, Object> bodyMap = JSONUtils.readValueToMap(resultJson);
            if((boolean)bodyMap.get("isException")){
                return resultMapList;
            }
            List<Map<String,String>>columnMetas=(List)bodyMap.get("columnMetas");

            for(Map<String,String> columnMeta:columnMetas){
                String columnName=columnMeta.get("name");
                columnList.add(columnName);
            }
            List<List<String>>results=(List)bodyMap.get("results");
            resultMapList.addAll(convertResult(columnList,results));
            return resultMapList;
        }catch (Exception e){
            e.printStackTrace();
            return new ArrayList<>();
        }
    }


    private static QueryEngineJdbcBean getQueryEngineJdbcBean(String dataSourceConnectionInfo,String dataSourceName){
        QueryEngineJdbcBean queryEngineJdbcBean=JdbcBean.getJdbcBean(dataSourceConnectionInfo,QueryEngineJdbcBean.class);
        queryEngineJdbcBean.setTableName(dataSourceName);
        return queryEngineJdbcBean;
    }

    public static class QueryEngineJdbcBean extends JdbcBean {
        public String getIndex() {
            return getDatabase();
        }
        @Override
        public String getTableName() {
            return getDatabase()+"."+super.getTableName();
        }

        public String getUrl(){
            return String.format("http://%s:%s/query-engine/api/",getHost(),getPort());
        }

        public String getTableUrl(){
            return getUrl()+"tables?index="+getIndex();
        }

        public String getFieldUrl(){
            return getUrl()+"fields?index="+getIndex()+"&table="+super.getTableName();
        }

        public String getQueryUrl(){
            return getUrl()+"query";
        }
    }

    public static void main(String[]args){
        QueryEngineDataSourceAdapter queryEngineDataSourceAdapter=new QueryEngineDataSourceAdapter();
        String dataSource="{\"host\": \"172.23.6.2\",\"port\": \"9096\", \"user\": \"\", \"password\": \"\", \"database\": \"usa\" , \"tableName\":\"zips\"}";

//        logger.info("testConnection："+ queryEngineDataSourceAdapter.testConnection(dataSource));
//        logger.info("viewSourceList："+ queryEngineDataSourceAdapter.viewSourceList(dataSource));
////        logger.info("viewMetadataPropertiesList："+ queryEngineDataSourceAdapter.viewMetadataPropertiesList(dataSource));
//        logger.info("viewMetricList："+ queryEngineDataSourceAdapter.viewMetricList(dataSource));
//        logger.info("viewDimensionList："+ queryEngineDataSourceAdapter.viewDimensionList(dataSource));

//        QueryParameter queryParameter=new QueryParameter();
//        queryParameter.setDatasource(dataSource);
//        List<String> dimensions=new ArrayList<>();
//        dimensions.add("state");
//        dimensions.add("city");
//        queryParameter.setDimensions(dimensions);
//        List<String> metrics=new ArrayList<>();
//        metrics.add("POP");
//        queryParameter.setMetrics(metrics);

//        List<Filter> filters=new ArrayList<>();
//        Filter filter=new Filter();
//        filter.setField("PART_DT");
//        filter.setOperator(">=&&<=");
//        List<String>values=new ArrayList<>();
//        values.add("2011-01-01");
//        values.add("2013-01-01");
//        filter.setValue(values);
//        filters.add(filter);
//        queryParameter.setFilters(filters);
//        logger.info("findData："+ queryEngineDataSourceAdapter.findData(queryParameter));
    }

}
