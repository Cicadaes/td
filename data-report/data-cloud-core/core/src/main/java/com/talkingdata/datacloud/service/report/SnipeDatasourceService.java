package com.talkingdata.datacloud.service.report;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.talkingdata.datacloud.entity.report.*;
import com.talkingdata.datacloud.page.report.SnipeDatasourcePage;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.talkingdata.datacloud.enums.report.DataSourceTypeEnum;
import org.apache.commons.collections.map.HashedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.talkingdata.datacloud.base.service.BaseService;
import com.talkingdata.datacloud.dao.report.SnipeDatasourceDao;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * <br>
 * <b>功能：</b>TD_DC_SNIPE_DATASOURCE SnipeDatasourceService<br>
 * <b>作者：</b>code generator<br>
 * <b>日期：</b> 2017-02-28 <br>
 * <b>版权所有：<b>Copyright(C) 2015, Beijing TendCloud Science & Technology Co., Ltd.<br>
 */
@Service("snipeDatasourceService")
@Transactional(value = "transactionManager", readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = Throwable.class)
public class SnipeDatasourceService extends BaseService<SnipeDatasource, Integer> {

    private static final Logger logger = LoggerFactory.getLogger(SnipeDatasourceService.class);

    @Autowired
    private SnipeDatasourceDao dao;

    public SnipeDatasourceDao getDao() {
        return dao;
    }

    public Map<SnipeDatasource, List<DatasetDec>> getDatasetSchemaList() throws Exception {
        //从所有数据源中获取数据集列表及元数据,先使用最简单直接的方案
        //遍历数据源配置，逐个请求。
        SnipeDatasourcePage page = new SnipeDatasourcePage();
        List<SnipeDatasource> datasourceList = this.queryByList(page);
        if (datasourceList == null) {
            return null;
        }
        Map<SnipeDatasource, List<DatasetDec>> metadatas = new HashMap<>();
        for (SnipeDatasource ds : datasourceList) {
            int type = ds.getType();
            String apiJsonStr = ds.getConfig();
            if (type == DataSourceTypeEnum.HTTP.getValue()) {
                ObjectMapper mapper = new ObjectMapper();
                DatasourceConf conf = mapper.readValue(apiJsonStr, DatasourceConf.class);
                if (conf == null) {
                    logger.error("DataSource :{} config is null. please check database.", ds.getName());
                    continue;
                }
                try {
                    List<DatasetDec> datasetDecs = getSchemaList(conf);
                    metadatas.put(ds, datasetDecs);
                } catch (Exception e) {
                    logger.error("DataSource :{} connect error. error:{}", ds.getName(), e.getMessage());
                    continue;
                }
            }
            // TODO: 2017/3/4 其他连接方式支持
        }
        return metadatas;
    }

    public DatasetDec getDatasetSchemaByDataId(int datasourceId, String dataId) throws Exception {
        SnipeDatasource ds = this.selectByPrimaryKey(datasourceId);
        if (ds == null) {
            return null;
        }
        int type = ds.getType();
        String apiJsonStr = ds.getConfig();
        if (type == DataSourceTypeEnum.HTTP.getValue()) {
            ObjectMapper mapper = new ObjectMapper();
            DatasourceConf conf = mapper.readValue(apiJsonStr, DatasourceConf.class);
            if (conf == null) {
                logger.error("DataSource :{} config is null. please check database.", ds.getName());
            }
            DatasetDec datasetDec = getSchemaByDataId(conf, dataId);
            return datasetDec;
        }
        // TODO: 2017/3/4 其他连接方式支持
        return null;
    }

    public List<DataSetFieldData> getDataByFilter(List<String> fields, String dataId, int datasourceId) throws Exception {
        SnipeDatasource datasource = this.selectByPrimaryKey(datasourceId);
        if (datasource == null) {
            return null;
        }
        int type = datasource.getType();
        String apiJsonStr = datasource.getConfig();
        if (type == DataSourceTypeEnum.HTTP.getValue()) {
            ObjectMapper mapper = new ObjectMapper();
            DatasourceConf conf = mapper.readValue(apiJsonStr, DatasourceConf.class);
            if (conf == null) {
                logger.error("DataSource :{} config is null. please check database.", datasource.getName());
            }
            try {
                DataFilter filter = new DataFilter();
                List<DatasetMetric> metrics = new ArrayList<>();
                for (String field : fields) {
                    DatasetMetric metric = new DatasetMetric();
                    metric.setName(field);
                    metrics.add(metric);
                }
                List<DatasetDimension> dimensions = new ArrayList<>();
                List<String> dataIds = new ArrayList<>();
                dataIds.add(dataId);
                DatasetDimension dimension = new DatasetDimension();
                dimension.setName("dataId"); //通过dataId来获取
                dimension.setValue(dataIds);
                dimensions.add(dimension);

                filter.setDimensions(dimensions);
                filter.setMetrics(metrics);

                List<DataSetFieldData> dataSetFieldDatas = getDataByFilter(conf, filter);
                return dataSetFieldDatas;
            } catch (Exception e) {
                logger.error("DataSource :{} connect error. error:{}", datasource.getName(), e.getMessage());
            }
        }
        // TODO: 2017/3/4 其他连接方式支持
        return null;
    }

    private List<DatasetDec> getSchemaList(DatasourceConf conf) throws Exception {
        HttpResponse<JsonNode> jsonResponse = Unirest.get(conf.getUrl() + conf.getSchema())
                .asJson();
        if (jsonResponse == null || jsonResponse.getBody().getArray() == null) {
            return null;
        }
        String ret = jsonResponse.getBody().getObject().getJSONArray("result").toString();
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        return mapper.readValue(ret, new TypeReference<List<DatasetDec>>() {
        });
    }

    private DatasetDec getSchemaByDataId(DatasourceConf conf, String dataId) throws Exception {
        HttpResponse<JsonNode> jsonResponse = Unirest.get(conf.getUrl() + conf.getSchema() + dataId)
                .asJson();
        if (jsonResponse == null || jsonResponse.getBody().getArray() == null) {
            return null;
        }
        String ret = jsonResponse.getBody().getObject().getJSONArray("result").toString();
        ObjectMapper mapper = new ObjectMapper();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        List<DatasetDec> datasetDecs = mapper.readValue(ret, new TypeReference<List<DatasetDec>>() {
        });
        for (DatasetDec dec : datasetDecs) {
            if (dec.getDataId().equals(dataId)) {
                return dec;
            }
        }
        return null;
    }

    private List<DataSetFieldData> getDataByFilter(DatasourceConf conf, DataFilter filter) throws Exception {


        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> filterMap = new HashMap<>();
        filterMap.put("metrics", filter.getMetrics());
        filterMap.put("dimensions", filter.getDimensions());
        HttpResponse<JsonNode> jsonResponse = Unirest.post(conf.getUrl() + conf.getData())
                .header("accept", "application/json")
                .header("Content-Type", "application/json")
                .body(mapper.writeValueAsString(filter))
                .asJson();
        if (jsonResponse == null || jsonResponse.getBody().getArray() == null) {
            return null;
        }
        String ret = jsonResponse.getBody().getObject().getJSONArray("result").toString();
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        return mapper.readValue(ret, new TypeReference<List<DataSetFieldData>>() {
        });
    }
}
