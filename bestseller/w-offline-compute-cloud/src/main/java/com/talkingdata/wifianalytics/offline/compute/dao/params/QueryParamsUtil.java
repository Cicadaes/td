package com.talkingdata.wifianalytics.offline.compute.dao.params;

import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by loong on 4/26/16.
 */
public class QueryParamsUtil {
    public static final String TENANT_ID = "tenant_id";
    public static final String PROJECT_ID = "project_id";
    public static final String PLACE_ID = "place_id";
    public static final String SENSOR_ID = "sensor_id";
    public static final String ROOM_ID = "room_id";
    public static final String DATE_START = "start";
    public static final String DATA_END = "end";
    public static final String CROWD_ID = "crowd_id";
    public static final String DATE = "date";
    public static final String DATA_TYPE = "data_type";


    private static Map<String, Object> buildParams(String tenant_id, int project_id) {
        Map<String, Object> params = new HashMap<String, Object>();
        if (StringUtils.isNotBlank(tenant_id)) {
            params.put(TENANT_ID, tenant_id);
        }
        if (project_id > 0) {
            params.put(PROJECT_ID, project_id);
        }
        return params;
    }

    public static Map<String, Object> buildParams(String tenant_id, int project_id, String date, int data_type) {
        Map<String, Object> params = buildParams(tenant_id, project_id);
        params.put(DATE, date);
        params.put(DATA_TYPE, data_type);
        return params;
    }
    
    public static Map<String, Object> buildParams4Room(String tenant_id, int project_id, int place_id, int room_id, String date, int data_type) {
        Map<String, Object> params = buildParams(tenant_id, project_id, date, data_type);
        if (place_id > 0) {
            params.put(PLACE_ID, place_id);
        }
        if (room_id > 0) {
            params.put(ROOM_ID, room_id);
        }
        return params;
    }

    public static Map<String, Object> buildParams(String tenant_id, int project_id, String start, String end) {
        Map<String, Object> params = buildParams(tenant_id, project_id);
        params.put(DATE_START, start);
        params.put(DATA_END, end);
        return params;
    }
    
    public static Map<String, Object> buildParams4Room(String tenant_id, int project_id, int place_id, int room_id, String start, String end) {
    	Map<String, Object> params = buildParams(tenant_id, project_id, start, end);
    	 if (place_id > 0) {
             params.put(PLACE_ID, place_id);
         }
         if (room_id > 0) {
             params.put(ROOM_ID, room_id);
         }
        return params;
    }


    public static Map<String, Object> buildParams(String tenant_id, int project_id,
                                                  int place_id, int sensor_id, String start, String end) {
        Map<String, Object> params = buildParams(tenant_id, project_id, start, end);
        if (place_id > 0) {
            params.put(PLACE_ID, place_id);
        }
        if (sensor_id > 0) {
            params.put(SENSOR_ID, sensor_id);
        }
        return params;
    }
}
