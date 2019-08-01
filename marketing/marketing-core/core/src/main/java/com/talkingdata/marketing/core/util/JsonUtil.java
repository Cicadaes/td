package com.talkingdata.marketing.core.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.lang.reflect.Type;

/**
 * The type Json util.
 * @author hongsheng
 */
public class JsonUtil {
    private static final ObjectMapper MAPPER = new ObjectMapper();

	static {
		MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		MAPPER.setSerializationInclusion(JsonInclude.Include.NON_NULL);
	}
	private JsonUtil() {
	}
	/**
	 * 转为JSON串
	 *
	 * @param obj the obj
	 * @return string string
	 * @throws JsonProcessingException the json processing exception
	 */
	public static String toJson(Object obj) throws JsonProcessingException {
        return MAPPER.writeValueAsString(obj);
    }

	/**
	 * 解析JSON串
	 *
	 * @param <T>        the type parameter
	 * @param jsonString the json string
	 * @param t          the t
	 * @return t t
	 * @throws IOException the io exception
	 */
	public static <T> T toObject(String jsonString, Class<T> t) throws IOException {
		return MAPPER.readValue(jsonString, t);
	}

	/**
	 * 解析JSON串
	 * @param jsonString	the json string
	 * @param typeReference type reference
	 * @param <T>
	 * @return
	 * @throws IOException
	 */
	public static <T> T toObject(String jsonString, TypeReference typeReference) throws IOException {
		return MAPPER.readValue(jsonString, typeReference);
	}
}
