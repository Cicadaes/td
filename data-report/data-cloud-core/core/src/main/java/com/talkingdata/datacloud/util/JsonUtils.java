package com.talkingdata.datacloud.util;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.JavaType;
import org.codehaus.jackson.type.TypeReference;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class JsonUtils {

	public static String objectToJsonStr(Object object) throws JsonGenerationException, JsonMappingException, IOException {
		ObjectMapper om = new ObjectMapper();
		String result = om.writeValueAsString(object);
		return result;
	}

	public static <T> T jsonToObject(String json, Class<T> clazz) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper om = new ObjectMapper();
		// String jsonStr = objectToJsonStr(json);
		return om.readValue(json, clazz);
	}

	public static <T> List<T> jsonToObjectList(Object json, Class<T> clazz) throws JsonParseException, JsonMappingException, IOException {
		
		ObjectMapper om = new ObjectMapper();
		String jsonStr = objectToJsonStr(json);

		return om.readValue(jsonStr, new TypeReference<List<T>>() {
		});
	}

	public static <T> List<T> json2List(String json, Class<T> beanClass) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper om = new ObjectMapper();
		return om.readValue(json, getCollectionType(List.class, beanClass));
	}

	public static <T> T objectToObject(Object sourceObject, Class<T> targetClazz) throws JsonGenerationException, JsonMappingException, IOException {
		String sourceStr = objectToJsonStr(sourceObject);
		return jsonToObject(sourceStr, targetClazz);
	}

	public static JavaType getCollectionType(Class<?> collectionClass, Class<?>... elementClasses) {
		ObjectMapper om = new ObjectMapper();
		return om.getTypeFactory().constructParametricType(collectionClass, elementClasses);
	}
	
	public static <T extends Map<String, String>> List<T> json2ListMapString(String json, Class<? extends T> beanClass) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper om = new ObjectMapper();
		return om.readValue(json, getCollectionType(List.class, beanClass));
	}
}
