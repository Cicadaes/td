package com.talkingdata.datacloud.adapter.util;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.talkingdata.datacloud.util.HttpUtil;
import org.json.JSONArray;

/**
 * Created by xuan on 2017/2/16.
 */
public class HttpRestUtil extends HttpUtil{
    public static boolean testConnection(String urlPath) {
        Integer status;
        try {
            HttpResponse<String> response= Unirest.get(urlPath).asString();
            status = response.getStatus();
        }catch (Exception e) {
            status = -1;
        }
        return status == 200;
    }

    public static JSONArray getJson(String url){
        HttpResponse<JsonNode> jsonResponse = null;
        try {
            jsonResponse = Unirest.get(url)
                    .asJson();
        } catch (UnirestException e) {
            e.printStackTrace();
        }
        JSONArray jsonArray = jsonResponse.getBody().getArray();
        return jsonArray;
    }

    public static String postJson(String url,String body){
        return post(url,null,null,null,null,null,null,null,body,true);
    }
}
