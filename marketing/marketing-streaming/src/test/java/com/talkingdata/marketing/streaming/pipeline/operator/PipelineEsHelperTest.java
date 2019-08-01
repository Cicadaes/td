package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.pipeline.executor.PipelineEsHelper;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.junit.Test;

/**
 * @author Created by tend on 2017/11/20.
 */
public class PipelineEsHelperTest {

    @Test
    public void initEpMappingTest() {
        RestClient restClient = RestClient.builder(
//                new HttpHost("172.23.5.215", 9200, "http"),
//                new HttpHost("es02.mkt.td.com", 9200, "http"),
                new HttpHost("172.23.5.215", 9200, "http")).build();
        PipelineEsHelper helper = new PipelineEsHelper();
        helper.initEpMapping(restClient);
    }

    @Test
    public void initMessageDataMappingTest() {
        RestClient restClient = RestClient.builder(
                new HttpHost("es01.mkt.td.com", 9200, "http"),
                new HttpHost("es02.mkt.td.com", 9200, "http"),
                new HttpHost("es03.mkt.td.com", 9200, "http")).build();
        PipelineEsHelper helper = new PipelineEsHelper();
        helper.initMessageDataMapping(restClient);
    }

}
