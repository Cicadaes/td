package com.talkingdata.marketing.streaming.pipeline.executor;

import static com.talkingdata.marketing.streaming.model.ExecutorResultDataConstant.*;

import org.apache.http.HttpEntity;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.ContentType;
import org.apache.lucene.util.BytesRef;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.ResponseException;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.common.bytes.BytesArray;
import org.elasticsearch.common.bytes.BytesReference;
import org.elasticsearch.common.xcontent.XContentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.nio.charset.Charset;
import java.util.HashMap;

/**
 * Pipeline操作es辅助类
 *
 * @author Created by tend on 2017/11/20.
 */
@Component
public class PipelineEsHelper {
    private static final Logger logger = LoggerFactory.getLogger(PipelineEsHelper.class);
    /**
     * 查询ep时候，查询的column，该column用于体现时间区间
     */
    private static final String EP_QUERY_COLUMN = "nextTriggerTime";
    /**
     * 查询ep时候，ep数据存储字段
     */
    private static final String EP_DATA_COLUMN = "eventPackage";
    /**
     * 查询message data 时候，查询的column，该column用于体现时间区间
     */
    private static final String MESSAGE_QUERY_COLUMN = "time";
    /**
     * 查询equity distribution record时候，查询的column，该column用于体现时间区间
     */
    private static final String EQUITY_QUERY_COLUMN = "issuanceTime";

    /**
     * 初始化eventPackage对象在es中的mapping
     *
     * @param restClient es restClient
     */
    public void initEpMapping(RestClient restClient) {
        String mapping = String.format("" +
                "{\n" +
                "    \"settings\": { " +
                "        \"number_of_shards\":12, " +
                "        \"number_of_replicas\":1 " +
                "      }, " +
                "    \"mappings\":{\n" +
                "        \"%s\":{\n" +
                "            \"properties\":{\n" +
                "                \"%s\":{\n" +
                "                    \"type\":\"keyword\",\n" +
                "                    \"index\":false\n" +
                "                },\n" +
                "                \"%s\":{\n" +
                "                    \"type\":\"date\",\n" +
                "                    \"format\":\"yyyy-MM-dd HH:mm:ss\"\n" +
                "                }\n" +
                "            }\n" +
                "        }\n" +
                "    }\n" +
                "}", EP_ES_TYPE, EP_DATA_COLUMN, EP_QUERY_COLUMN);
        mapping(restClient, mapping, EP_ES_INDEX);
    }

    /**
     * 初始化推送或短信对象在es中的mapping
     *
     * @param restClient es restClient
     */
    public void initMessageDataMapping(RestClient restClient) {
        String mapping = getMapping(MESSAGE_ES_TYPE, MESSAGE_QUERY_COLUMN);
        mapping(restClient, mapping, MESSAGE_ES_INDEX);
    }

    /**
     * 初始化推送或短信对象在es中的mapping
     *
     * @param restClient es restClient
     */
    void initEquityDistributionRecord(RestClient restClient) {
        String mapping = getMapping(EQUITY_ES_TYPE, EQUITY_QUERY_COLUMN);
        mapping(restClient, mapping, EQUITY_ES_INDEX);
    }

    /**
     * 获取日期格式的mapping
     *
     * @param type   需要mapping的es type
     * @param column mapping的列
     * @return mapping
     */
    private String getMapping(String type, String column) {
        return String.format("" +
                "{\n" +
                "    \"mappings\": {\n" +
                "    \"%s\": {\n" +
                "                 \"properties\": {\n" +
                "                 \"%s\": {\n" +
                "                            \"type\": \"date\",\n" +
                "                            \"format\": \"yyyy-MM-dd HH:mm:ss\"\n" +
                "                    }\n" +
                "                }\n" +
                "            }\n" +
                "        }\n" +
                " }", type, column);
    }

    /**
     * 初始化es的index的mapping
     *
     * @param restClient es restClient
     * @param mapping    index mapping json
     * @param index      index
     */
    private void mapping(RestClient restClient, String mapping, String index) {
        BytesReference bytesArray = new BytesArray(mapping);
        BytesRef source = bytesArray.toBytesRef();
        ContentType contentType = ContentType.create(XContentType.JSON.mediaTypeWithoutParameters(), (Charset) null);
        HttpEntity entity = new ByteArrayEntity(source.bytes, source.offset, source.length, contentType);
        HashMap<String, String> param = new HashMap<>(16);
        String endpoint = String.format("/%s/", index);
        try {
            Response response = restClient.performRequest("PUT", endpoint, param, entity);
            logger.info("index: {}, init mapping return status code: {}", index, response.getStatusLine().getStatusCode());
        } catch (ResponseException e) {
            logger.info("index: {}, init mapping return ", index, e);
        } catch (Exception e) {
            logger.warn("index: {}, init mapping has exception", index, e);
        }
    }


}
