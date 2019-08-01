package com.talkingdata.marketing.streaming.util;

import org.apache.http.HttpHost;
import org.elasticsearch.action.DocWriteRequest;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.bulk.BulkProcessor;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.unit.ByteSizeUnit;
import org.elasticsearch.common.unit.ByteSizeValue;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.threadpool.ThreadPool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Created by tend on 2017/11/7.
 */
@Lazy
@Component
public class EsUtils {
    private static final Logger logger = LoggerFactory.getLogger(EsUtils.class);
    /**
     * 多个es.hostname之间的分隔符
     */
    private static final String HOST_NAME_SEPARATOR = ",";
    /**
     * 写到ES的数据的失败后处理的key的分隔符
     */
    private static final String FAIL_INDEX_KEY_SEPARATOR = "-";
    /**
     * 写到ES的数据的失败后处理的唯一key的分隔符
     */
    private static final String FAIL_UNIQE_KEY_SEPARATOR = "##,##";

    @Value("${es.hostname}")
    private String esHostNames;

    @Value("${es.port}")
    private Integer esPort;

    @Value("${es.node.name}")
    private String esNodeName;

    @Value("${es.bulk.action.size}")
    private Integer esBulkActionSize;

    @Value("${es.bulk.size.mb}")
    private Integer esBulkSizeMb;

    @Value("${es.bulk.flush.interval.seconds}")
    private Integer esFlushInterval;

    private RestClient restClient;

    private BulkProcessor bulkProcessor;

    @PostConstruct
    public RestClient initRestClient() {
        if (restClient == null) {
            synchronized (this) {
                String[] esHostArr = esHostNames.split(HOST_NAME_SEPARATOR);
                HttpHost[] httpHosts = new HttpHost[esHostArr.length];
                for (int i = 0; i < esHostArr.length; i++) {
                    httpHosts[i] = new HttpHost(esHostArr[i], esPort, "http");
                }
                restClient = RestClient.builder(httpHosts).build();
                initBulkProcessor();
            }
            logger.info("es rest client init success");
        }
        return restClient;
    }

    /**
     * 向es指定的index，type下追加一条记录
     *
     * @param index  es index
     * @param type   es type
     * @param source json格式的数据
     */
    public boolean index(String index, String type, String source) {
        RestHighLevelClient client = new RestHighLevelClient(restClient);
        IndexRequest request = new IndexRequest(index, type);
        request.source(source, XContentType.JSON);
        try {
            IndexResponse response = client.index(request);
            Integer status = 203;
            if (response.status().getStatus() > status) {
                logger.warn("index: {}, type: {}, source: {}, index return status: {}",
                        index, type, source, response.status().getStatus());
                return false;
            }
        } catch (IOException e) {
            logger.error("index: {}, type: {}, source: {}, index has exception: ", index, type, source, e);
            return false;
        }
        return true;
    }

    /**
     * 根据Id进行获取es的source
     *
     * @param index es index
     * @param type  es type
     * @param id    es id
     * @return 返回source，如果异常返回空字符
     */
    public String getById(String index, String type, String id) {
        RestHighLevelClient client = new RestHighLevelClient(restClient);
        GetRequest getRequest = new GetRequest(index, type, id);
        try {
            GetResponse getFields = client.get(getRequest);
            return getFields.getSourceAsString();
        } catch (IOException e) {
            logger.error("index: {}, type: {}, id: {}, source: {}, get has exception: ", index, type, id, e);
        }
        return "";
    }

    /**
     * 批量写入ES
     *
     * @param index  es index
     * @param type   es type
     * @param source json格式的数据
     */
    public void bulk(String index, String type, String source) {
        IndexRequest request = new IndexRequest(index, type);
        request.source(source, XContentType.JSON);
        bulkProcessor.add(request);
    }

    @PreDestroy
    public void close() {
        if (restClient != null) {
            try {
                restClient.close();
                logger.info("es rest client close success");
            } catch (IOException e) {
                logger.error("close es rest client has IOException: ", e);
            }
        }
    }

    /**
     * 初始化异步bulk写数据到ES的BulkProcessor类
     */
    private void initBulkProcessor() {
        if (bulkProcessor == null) {
            synchronized (this) {
                RestHighLevelClient client = new RestHighLevelClient(restClient);
                Map<String, String> map = new HashMap<>(2);
                map.put("node.name", esNodeName);
                Settings settings = Settings.builder().put(map).build();
                ThreadPool threadPool = new ThreadPool(settings);
                BulkProcessor.Builder builder = new BulkProcessor.Builder(client::bulkAsync, new BulkProcessor.Listener() {
                    @Override
                    public void beforeBulk(long executionId, BulkRequest request) {
                        logger.info("es bulk batch executionId: {} start ", executionId);
                    }

                    @Override
                    public void afterBulk(long executionId, BulkRequest request, BulkResponse response) {
                        logger.info("es bulk batch executionId: {} end ", executionId);
                        if (response.hasFailures()) {
                            Map<String, String> data = handleFailures(request, response);
                            // 此处可能丢失写失败的数据 !!!!
                            logger.error("es bulk batch executionId: {} end, has failures, failures size: {}", executionId, data.size());
                        }
                    }

                    @Override
                    public void afterBulk(long executionId, BulkRequest request, Throwable failure) {
                        logger.error("es bulk batch executionId: {} has exception ", executionId, failure);
                        Map<String, String> data = handleFailures(request, null);
                        // 此处可能丢失写失败的数据 !!!!
                        logger.error("es bulk batch executionId: {} end, exception, failures size: {}", executionId, data.size());
                    }
                }, threadPool);
                // 多少条会执行提交, 默认1000
                builder.setBulkActions(esBulkActionSize);
                // 默认是5M
                builder.setBulkSize(new ByteSizeValue(esBulkSizeMb, ByteSizeUnit.MB));
                builder.setFlushInterval(TimeValue.timeValueSeconds(esFlushInterval));
                bulkProcessor = builder.build();
            }
        }
    }

    /**
     * 获取bulk写ES失败之后的失败的数据
     *
     * @param request  BulkRequest
     * @param response BulkResponse
     * @return 返回写ES失败的数据，key: index-type##,##id, value: json
     */
    private Map<String, String> handleFailures(BulkRequest request, BulkResponse response) {
        List<String> failKey = new ArrayList<>();
        Map<String, String> data;
        if (response != null) {
            BulkItemResponse[] items = response.getItems();
            for (BulkItemResponse item : items) {
                if (item.isFailed()) {
                    failKey.add(indexKey(item.getIndex(), item.getType(), item.getId()));
                }
            }
            data = new HashMap<>(failKey.size());
        } else {
            data = new HashMap<>(request.requests().size());
        }
        List<DocWriteRequest> bulkRequest = request.requests();
        IndexRequest indexRequest;
        for (DocWriteRequest docWriteRequest : bulkRequest) {
            if (docWriteRequest instanceof IndexRequest) {
                indexRequest = (IndexRequest) docWriteRequest;
                if (response == null || failKey.contains(indexKey(indexRequest.index(), indexRequest.type(), indexRequest.id()))) {
                    String key = indexRequest.index() + FAIL_INDEX_KEY_SEPARATOR + indexRequest.type() + FAIL_UNIQE_KEY_SEPARATOR + indexRequest.id();
                    data.put(key, indexRequest.source().utf8ToString());
                }
            }
        }
        return data;
    }

    private String indexKey(String index, String type, String id) {
        return index + FAIL_INDEX_KEY_SEPARATOR + type + FAIL_INDEX_KEY_SEPARATOR + id;
    }

}
