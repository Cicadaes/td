package td.enterprise.common.util;


import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.lang.reflect.Field;
import java.util.*;

//import net.sf.json.JSONObject;


public class JSONUtil {

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
    public static String objToJsonFormat(Object obj) throws Exception {

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
    public static List<?> jsonToList(String jsonStr, Class<?> clazz) throws Exception {
        TypeFactory typeFactory = TypeFactory.defaultInstance();
        // 指定容器结构和类型（这里是ArrayList和clazz）
        List<?> list = objectMapper.readValue(jsonStr, typeFactory.constructCollectionType(ArrayList.class, clazz));

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
    public static Map<String, List<Object>> jsonToMap(String jsonStr, Class<?> clazz) throws Exception {

        Map<String, List<Object>> map = objectMapper.readValue(jsonStr,
                new TypeReference<Map<String, List<Object>>>() {
                });

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
    public static Object jsonToBean(String jsonStr, Class<?> clazz) throws IOException {
        Object obj = objectMapper.readValue(jsonStr, clazz);
        return obj;
    }

    /**
     * json字符串生成待导出文件
     *
     * @param request
     * @param json
     * @return
     */
    public static File jsonToFile(HttpServletRequest request, String json, String fileName) throws Exception {

        File f = createFile(request, fileName);

        FileOutputStream fileOutputStream = null;
        OutputStreamWriter outputStreamWriter = null;
        BufferedWriter bufferedWriter = null;
        fileOutputStream = new FileOutputStream(f);
        outputStreamWriter = new OutputStreamWriter(fileOutputStream, "UTF-8");
        bufferedWriter = new BufferedWriter(outputStreamWriter);
        bufferedWriter.write(json);
        bufferedWriter.flush();
        bufferedWriter.close();
        outputStreamWriter.close();
        fileOutputStream.close();
        return f;
    }

    public static File createFile(HttpServletRequest request, String fileName) throws IOException {

        File dir = new File(request.getSession().getServletContext().getRealPath(File.separator + "json"));
        File f = new File(request.getSession().getServletContext().getRealPath(File.separator + "json" + File.separator + fileName));

        if (!dir.exists()) {
            dir.mkdirs();
        }
        if (!f.exists()) {
            f.createNewFile();
        }

        return f;
    }

    /**
     * 实体对象转为map，含其父类属性
     *
     * @param obj
     * @return
     * @throws IllegalArgumentException
     * @throws IllegalAccessException
     */
    public static Map<String, Object> objToHash(Object obj) throws IllegalArgumentException, IllegalAccessException {

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
     *
     * @param map
     * @param obj
     * @return
     * @throws IllegalArgumentException
     * @throws IllegalAccessException
     */
    public static void mapToObj(Map<String, Object> map, Object obj) throws IllegalArgumentException, IllegalAccessException {
        Class clazz = obj.getClass();
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            if (map.containsKey(field.getName())) {
                if (field.getType().equals(Date.class)) {
                    if (map.get(field.getName()) != null) {
                        field.set(obj, new Date((Long) map.get(field.getName())));
                    }
                } else {
                    field.set(obj, map.get(field.getName()));
                }
            }
        }
    }

    public static String objectToJsonStr(Object object) throws IOException {
        ObjectMapper om = new ObjectMapper();
        String result = om.writeValueAsString(object);
        return result;
    }

    public static <T> T jsonToObject(String json, Class<T> clazz) throws IOException {
        ObjectMapper om = new ObjectMapper();
        return om.readValue(json, clazz);
    }

    public static <T> List<T> jsonToObjectList(String json, Class<T> clazz) throws IOException {
        ObjectMapper om = new ObjectMapper();
        JavaType javaType = om.getTypeFactory().constructParametricType(ArrayList.class, clazz);
        List<T> list = om.readValue(json, javaType);
        return list;
    }

    public static <T> T objectToObject(Object sourceObject, Class<T> targetClazz) throws IOException {
        String sourceStr = objectToJsonStr(sourceObject);
        return jsonToObject(sourceStr, targetClazz);
    }

}
