package td.enterprise.common.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;


public class JsonUtils {
	
	public static String objectToJsonStr(Object object) throws IOException {
		ObjectMapper om = new ObjectMapper();
		String result = om.writeValueAsString(object);
		return result;
	}
	
	public static <T> T jsonToObject(String json, Class<T> clazz) throws IOException  {
		ObjectMapper om = new ObjectMapper();
		return om.readValue(json, clazz);
	}
	
	public static <T> List<T> jsonToObjectList(String json, Class<T> clazz) throws IOException  {
		ObjectMapper om = new ObjectMapper();
		JavaType javaType = om.getTypeFactory().constructParametricType(ArrayList.class, clazz);
		List<T> list = om.readValue(json, javaType);
		return list;
	}
	
	public static <T> T objectToObject(Object sourceObject , Class<T> targetClazz) throws IOException {
		String sourceStr = objectToJsonStr(sourceObject);
		return jsonToObject(sourceStr, targetClazz);
	}

}
