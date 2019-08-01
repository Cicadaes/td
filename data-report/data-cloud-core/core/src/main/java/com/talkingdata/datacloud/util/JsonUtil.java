package com.talkingdata.datacloud.util;

import java.util.*;

/**
 * Created by yashiro on 17/2/15.
 */
public class JsonUtil {

    public static Object datasetColumnDatas() {
        /*String column = "{\n" +
                "    status: {\n" +
                "        code: 1, \n" +
                "        message: \"OK\"\n" +
                "    }, \n" +
                "    result: [\n" +
                "        {\n" +
                "            fieldId: \"2\", \n" +
                "            fieldName: \"col2\", \n" +
                "            fieldType: \"Number\", \n" +
                "            column: [\n" +
                "                2.3, \n" +
                "                5.3\n" +
                "            ]\n" +
                "        }, \n" +
                "        {\n" +
                "            fieldId: \"1\", \n" +
                "            fieldName: \"col1\", \n" +
                "            fieldType: \"Number\", \n" +
                "            column: [\n" +
                "                3.2, \n" +
                "                5.2\n" +
                "            ]\n" +
                "        }\n" +
                "    ]\n" +
                "}";
        return column;*/

        Map<String, Object> total = new LinkedHashMap<String, Object>();

        Map<String, Object> statusMap = new HashMap<String, Object>();
        statusMap.put("code", 1);
        statusMap.put("message", "OK");


        List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
        Map<String, Object> resultMap1 = new HashMap<String, Object>();
        resultMap1.put("fieldId", "2");
        resultMap1.put("fieldName", "col2");
        resultMap1.put("fieldType", "Number");
        resultMap1.put("column", new Double[]{2.3d, 5.3d});

        Map<String, Object> resultMap2 = new HashMap<String, Object>();
        resultMap2.put("fieldId", "1");
        resultMap2.put("fieldName", "col1");
        resultMap2.put("fieldType", "Number");
        resultMap2.put("column", new Double[]{3.2d, 5.2d});
        result.add(resultMap1);
        result.add(resultMap2);

        total.put("status", statusMap);
        total.put("result", result);
        return total;
    }

}
