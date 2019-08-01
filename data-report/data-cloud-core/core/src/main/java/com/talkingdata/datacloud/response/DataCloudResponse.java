package com.talkingdata.datacloud.response;

import com.alibaba.fastjson.JSONObject;

/**
 * Created by gjqiao on 2016/11/9.
 */
public class DataCloudResponse {

    public static final String SUCCESS = "success";
    private static final String STATUS = "status";
    public static final String ID = "id";
    public static final String RESULT = "result";
    public static final String SUCCESS_STATUS = "200";

    public static JSONObject successResponse(long id) {
        JSONObject response = new JSONObject();
        response.put(STATUS, SUCCESS);
        response.put(ID, id);
        return response;
    }

    public static JSONObject successResponse() {
        JSONObject response = new JSONObject();
        response.put(STATUS, SUCCESS);
        return response;
    }

    public static JSONObject dataResponse(Object data) {
        JSONObject response = new JSONObject();
        response.put(SUCCESS, SUCCESS_STATUS);
        response.put(RESULT, data);
        return response;
    }

    public static JSONObject paramResponse(String key, Object data) {
        JSONObject response = new JSONObject();
        response.put(STATUS, SUCCESS);
        response.put(key, data);
        return response;
    }

}
