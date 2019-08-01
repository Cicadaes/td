package com.talkingdata.marketing.core.middleware;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.talkingdata.marketing.core.util.JsonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * The type Api log.
 * @author xiaoming.kang
 */
@Component
public class ApiLog {
    private Logger logger = LoggerFactory.getLogger(getClass());

    /**
     * Print third api log.
     *
     * @param className    the class name
     * @param functionName the function name
     * @param url          the url
     * @param param        the param
     * @param e            the e
     */
    public void printThirdApiLog(String className, String functionName, String url, Object param, Exception e) {
        String paramStr = null;
        try {
            paramStr = JsonUtil.toJson(param);
        } catch (JsonProcessingException e1) {
            e1.printStackTrace();
        }
        String message = String.format("className:%s,functionName:%s,url:%s,param:%s,",
                className,
                functionName,
                url,
                paramStr);
        logger.error(message, e);
    }
}
