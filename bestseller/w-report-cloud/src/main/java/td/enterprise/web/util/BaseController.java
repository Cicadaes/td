package td.enterprise.web.util;

/**
 * Created by Yan on 2017/3/6.
 */


import java.util.HashMap;
import java.util.Map;

public class BaseController {
    /**
     * 返回成功数据
     *
     * @param data
     * @return
     */
    public Map<String, Object> getSuccessData(Object data) {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put(RestConstant.SUCCESS, true);
        resultMap.put(RestConstant.DATA, data);
        return resultMap;
    }

    public Map<String, Object> getGridData(int total, Object rows) {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put("total", total);
        resultMap.put("rows", rows);
        return resultMap;
    }

    /**
     * 返回成功消息
     *
     * @param msg
     * @return
     */
    public Map<String, Object> getSuccessMessage(String msg) {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put(RestConstant.SUCCESS, true);
        resultMap.put(RestConstant.MSG, msg);
        return resultMap;
    }

    /**
     * 返回成功消息
     *
     * @return
     */
    public Map<String, Object> getSuccessMessage() {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put(RestConstant.SUCCESS, true);
        return resultMap;
    }

    /**
     * 返回失败消息
     *
     * @param msg
     * @return
     */
    public Map<String, Object> getFailureMessage(String msg) {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        resultMap.put(RestConstant.SUCCESS, false);
        resultMap.put(RestConstant.MSG, msg);
        return resultMap;
    }
}

