package com.talkingdata.marketing.core.config;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.apache.http.Header;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.DefaultHttpRequestRetryHandler;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicHeader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;

/**
 * The type Rest template config.
 * @author armeng
 */
@Configuration
@Lazy(false)
public class RestTemplateConfig {

    /**
     * logger
     */
    private static Logger logger = LoggerFactory.getLogger(com.talkingdata.marketing.core.config.RestTemplateConfig.class);

    /**
     * Client http request factory client http request factory.
     *
     * @param httpClient the http client
     * @return the client http request factory
     */
    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory(HttpClient httpClient) {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
        factory.setReadTimeout(10000);
        factory.setConnectTimeout(5000);
        //连接不够用的等待时间
        factory.setConnectionRequestTimeout(200);
        return factory;
    }

    /**
     * Http client http client.
     *
     * @param httpClientBuilder the http client builder
     * @return the http client
     */
    @Bean
    public HttpClient httpClient(HttpClientBuilder httpClientBuilder) {
        return httpClientBuilder.build();
    }

    /**
     * Http client builder http client builder.
     *
     * @param pollingConnectionManager the polling connection manager
     * @return the http client builder
     */
    @Bean
    public HttpClientBuilder httpClientBuilder(PoolingHttpClientConnectionManager pollingConnectionManager) {
        HttpClientBuilder httpClientBuilder = HttpClients.custom();
        httpClientBuilder.setConnectionManager(pollingConnectionManager);
        //重试次数
        httpClientBuilder.setRetryHandler(new DefaultHttpRequestRetryHandler(2, true));
//        httpClientBuilder.setKeepAliveStrategy(DefaultConnectionKeepAliveStrategy.INSTANCE);
        List<Header> headers = new ArrayList<>();
        headers.add(new BasicHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.16 Safari/537.36"));
        headers.add(new BasicHeader("Accept-Encoding", "gzip,deflate"));
        headers.add(new BasicHeader("Accept-Language", "zh-CN,zh;q=0.8,en;q=0.6"));
        headers.add(new BasicHeader("Connection", "keep-alive"));
        httpClientBuilder.setDefaultHeaders(headers);
        return httpClientBuilder;
    }

    /**
     * Polling connection manager pooling http client connection manager.
     *
     * @return the pooling http client connection manager
     */
    @Bean
    public PoolingHttpClientConnectionManager pollingConnectionManager() {
        PoolingHttpClientConnectionManager pollingConnectionManager = new PoolingHttpClientConnectionManager(30, TimeUnit.SECONDS);
        pollingConnectionManager.setMaxTotal(200);
        pollingConnectionManager.setDefaultMaxPerRoute(150);
        return pollingConnectionManager;
    }
}
