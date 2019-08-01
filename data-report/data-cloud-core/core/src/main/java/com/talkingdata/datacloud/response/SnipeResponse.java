package com.talkingdata.datacloud.response;

import com.alibaba.fastjson.JSONObject;

/**
 * Created by ssq on 2016/11/9.
 */
public class SnipeResponse {

    public static final String SUCCESS = "OK";
    private static final String MESSAGE = "message";
    public static final String CODE = "code";
    public static final String RESULT = "result";
    public static final String STATUS = "status";
    public static final int SUCCESS_CODE = 1;
    public static final int FAILUE_CODE = -1;

    public static JSONObject successResponse() {
        JSONObject response = new JSONObject();
        JSONObject status = new JSONObject();
        status.put(MESSAGE, SUCCESS);
        status.put(CODE, SUCCESS_CODE);
        response.put(STATUS, status);
        return response;
    }

    public static JSONObject errorResponse(String errorMsg) {
        JSONObject response = new JSONObject();
        JSONObject status = new JSONObject();
        status.put(MESSAGE, errorMsg);
        status.put(CODE, FAILUE_CODE);
        response.put(STATUS, status);
        return response;
    }

    public static JSONObject dataResponse(Object data) {
        JSONObject response = new JSONObject();
        JSONObject status = new JSONObject();
        status.put(MESSAGE, SUCCESS);
        status.put(CODE, SUCCESS_CODE);
        response.put(STATUS, status);
        response.put(RESULT, data);
        return response;
    }

    public static JSONObject paramResponse(String key, Object data) {
        JSONObject response = new JSONObject();
        JSONObject status = new JSONObject();
        JSONObject result = new JSONObject();
        status.put(MESSAGE, SUCCESS);
        status.put(CODE, SUCCESS_CODE);
        result.put(key, data);
        response.put(STATUS, status);
        response.put(RESULT, result);
        return response;
    }

}
