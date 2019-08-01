package com.talkingdata.datacloud.util;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.mashape.unirest.request.HttpRequest;
import com.mashape.unirest.request.HttpRequestWithBody;
import com.talkingdata.datacloud.exception.HttpStatusException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.util.CollectionUtils;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;

public class HttpUtil {
    private static final Logger logger = Logger
            .getLogger(HttpUtil.class);

    /**
     * HTTP GET REQUEST
     *
     * @param baseUrl
     * @param header
     * @param paramMap
     * @param routeKey
     * @param routeValue
     * @param isJson
     * @return
     */
    public static String get(String baseUrl, Map<String, String> header, Map<String, Object> paramMap, String routeKey, String routeValue, boolean isJson) {

        HttpResponse<String> jsonResponse = null;
        HttpRequest httpRequest = Unirest.get(baseUrl);

        try {
            if (isJson) {
                httpRequest.header("Content-Type", "application/json;charset=UTF-8");
            } else {
                httpRequest.header("Content-Type", "text/plain")
                        .header("Authorization", "Basic QURNSU46S1lMSU4=");
            }

            if (null != header) {
                httpRequest.headers(header);
            }

            if (!StringUtils.isEmpty(routeKey) &&
                    !StringUtils.isEmpty(routeValue)) {
                httpRequest.routeParam(routeKey, URLEncoder.encode(routeValue, "UTF-8"));
            }

            if (null != paramMap) {
                httpRequest.queryString(paramMap);
            }

            jsonResponse = httpRequest.asString();
        } catch (UnirestException e) {
            logger.error(String.format("http request failed %s", baseUrl), e);
            throw new HttpStatusException(e);
        } catch (UnsupportedEncodingException e) {
            logger.error(String.format("http request failed %s", baseUrl), e);
            throw new HttpStatusException(e);
        }
        if (isOKStatusCode(jsonResponse.getStatus())) {
            return jsonResponse.getBody();
        }
        logger.error(String.format("http get request failed %s %d", baseUrl, jsonResponse.getStatus()));
        throw new HttpStatusException(String.format("http request failed %s %d %s", baseUrl, jsonResponse.getStatus(), jsonResponse.getBody()));

    }

    public static String get(String url, Map<String, Object> paramMap) {
        return get(url, null, paramMap, null, null, false);
    }

    public static String get(String url, Map<String, String> header, Map<String, Object> paramMap) {
        return get(url, header, paramMap, null, null, false);
    }

    public static String get(String url, Map<String, Object> paramMap, boolean isJson) {
        return get(url, null, paramMap, null, null, isJson);
    }

    public static String get(String url, Map<String, String> header, Map<String, Object> paramMap, boolean isJson) {
        return get(url, header, paramMap, null, null, isJson);
    }

    public static String get(String url, String routeKey, String routeValue) {
        return get(url, null, null, routeKey, routeValue, false);
    }

    public static String get(String url, Map<String, String> header, String routeKey, String routeValue) {
        return get(url, header, null, routeKey, routeValue, false);
    }

    public static String get(String url, String routeKey, String routeValue, boolean isJson) {
        return get(url, null, null, routeKey, routeValue, isJson);
    }

    public static String get(String url, Map<String, String> header, String routeKey, String routeValue, boolean isJson) {
        return get(url, header, null, routeKey, routeValue, isJson);
    }

    /**
     * HTTP POST REQUEST
     *
     * @param baseUrl
     * @param header
     * @param fileName
     * @param uploadFile
     * @param paramMap
     * @param bodyMap
     * @param routeKey
     * @param routeValue
     * @param body
     * @param isJson
     * @return
     */
    public static String post(String baseUrl,
                              Map<String, String> header,
                              String fileName,
                              InputStream uploadFile,
                              Map<String, Object> paramMap,
                              Map<String, Object> bodyMap,
                              String routeKey,
                              String routeValue,
                              String body,
                              boolean isJson) {
        HttpResponse<String> jsonResponse = null;
        HttpRequestWithBody httpRequest = Unirest.post(baseUrl);

        try {
            if (isJson) {
                httpRequest.header("Content-Type", "application/json;charset=UTF-8");
            } else {
                httpRequest.header("Content-Type", "text/plain");
            }

            if (null != header) {
                httpRequest.headers(header);
            }

            if (null != paramMap) {
                httpRequest.queryString(paramMap);
            }

            if (!StringUtils.isEmpty(routeKey) &&
                    !StringUtils.isEmpty(routeValue)) {
                httpRequest.routeParam(routeKey, URLEncoder.encode(routeValue, "UTF-8"));
            }

            if (null != bodyMap) {
                httpRequest.fields(bodyMap);
            }

            if (!StringUtils.isEmpty(fileName) &&
                    null != uploadFile) {
                httpRequest.field(fileName, uploadFile, fileName);
            }

            if (!StringUtils.isEmpty(body)) {
                httpRequest.body(body);
            }

            jsonResponse = httpRequest.asString();

        } catch (UnirestException e) {
            logger.error(String.format("http request failed %s", baseUrl), e);
            throw new HttpStatusException(e);
        } catch (UnsupportedEncodingException e) {
            logger.error(String.format("http request failed %s", baseUrl), e);
            throw new HttpStatusException(e);
        }
        if (isOKStatusCode(jsonResponse.getStatus())) {
            return jsonResponse.getBody();
        }
        logger.error(String.format("http post request failed %s %d", baseUrl, jsonResponse.getStatus()));
        throw new HttpStatusException(String.format("http request failed %s %d %s", baseUrl, jsonResponse.getStatus(), jsonResponse.getBody()));
    }

