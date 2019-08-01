package com.talkingdata.marketing.streaming.pipeline.operator;

import com.talkingdata.marketing.streaming.util.EsUtils;
import org.apache.commons.io.FileUtils;
import org.apache.http.HttpHost;
import org.elasticsearch.action.DocWriteRequest;
import org.elasticsearch.action.bulk.BulkItemResponse;
import org.elasticsearch.action.bulk.BulkProcessor;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.threadpool.ThreadPool;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Created by tend on 2018/1/24.
 */
public class ESBulkProcessorTest {
    private static final Logger logger = LoggerFactory.getLogger(EsUtils.class);

    public static void main(String[] args) throws IOException {

//    }
//
//    @Test
//    public void testBulk() throws IOException {

        long start = System.currentTimeMillis();

        HttpHost[] httpHosts = new HttpHost[1];
        httpHosts[0] = new HttpHost("172.23.5.215", 9200, "http");
//        httpHosts[1] = new HttpHost("172.23.5.216", 9200, "http");
//        httpHosts[2] = new HttpHost("172.23.5.217", 9200, "http");
        RestClient restClient = RestClient.builder(httpHosts).build();
        RestHighLevelClient client = new RestHighLevelClient(restClient);
        Map<String, String> map = new HashMap<>(16);
        map.put("node.name", "mkt_htest_es");
//        Settings settings = Settings.builder().put("cluster.name", "elasticsearch").build();
        Settings settings = Settings.builder().put(map).build();
        ThreadPool threadPool = new ThreadPool(settings);
        BulkProcessor.Builder builder = new BulkProcessor.Builder(client::bulkAsync, new BulkProcessor.Listener() {
            @Override
            public void beforeBulk(long executionId, BulkRequest request) {
                System.out.println(executionId + " start ");
                logger.info("sdfsdfsdfasdfasdfasdf");
            }

            @Override
            public void afterBulk(long executionId, BulkRequest request, BulkResponse response) {
                System.out.println(executionId + " end ");
                System.out.println(response.status().getStatus());
                System.out.println(response.hasFailures());
                BulkItemResponse[] items = response.getItems();
                System.out.println("失败：" + items[0].getFailureMessage());

                List<DocWriteRequest> requests = request.requests();


            }

            @Override
            public void afterBulk(long executionId, BulkRequest request, Throwable failure) {
                System.out.println(executionId + " error ");
            }
        }, threadPool);

        builder.setBulkActions(2000);
        builder.setFlushInterval(TimeValue.timeValueSeconds(10L));

        BulkProcessor build = builder.build();
//        String content = FileUtils.readFileToString(new File("C:\\Users\\tend\\Desktop\\营销闭环\\测试数据\\eventPackage02.txt"));
        String content = "{\"pipelineId\":394,\"campaignId\":357,\"name\":\"l流程check\"}";
        for (int i = 0; i < 20000; i++) {
//            IndexRequest request = new IndexRequest("mkt-eventpackage", "eventpackage", i + "")
            IndexRequest request = new IndexRequest("twitter", "twitte", i + "")
                    .source(content, XContentType.JSON);
            build.add(request);
        }


        long end = System.currentTimeMillis();

        System.out.println("总共耗时：" + ((end - start) / 1000) + " s");

        build.close();
    }

    public static void bulkProcess() throws Exception{
//        Map<String, String> map = new HashMap<>(16);
//        map.put("node.name", "mkt_htest_es");
//        Settings settings = Settings.builder().put(map).build();

        //设置集群名称

        Settings settings = Settings.builder().put("cluster.name", "elasticsearch").build();
    }


}
