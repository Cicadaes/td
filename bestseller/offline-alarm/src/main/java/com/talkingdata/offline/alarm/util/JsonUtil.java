package com.talkingdata.offline.alarm.util;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.type.TypeFactory;
import org.codehaus.jackson.type.TypeReference;

public class JsonUtil {
	
	private static ObjectMapper objectMapper = new ObjectMapper();
	
	/**
	 * 复杂对象转json字符串,obj可以为list
	 * 
	 * @param obj
	 * @return
	 * @throws Exception
	 */
//	public static String objToJson(Object obj) throws Exception{
//		
//		String str = objectMapper.writeValueAsString(obj);
//		
//		return str;
//	}
	
	/**
	 * 复杂对象转json字符串,obj可以为list
	 * 格式化json
	 * 
	 * @param obj
	 * @return
	 * @throws Exception
	 */
	public static String objToJsonFormat(Object obj) throws Exception{
		
		String str = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
		
		return str;
	}
	
	/**
	 * json字符串转换为list对象
	 * 
	 * @param jsonStr
	 * @param clazz
	 * @return
	 * @throws Exception
	 */
	public static List<?> jsonToList(String jsonStr,Class<?> clazz) throws Exception {
		TypeFactory typeFactory = TypeFactory.defaultInstance(); 
		// 指定容器结构和类型（这里是ArrayList和clazz）
		List<?> list = objectMapper.readValue(jsonStr,typeFactory.constructCollectionType(ArrayList.class,clazz));
		
		return list;
	}
	
	/**
	 * json字符串转换为map对象
	 * 
	 * @param jsonStr
	 * @param clazz
	 * @return
	 * @throws Exception
	 */
	public static Map<String, List<Object>> jsonToMap(String jsonStr,Class<?> clazz) throws Exception {
		
		Map<String,List<Object>> map = objectMapper.readValue(jsonStr,
				new TypeReference<Map<String,List<Object>>>() {});
		
		return map;
	}
	
	/**
	 * 复杂json串,转Bean对象
	 * 
	 * @param jsonStr
	 * @param clazz
	 * @return
	 * @throws IOException 
	 * @throws JsonMappingException 
	 * @throws JsonParseException 
	 * @throws Exception
	 */
	public static Object jsonToBean(String jsonStr,Class<?> clazz) throws JsonParseException, JsonMappingException, IOException {
		Object obj = objectMapper.readValue(jsonStr,clazz);
		return obj;
	}
	
	
	/**
	 * 实体对象转为map，含其父类属性
	 * @param obj
	 * @return
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 */
	public static Map<String, Object> objToHash(Object obj) throws IllegalArgumentException,IllegalAccessException { 
	      
	    Map<String, Object> hashMap = new HashMap<String, Object>(); 
	    Class clazz = obj.getClass(); 
	    List<Class> clazzs = new ArrayList<Class>(); 
	      
	    do { 
	        clazzs.add(clazz); 
	        clazz = clazz.getSuperclass(); 
	    } while (!clazz.equals(Object.class)); 
	      
	    for (Class iClazz : clazzs) { 
	        Field[] fields = iClazz.getDeclaredFields(); 
	        for (Field field : fields) { 
	            Object objVal = null; 
	            field.setAccessible(true); 
	            objVal = field.get(obj); 
	            hashMap.put(field.getName(), objVal); 
	        } 
	    } 
	      
	    return hashMap; 
	}
	
	/**
	 * map转成类对象
	 * @param map
	 * @param obj
	 * @return
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 */
	public static void mapToObj(Map<String, Object> map, Object obj) throws IllegalArgumentException,IllegalAccessException { 
		Class clazz = obj.getClass();
		Field[] fields = clazz.getDeclaredFields(); 
        for (Field field : fields) {
        	field.setAccessible(true);
        	if(map.containsKey(field.getName())) {
        		if (field.getType().equals(Date.class)) {
        			if(map.get(field.getName()) != null) {
        				field.set(obj, new Date((Long)map.get(field.getName())));
        			}
        		} else {
        			field.set(obj, map.get(field.getName()));
        		}
        	}
        }
	}
	
	/** 
    * 把json对象串转换成map对象 
    * @param jsonObjStr e.g. {'name':'get','int':1,'double',1.1,'null':null} 
    * @return Map 
    */  
//    @SuppressWarnings("unchecked")
//	public static Map getMapFromJsonObjStr(String jsonObjStr) {  
//        JSONObject jsonObject = JSONObject.fromObject(jsonObjStr);  
//  
//        Map map = new HashMap();  
//        for (Iterator iter = jsonObject.keys(); iter.hasNext();) {  
//            String key = (String) iter.next();  
//            map.put(key, jsonObject.get(key));  
//        }  
//        return map;  
//    }
	
	public static void main(String[] args) {
		String aa= "{\"name3\":\"value3\",\"name1\":\"value1\",\"name2\":\"value2\"}";
		try {
//			System.out.println(JSONUtil.getMapFromJsonObjStr(aa).toString());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}