    public static String post(String url, Map<String, String> header, String body, boolean isJson) {
        return post(url, header, null, null, null, null, null, null, body, isJson);
    }

    public static String post(String url, Map<String, Object> paramMap) {
        return post(url, null, null, null, paramMap, null, null, null, null, false);
    }

    /**
     * HTTP DELETE REQUEST
     *
     * @param baseUrl
     * @param header
     * @param paramMap
     * @param routeKey
     * @param routeValue
     * @param isJson
     * @return
     */
    public static String delete(String baseUrl, Map<String, String> header, Map<String, Object> paramMap, String routeKey, String routeValue, boolean isJson) {

        HttpResponse<String> jsonResponse = null;
        HttpRequest httpRequest = null;

        try {
            httpRequest = Unirest.delete(baseUrl);

            if (isJson) {
                httpRequest.header("Content-Type", "application/json");
            } else {
                httpRequest.header("Content-Type", "text/plain");
            }

            if (null != header) {
                httpRequest.headers(header);
            }

            if (null != paramMap) {
                httpRequest.queryString(paramMap);
            }

            if (!StringUtils.isEmpty(routeKey) &&
                    !StringUtils.isEmpty(routeValue)) {
                httpRequest.routeParam(routeKey, URLEncoder.encode(routeValue, "UTF-8"));
            }

            jsonResponse = httpRequest.asString();
            logger.info(String.format("http delete request %s %d %s", baseUrl, jsonResponse.getStatus(), jsonResponse.getBody()));
        } catch (UnirestException e) {
            logger.error(String.format("http request failed %s", baseUrl), e);
            throw new HttpStatusException(e);
        } catch (UnsupportedEncodingException e) {
            logger.error(String.format("http request failed %s", baseUrl), e);
            throw new HttpStatusException(e);
        }
        if (isOKStatusCode(jsonResponse.getStatus())) {
            return jsonResponse.getBody();
        }
        logger.error(String.format("http post request failed %s %d", baseUrl, jsonResponse.getStatus()));
        throw new HttpStatusException(String.format("http request failed %s %d %s", baseUrl, jsonResponse.getStatus(), jsonResponse.getBody()));
    }

    public static String delete(String baseUrl, Map<String, String> header, String routeKey, String routeValue) {
        return delete(baseUrl, header, null, routeKey, routeValue, false);
    }

    public static String delete(String baseUrl, Map<String, String> header) {
        return delete(baseUrl, header, null, null, null, false);
    }

    /**
     * HTTP PUT REQUEST
     *
     * @param baseUrl
     * @param header
     * @param routekey
     * @param routeValue
     * @param paramMap
     * @param body
     * @param isJson
     * @return
     */
    public static String put(String baseUrl, Map<String, String> header, String routekey,
                             String routeValue, Map<String, Object> paramMap, String body, boolean isJson) {
        HttpResponse<String> jsonResponse = null;
        HttpRequestWithBody httpRequest = null;

        httpRequest = Unirest.put(baseUrl);
        try {

            if (isJson) {
                httpRequest.header("Content-Type", "application/json");
            } else {
                httpRequest.header("Content-Type", "text/plain");
            }

            if (!CollectionUtils.isEmpty(header)) {
                httpRequest.headers(header);
            }
            if (StringUtils.isNotEmpty(routekey)) {
                httpRequest.routeParam(routekey, URLEncoder.encode(routeValue, "UTF-8"));
            }
            if (!CollectionUtils.isEmpty(paramMap)) {
                httpRequest.queryString(paramMap);
            }
            if (StringUtils.isNotEmpty(body)) {
                httpRequest.body(body);
            }
            jsonResponse = httpRequest.asString();
            logger.info(String.format("http request success %s %d %s", baseUrl, jsonResponse.getStatus(), jsonResponse.getBody()));

        } catch (UnirestException e) {
            logger.error(String.format("http request failed %s", baseUrl), e);
            throw new HttpStatusException(e);
        } catch (UnsupportedEncodingException e) {
            logger.error(String.format("http request failed %s", baseUrl), e);
            throw new HttpStatusException(e);
        }
        if (isOKStatusCode(jsonResponse.getStatus())) {
            return jsonResponse.getBody();
        }
        logger.error(String.format("http post request failed %s %d", baseUrl, jsonResponse.getStatus()));
        throw new HttpStatusException(String.format("http request failed %s %d %s", baseUrl, jsonResponse.getStatus(), jsonResponse.getBody()));
    }

    public static String put(String url, Map<String, String> header, String body, boolean isJson) {
        return put(url, header, null, null, null, body, isJson);
    }

    public static String put(String url, Map<String, String> header, String routekey, String routeValue) {
        return put(url, header, routekey, routeValue, null, null, false);
    }

    /**
     * 几种正常的状态码. 200 201 202 302
     *
     * @param statuscode
     * @return
     */
    private static boolean isOKStatusCode(int statuscode) {
        if (statuscode == HttpStatus.SC_OK) {
            return true;
        } else if (statuscode == HttpStatus.SC_ACCEPTED) {
            return true;
        } else if (statuscode == HttpStatus.SC_CREATED) {
            return true;
        } else if (statuscode == HttpStatus.SC_MOVED_TEMPORARILY) {
            return true;
        } else {
            return false;
        }
    }

}


