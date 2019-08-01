package com.talkingdata.marketing.streaming.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

/**
 * JSON 工具类
 * @author sheng.hong
 */
public class JsonUtil {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    /**
     * 转为JSON串
     * @return
     */
    public static String toJsonString(Object obj) throws JsonProcessingException {
        return MAPPER.writeValueAsString(obj);
    }

    /**
     * 解析JSON串
     * @param jsonString
     * @return
     */
    public static <T> T toObject(String jsonString, Class<T> t) throws IOException {
        return MAPPER.readValue(jsonString, t);
    }
}
