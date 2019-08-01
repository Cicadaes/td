package com.talkingdata.datacloud.adapter;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.talkingdata.datacloud.adapter.common.ConfigDefinitionAdapter;
import com.talkingdata.datacloud.adapter.common.ParameterUtil;
import com.talkingdata.datacloud.operator.entity.OperatorParameter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Ocean on 2017/4/11.
 */
public class CatalogDataSourceAdapter extends ConfigDefinitionAdapter {
    private static final Logger logger = LoggerFactory.getLogger(CatalogDataSourceAdapter.class);

    public boolean testConnection(List<OperatorParameter> parameters) {
        Map<String, Object> queryParam = new HashMap<>();
        try {
            HttpResponse<String> jsonResponse = Unirest.get("http://172.23.6.2:9090/web/catalog/catalogs/tree")
                    .queryString(queryParam)
                    .asString();
            return jsonResponse.getStatus() == 200;
        }catch (UnirestException e){
            logger.error("连接测试失败");
            return false;
        }
    }

    public Object findData(List<OperatorParameter> parameters) {
        Map<String, Object> queryParam = new HashMap<>();
        try {
            OperatorParameter urlParameter = ParameterUtil.getParameter(parameters, "url");
            OperatorParameter datasetIdParameter = ParameterUtil.getParameter(parameters, "path");
            OperatorParameter fieldParameter = ParameterUtil.getParameter(parameters, "field");
            //拼出url为http://172.23.6.2:9090/web/catalog/datasetSamples?datasetId=2&fields
            HttpResponse<String> jsonResponse = Unirest.get((String) urlParameter.getValue() + "datasetSamples?datasetId="
                    + (String)datasetIdParameter.getValue() + "&fields="+(String)fieldParameter.getValue())
                    .queryString(queryParam)
                    .asString();
            String dataResult=jsonResponse.getBody();
            return dataResult;
        }catch (UnirestException e){
            logger.error("获取结果失败");
            return false;
        }
    }

    public List<String> viewSourceList(List<OperatorParameter> parameters) {
        Map<String, Object> queryParam = new HashMap<>();
        try {
            OperatorParameter urlParameter = ParameterUtil.getParameter(parameters, "url");
            OperatorParameter catalogsParameter = ParameterUtil.getParameter(parameters, "catalogs");
            //拼出url为http://172.23.6.2:9090/web/catalog/catalogs
            HttpResponse<String> jsonResponse = Unirest.get((String) urlParameter.getValue()+(String)catalogsParameter.getValue())
                    .queryString(queryParam)
                    .asString();
            String catalogJson=jsonResponse.getBody();
            JSONArray jsonArray= JSON.parseArray(catalogJson);
            List<String> resultList=new ArrayList<>();
            for(Object json:jsonArray){
                resultList.add(((JSON)json).toJSONString());
            }
            return resultList;
        }catch (Exception e){
            logger.error("获取结果失败");
            return null;
        }
    }

//    @Override
    public List<String> viewFieldList(List<OperatorParameter> parameters) {
        Map<String, Object> queryParam = new HashMap<>();
        try {
            OperatorParameter urlParameter = ParameterUtil.getParameter(parameters, "url");
            OperatorParameter datasetIdParameter = ParameterUtil.getParameter(parameters, "datasetId");
            //拼出url为http://172.23.5.177/web/catalog/fieldDetails?datasetId=2
            HttpResponse<String> jsonResponse = Unirest.get((String) urlParameter.getValue()+"fieldDetails?datasetId="+(String)datasetIdParameter.getValue())
                    .queryString(queryParam)
                    .asString();
            String catalogJson=jsonResponse.getBody();
            JSONArray jsonArray= JSON.parseArray(catalogJson);
            List<String> resultList=new ArrayList<>();
            for(Object json:jsonArray){
                resultList.add(((JSON)json).toJSONString());
            }
            return resultList;
        }catch (Exception e){
            logger.error("获取结果失败");
            return null;
        }
    }

    public static void main(String []srgs){
        CatalogDataSourceAdapter catalogDataSourceAdapter=new CatalogDataSourceAdapter();
        boolean result=catalogDataSourceAdapter.testConnection(null);
        System.out.print(result);
    }
}
