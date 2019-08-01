package td.enterprise.wanalytics.etl.util;

import org.apache.htrace.fasterxml.jackson.databind.DeserializationFeature;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.JavaType;
import td.enterprise.wanalytics.etl.bean.AppTypes;

import java.io.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class JsonUtils {

	private static ObjectMapper mapper;
	
	static {
		mapper = new ObjectMapper();
	}
	
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

	public static String toJsonString(Object object) {
		try {
			return mapper.writeValueAsString(object);
		} catch (IOException e) {
			return null;
		}
	}
	
	public static void main(String []args) throws IOException{
//		String json = FileUtil.readFileAsString(new File("H:\\xiangmu\\data.log.2017-06-06-14.1"));
//		FileInputStream in = new FileInputStream(new File("H:\\xiangmu\\data.log.2017-06-06-14.2"));
//		InputStreamReader isr = new InputStreamReader(in, "UTF-8");
//		BufferedReader reader = new BufferedReader(isr);
//		String tempString = null;
//		List<String> stringList = new ArrayList<>();
//		while ((tempString = reader.readLine()) != null) {
//			stringList.add(tempString);
//		}
//
//		Collections.sort(stringList, new Comparator<String>() {
//			@Override
//			public int compare(String o1, String o2) {
//				long s1 = Long.parseLong(getPattern(o1));
//				long s2 = Long.parseLong(getPattern(o2));
//				if (s1 > s2){
//					return 1;
//				}else if (s1 < s2){
//					return -1;
//				}else {
//					return 0;
//				}
//
//			}
//		});
//			List<Map> list = jsonToObjectList(json,Map.class);
	}
	private static String getPattern(String str){
		Pattern p1 = Pattern.compile("\"tsreceive\":(\\d*)");
		Matcher m1 = p1.matcher(str);
		String srt = "";
		while (
				m1.find()
				){
			srt = m1.group(1);
		}
		return srt;
	}
}
