package com.talkingdata.datacloud.visual.util;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.JavaType;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class JSONUtils {
	
	private static ObjectMapper mapper = new ObjectMapper();
	
	public static String writeValueAsString(Object obj) throws Exception{
		if(obj==null)return null;
		return mapper.writeValueAsString(obj);
	}

	public static String writeValueAsCunstomString(Object obj,String dateFormat) throws Exception{
		ObjectMapper customJsonDateConverter = new CustomJsonDateConverter(dateFormat);
		return customJsonDateConverter.writeValueAsString(obj);
	}

	@SuppressWarnings("unchecked")
	public static Map<String,Object> readValueToMap(String json) throws Exception{
		if(json==null)return null;
		return mapper.readValue(json, Map.class);
	}
	public static List<String> readValueToList(JsonNode node) throws Exception{
		JavaType javaType = mapper.getTypeFactory().constructParametricType(List.class,String.class);
		List<String> obj =null; 
		if (node.isObject()) {
             obj = mapper.readValue(node.traverse(), javaType);
         } else if (node.isTextual()) {
             obj = mapper.readValue(node.getValueAsText(), javaType);
         }
		return obj;
	}
	public static <T> T readValue(JsonNode node, Class<T> clazz) throws Exception{
		T obj = null;
		if (clazz != null) {
             if (node.isObject()) {
                 obj = mapper.readValue(node.traverse(), clazz);
             } else if (node.isTextual()) {
                 obj = mapper.readValue(node.getValueAsText(), clazz);
             }
         }
		
		return obj;
	}
	
	public static JsonNode readTree(String json) throws Exception{
		return  mapper.readTree(json);
	}
	public static JsonNode readTree(String json, int index) throws Exception{
		JsonNode node = mapper.readTree(json);
		return node.get(index);
	}
	public static JsonNode readTree(String json, String index) throws Exception{
		JsonNode node = mapper.readTree(json);
		return node.get(index);
	}
	
	public static <T> T readValueToBean(String json,Class<T> clazz) throws Exception{
		return mapper.readValue(json, clazz);
	}
	
	
	public static void main(String[] args) throws Exception {
//		String aa ="{\"id\":\"native_productcenter_product\",\"title\":\"产品列表\"}";
//		Map<String, Object> map = new HashMap<>();
//		map.put("id", "11");
//		map.put("age", "12");
//		map.put("date",new Date());
//
//		String aa = writeValueAsCunstomString(map,"yyyy-MM-dd");
//		System.out.println(aa);
//		Map<String, Object> map1 =  readValueToMap(aa);
//		System.out.println(map1.toString());


		Set variableSet=new HashSet();
		String mothods="[{\"methodName\":\"getMetaData\",\"methodPath\":\"report/dataSources/id/metaData\",\n" +
				"\"sendValue\":{\"datasource_id\":\"${dataSource}\"},\n" +
				"\"resultValue\":{\"dimensoins\":[\"${dimension_0}\",\"${dimension_1}\"],\n" +
				"\"metrics\":[\"${metric}\"]}},{\"methodName\":\"getData\",\"methodPath\":\"report/dataSources/id/data\",\n" +
				"\"sendValue\":{\"datasource_id\":\"${dataSource}\",\"dimensions\":[{\"field\":\"${dimension}\",\"function\":null,\"alias\":\"name\"}],\n" +
				"\"metrics\":[{\"field\":\"${metric}\",\"function\":null,\"alias\":\"value\"}],\n" +
				"\"filters\":[{\"field\":\"${dateDimension}\",\"operator\":\">=\",\n" +
				"\"value\":\"${dateDimensionValue.startDate}\"},{\"field\":\"${dateDimension}\",\n" +
				"\"operator\":\"<=\",\"value\":\"${dateDimensionValue.endDate}\"}],\"limit\":[],\"orderBy\":[],\"groupBy\":[]}}]";

//		Pattern pattern = Pattern.compile("\\$\\{([\\d+A-Za-z_]+)\\}");
//		Matcher matcher = pattern.matcher (mothods);
//		while (matcher.find ())
//		{
//			System.out.println (matcher.group (1));
//		}
		String testStr="Dimension_name_Limit";

		System.out.println(testStr.substring(0,testStr.lastIndexOf("_")));


		String testStr2="Dimension_name_Limit";
		System.out.println(testStr2.substring(testStr2.indexOf("Dimension_")+10));
	}
}
