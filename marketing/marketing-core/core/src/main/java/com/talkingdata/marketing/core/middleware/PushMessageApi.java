package com.talkingdata.marketing.core.middleware;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.talkingdata.marketing.core.util.HttpClientUtil;
import com.talkingdata.marketing.core.util.HttpUtil;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.UnsupportedEncodingException;

/**
 * The type Push message api.
 * @author xiaoming.kang
 */
@Component
public class PushMessageApi {

    /**
     * TODO  未来从channel中获取
     */
    private static final String GATEWAY_USER = "";
    private static final String GATEWAY_PWD = "";
    private static final String GATEWAY_HOST = "";
    private static final String GATEWAY_PORT = "";
    private static String buildActivityApi = "/push/api/dv/%s/%s/store";
    private static String pushMessageApi = "/push/api/send/message/%s/%s";
    private static String statPushApi = "/push/api/%s/stat";
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Autowired
    private ConfigApi configApi;
    @Autowired
    private ApiLog apiLog;

    /**
     * Push string.
     *
     * @param app      the app
     * @param os       the os
     * @param accurate the accurate
     * @param text     the text
     * @param source   the source
     * @param message  the message
     * @return the string
     */
    public String push(String app, String os, int accurate, String text, String source, String message)
            throws JsonProcessingException {
        String mpushApp = String.format("%s-%s",source, app);
        String activity = createActivity(mpushApp, os, accurate, text);
        return pushMessage(mpushApp, source, os, activity, message);
    }

    /**
     * Create activity string.
     *
     * @param app      the app
     * @param os       the os
     * @param accurate the accurate
     * @param text     the text
     * @return the string
     */
    public String createActivity(String app, String os, int accurate, String text) throws JsonProcessingException {
        String authorization = HttpUtil.getAuthorization(GATEWAY_USER, GATEWAY_PWD);
        String baseUrl = getBaseUrl();
        String url = baseUrl + String.format(buildActivityApi, app, os);
        MultiValueMap<String, Object> param = new LinkedMultiValueMap<String, Object>();
        param.add("accurate", String.valueOf(accurate));
        param.add("attach", text);
        String str = JsonUtil.toJson(param);
        String resp = null;
        try {
            // resp = HttpClientUtil.post(url, authorization, str, "UTF-8");//string body
            // resp = HttpClientUtil.postWithJson(url, authorization, str);//json
            resp = HttpClientUtil.postReal(url, authorization, param, "UTF-8");
        } catch (Exception e) {
            apiLog.printThirdApiLog("PushMessageApi", "createActivity", url, str, e);
            throw e;
        }
        return resp;
    }

    /**
     * Push message string.
     *
     * @param app      the app
     * @param source   the source
     * @param os       the os
     * @param activity the activity
     * @param message  the message
     * @return the string
     */
    public String pushMessage(String app, String source, String os, String activity, String message) throws JsonProcessingException {
        //todo 抽取用户名、密码、主机和端口号到context中
        String authorization = HttpUtil.getAuthorization(GATEWAY_USER, GATEWAY_PWD);
        String baseUrl = getBaseUrl();
        String url = baseUrl + String.format(pushMessageApi, app, os);
        MultiValueMap<String, Object> param = new LinkedMultiValueMap<String, Object>();
        param.add("activity", activity);
        param.add("source", source);
        param.add("message", message);
        String str = JsonUtil.toJson(param);
        String resp = null;
        try {
            // resp = HttpClientUtil.post(url, authorization, str, "UTF-8");//string body
            // resp = HttpClientUtil.postWithJson(url, authorization, str);//json
            resp = HttpClientUtil.post(url, authorization, param, "UTF-8");
        } catch (Exception e) {
            apiLog.printThirdApiLog("PushMessageApi", "pushMessage", url, str, e);
            throw e;
        }
        return resp;
    }

    /**
     * Gets stat by id.
     *
     * @param pushId the push id
     * @return the stat by id
     */
    public String getStatById(String pushId) {
        String baseUrl = getBaseUrl();
        String url = baseUrl + String.format(statPushApi, pushId);
        ResponseEntity<String> exchange = null;
        String resp;
        try {
            resp = HttpClientUtil.get(url);
        } catch (Exception e) {
            apiLog.printThirdApiLog("PushMessageApi", "getStatById", url, "", e);
            return null;
        }
        return resp;
    }

    /**
     * Gets base url.
     *
     * @return the base url
     */
    public String getBaseUrl() {
        return GATEWAY_HOST + ":" + GATEWAY_PORT;
    }
}
