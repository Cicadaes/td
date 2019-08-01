package com.talkingdata.marketing.batch.producer;

import com.talkingdata.marketing.batch.es.MktRestHighLevelClient;
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.*;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.search.Scroll;
import org.elasticsearch.search.SearchHit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Created by tend on 2017/11/21.
 */
public abstract class AbstractEsSearchScroll<T> {
    private static final Logger logger = LoggerFactory.getLogger(AbstractEsSearchScroll.class);
    /**
     * 多个es.hostname之间的分隔符
     */
    private static final String HOST_NAME_SEPARATOR = ",";

    @Value("${es.hostname}")
    private String esHostNames;

    @Value("${es.port}")
    private Integer esPort;

    private RestClient restClient;

    /**
     * 用于处理Search scroll ES 查询失败，但可能已经处理了一些数据
     * 该方法可通过已经处理了的offset，来用于保证重复处理ES数据问题
     *
     * @param t      T
     * @param offset 表示该次查询已经处理了的数据的条数
     */
    public abstract void readEsFailHandler(T t, Integer offset);

    /**
     * 通过offset，判断该批次的数据，是否需要处理
     *
     * @param t      T
     * @param offset 表示该次查询已经处理了的数据的条数
     * @return 如果需要处理，返回true，否则返回false
     */
    public abstract boolean isProcessDataByOffset(T t, Integer offset);

    /**
     * 处理从ES中拉取的一个批次的数据
     *
     * @param data 数据集合
     */
    public abstract void processData(List<String> data);

    /**
     * 获取查询ES的查询条件Request
     *
     * @param t      T
     * @param scroll scroll对象
     * @return SearchRequest
     */
    public abstract SearchRequest getSearchRequest(T t, Scroll scroll);

    /**
     * 初始化ES REST连接
     *
     * @return RestClient
     */
    @PostConstruct
    public RestClient initRestClient() {
        if (restClient == null) {
            String[] esHostArr = esHostNames.split(HOST_NAME_SEPARATOR);
            HttpHost[] httpHosts = new HttpHost[esHostArr.length];
            for (int i = 0; i < esHostArr.length; i++) {
                httpHosts[i] = new HttpHost(esHostArr[i], esPort, "http");
            }
            restClient = RestClient.builder(httpHosts).build();
        }
        logger.info("es rest client init success");
        return restClient;
    }


    /**
     * 用于search scroll 主方法，批次查询ES由该方法触发
     *
     * @param t T
     * @return 此次查询和处理成功，返回true，否则返回false
     */
    public boolean searchScrollEs(T t) {
        MktRestHighLevelClient client = new MktRestHighLevelClient(restClient);
        final Scroll scroll = new Scroll(TimeValue.timeValueMinutes(1L));
        SearchRequest searchRequest = getSearchRequest(t, scroll);
        SearchResponse searchResponse;
        try {
            // 如果查询es集群失败，则此次查询失败
            searchResponse = client.search(searchRequest);
        } catch (IOException e) {
            logger.error("search es failed, IOException: ", e);
            return false;
        }
        String scrollId = searchResponse.getScrollId();
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        Integer offset = 0;
        while (searchHits != null && searchHits.length > 0) {
            if (isProcessDataByOffset(t, offset)) {
                List<String> data = new ArrayList<>();
                for (SearchHit searchHit : searchHits) {
                    data.add(searchHit.getSourceAsString());
                }
                processData(data);
            }
            offset += searchHits.length;
            SearchScrollRequest scrollRequest = new SearchScrollRequest(scrollId);
            scrollRequest.scroll(scroll);
            try {
                searchResponse = client.searchScroll(scrollRequest);
            } catch (Exception e) {
                logger.error("searchScroll es failed, IOException: ", e);
                logger.info("search es process offset: {}", offset);
                readEsFailHandler(t, offset);
                return false;
            }
            scrollId = searchResponse.getScrollId();
            searchHits = searchResponse.getHits().getHits();
        }
        logger.info("search es process offset: {}", offset);
        clearEsScroll(client, scrollId);
        return true;
    }

    /**
     * 关闭Scroll上下文
     */
    private void clearEsScroll(MktRestHighLevelClient client, String scrollId) {
        ClearScrollRequest clearScrollRequest = new ClearScrollRequest();
        clearScrollRequest.addScrollId(scrollId);
        ClearScrollResponse clearScrollResponse;
        try {
            clearScrollResponse = client.clearScroll(clearScrollRequest);
        } catch (IOException e) {
            logger.error("clear scroll es failed, IOException: ", e);
            return;
        }
        if (!clearScrollResponse.isSucceeded()) {
            logger.error("clear scroll es failed");
        }
    }

    /**
     * 关闭ES REST 连接
     */
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
}
