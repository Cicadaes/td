package com.talkingdata.marketing.core.middleware;

import com.talkingdata.marketing.core.entity.thirdmodel.thirdpush.PushResult;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.util.HttpClientUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * The type Third push api.
 * @author xiaoming.kang
 */
@Component
public class ThirdPushApi {
    private static final Logger logger = LoggerFactory.getLogger(ThirdPushApi.class);
    private static final String PUSH_HTTP_PREFIX = "";
    private static String pushMessageApi = "/push/reach";
    @Autowired
    private ConfigApi configApi;
    @Autowired
    private ApiLog apiLog;

    /**
     * Push message push result.
     *
     * @param message the message
     * @return the push result
     * @throws Exception the exception
     */
    public PushResult pushMessage(String message) throws Exception {

        String postUrl = String.format("%s%s", PUSH_HTTP_PREFIX, pushMessageApi);
        String resp = null;
        try {
            resp = HttpClientUtil.postWithJson(postUrl, message);
        } catch (Exception e) {
            apiLog.printThirdApiLog("ThirdPushApi", "pushMessage", postUrl, resp, e);
            throw new Exception(String.format("第三方推送报错，err: %s", e));
        }
        logger.info("pushMessage response:" + resp);
        return JsonUtil.toObject(resp, PushResult.class);
    }

}
