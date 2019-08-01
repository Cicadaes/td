package com.talkingdata.marketing.batch.es;

import org.apache.http.Header;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;

import java.io.IOException;

import static java.util.Collections.emptySet;

/**
 * @author Created by tend on 2017/11/14.
 */
public class MktRestHighLevelClient extends RestHighLevelClient {

    public MktRestHighLevelClient(RestClient restClient) {
        super(restClient);
    }

    @Override
    public SearchResponse search(SearchRequest searchRequest, Header... headers) throws IOException {
        return performRequestAndParseEntity(searchRequest, MktRequest::search, SearchResponse::fromXContent, emptySet(), headers);
    }
}
