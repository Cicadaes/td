package com.talkingdata.analytics.wifi.collector.servlet.response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Created by loong on 4/13/16.
 */
public class ResponseEntity {
    private int code;
    private String msg;
    private static ObjectMapper mapper = new ObjectMapper();

    public static final int FAILED_CODE = -1;
    public static final int SUCCESS_CODE = 0;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public ResponseEntity(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public static String NULL_REQ_EXCEPTION;
    public static String REQ_OK;

    static {
        if (NULL_REQ_EXCEPTION == null) {
            ResponseEntity responseEntity = new ResponseEntity(FAILED_CODE, "Request is null.");
            try {
                NULL_REQ_EXCEPTION = mapper.writeValueAsString(responseEntity);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        if (REQ_OK == null) {
            ResponseEntity responseEntity = new ResponseEntity(SUCCESS_CODE, "Request succ.");
            try {
                REQ_OK = mapper.writeValueAsString(responseEntity);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
    }


    public String toJsonString() throws JsonProcessingException {
        return mapper.writeValueAsString(this);
    }

}
