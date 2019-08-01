package com.talkingdata.marketing.batch.es;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.ContentType;
import org.apache.lucene.util.BytesRef;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.support.IndicesOptions;
import org.elasticsearch.client.Request;
import org.elasticsearch.common.Strings;
import org.elasticsearch.common.SuppressForbidden;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.common.xcontent.ToXContent;
import org.elasticsearch.common.xcontent.XContentHelper;
import org.elasticsearch.common.xcontent.XContentType;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.*;

/**
 * @author Created by tend on 2017/11/14.
 */
public class MktRequest {

    private static final XContentType REQUEST_BODY_CONTENT_TYPE = XContentType.JSON;

    static Request search(SearchRequest searchRequest) throws IOException {
        String endpoint = endpoint(searchRequest.indices(), searchRequest.types(), "_search");
        Params params = Params.builder();
        params.withRouting(searchRequest.routing());
        params.withPreference(searchRequest.preference());
        params.withIndicesOptions(searchRequest.indicesOptions());
        params.putParam("search_type", searchRequest.searchType().name().toLowerCase(Locale.ROOT));
        if (searchRequest.requestCache() != null) {
            params.putParam("request_cache", Boolean.toString(searchRequest.requestCache()));
        }
        if (searchRequest.scroll() != null) {
            params.putParam("scroll", searchRequest.scroll().keepAlive());
        }
        HttpEntity entity = null;
        if (searchRequest.source() != null) {
            entity = createEntity(searchRequest.source(), REQUEST_BODY_CONTENT_TYPE);
        }
        return new Request(HttpGet.METHOD_NAME, endpoint, params.getParams(), entity);
        //        params.putParam(RestSearchAction.TYPED_KEYS_PARAM, "true");
        //        params.putParam("batched_reduce_size", Integer.toString(searchRequest.getBatchedReduceSize()));
    }

    private static String endpoint(String[] indices, String[] types, String endpoint) {
        return endpoint(String.join(",", indices), String.join(",", types), endpoint);
    }

    /**
     * Utility method to build request's endpoint.
     */
    private static String endpoint(String... parts) {
        StringJoiner joiner = new StringJoiner("/", "/", "");
        for (String part : parts) {
            if (Strings.hasLength(part)) {
                joiner.add(part);
            }
        }
        return joiner.toString();
    }

    private static HttpEntity createEntity(ToXContent toXContent, XContentType xContentType) throws IOException {
        BytesRef source = XContentHelper.toXContent(toXContent, xContentType, false).toBytesRef();
        return new ByteArrayEntity(source.bytes, source.offset, source.length, createContentType(xContentType));
    }

    @SuppressForbidden(reason = "Only allowed place to convert a XContentType to a ContentType")
    private static ContentType createContentType(final XContentType xContentType) {
        return ContentType.create(xContentType.mediaTypeWithoutParameters(), (Charset) null);
    }

    static class Params {
        private final Map<String, String> params = new HashMap<>(16);

        private Params() {
        }

        Params putParam(String key, String value) {
            if (Strings.hasLength(value)) {
                if (params.putIfAbsent(key, value) != null) {
                    throw new IllegalArgumentException("Request parameter [" + key + "] is already registered");
                }
            }
            return this;
        }

        Params putParam(String key, TimeValue value) {
            if (value != null) {
                return putParam(key, value.getStringRep());
            }
            return this;
        }

        Params withPreference(String preference) {
            return putParam("preference", preference);
        }

        Params withRouting(String routing) {
            return putParam("routing", routing);
        }

        Params withIndicesOptions(IndicesOptions indicesOptions) {
            putParam("ignore_unavailable", Boolean.toString(indicesOptions.ignoreUnavailable()));
            putParam("allow_no_indices", Boolean.toString(indicesOptions.allowNoIndices()));
            String expandWildcards;
            if (!indicesOptions.expandWildcardsOpen() && !indicesOptions.expandWildcardsClosed()) {
                expandWildcards = "none";
            } else {
                StringJoiner joiner = new StringJoiner(",");
                if (indicesOptions.expandWildcardsOpen()) {
                    joiner.add("open");
                }
                if (indicesOptions.expandWildcardsClosed()) {
                    joiner.add("closed");
                }
                expandWildcards = joiner.toString();
            }
            putParam("expand_wildcards", expandWildcards);
            return this;
        }

        Map<String, String> getParams() {
            return Collections.unmodifiableMap(params);
        }

        static Params builder() {
            return new Params();
        }
    }

}
