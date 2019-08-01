package com.talkingdata.marketing.core.middleware;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.talkingdata.marketing.core.constant.AppConfigConstants;
import com.talkingdata.marketing.core.constant.PushConstants;
import com.talkingdata.marketing.core.entity.thirdmodel.push.AppConfReq;
import com.talkingdata.marketing.core.entity.thirdmodel.push.ProductSyncReq;
import com.talkingdata.marketing.core.entity.thirdmodel.push.ThirdChannelConf;
import com.talkingdata.marketing.core.entity.thirdmodel.push.UploadPemResp;
import com.talkingdata.marketing.core.entity.thirdmodel.push.VmResponse;
import com.talkingdata.marketing.core.util.JsonUtil;
import com.talkingdata.marketing.core.util.HttpClientUtil;
import com.talkingdata.marketing.core.util.HttpUtil;
import org.apache.commons.io.FileUtils;
import org.apache.http.Consts;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * The type App conf api.
 * @author xiaoming.kang
 */
@Component
public class AppConfApi {
    private static final Logger logger = LoggerFactory.getLogger(UserCloudApi.class);
    private static final String GATEWAY_HOST = "";
    private static final String GATEWAY_PORT = "";
    private static final String GATEWAY_USER = "";
    private static final String GATEWAY_PWD = "";
    private static String uploadPemAddr = "/push/api/app/pem/upload";
    private static String syncXiaomiHuaweiApi = "/push/api/app/update/channel/%s/%s";
    private static String verifyXiaomiHuaweiApi = "/push/api/app/%s/%s/verify/%s";
    private static String syncGetuiJpushApi = "/push/bind/add";
    private static String syncAppConfApi = "/push/api/app/sync";
    @Autowired
    private ApiLog apiLog;
    @Autowired
    private ConfigApi configApi;

    private File generateFile(MultipartFile file) throws IOException {
        String pathname = "certificate/" + file.getOriginalFilename() + "_" + UUID.randomUUID().toString();
        File certificate = new File(pathname);
        FileUtils.copyInputStreamToFile(file.getInputStream(), certificate);
        return certificate;
    }

    /**
     * Upload pem upload pem resp.
     * curl http://172.23.6.80:4000/push/api/app/pem/upload/58b4f458df5cf24c16d078f7/0 -F "uploadFile=@/home/zmy/newsda/Certificates.p12" -F "pwd=123" -u td@tendcloud.com:88888888
     * @param pwd   the pwd
     * @param file  the file
     * @param appId the app id
     * @param prod  the prod
     * @return the upload pem resp
     * @throws IOException the io exception
     */
    public UploadPemResp uploadPem(String pwd, MultipartFile file, String appId, int prod) throws IOException{

        String authorization = HttpUtil.getAuthorization(GATEWAY_USER, GATEWAY_PWD);
        String mpushApp = String.format("%s-%s", PushConstants.GatewaySourceConstant.MARKETING_PUSH_SOURCE, appId);
        String url = GATEWAY_HOST + ":" + GATEWAY_PORT + uploadPemAddr + "/" + mpushApp + "/" + prod;
        File f = generateFile(file);
        // FileSystemResource resource = new FileSystemResource(f);
        // MultiValueMap<String, Object> param = new LinkedMultiValueMap<String, Object>();
        // param.add("uploadFile", resource);
        // param.add("pwd", pwd);
        // HttpHeaders headers = HttpUtil.createHeaders(GATEWAY_USER, GATEWAY_PWD);
        // headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        // HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<MultiValueMap<String, Object>>(param, headers);
        // ResponseEntity<String> exchange;

        // 把文件转换成流对象FileBody
        FileBody bin = new FileBody(f);
        org.apache.http.HttpEntity reqEntity = MultipartEntityBuilder.create()
                .addPart("uploadFile", bin)
                // 相当于<input pwd="xxx">
                .addPart("pwd", new StringBody(pwd, ContentType.create("text/plain", Consts.UTF_8)))
                .build();

        UploadPemResp uploadPemResp = null;
        String resp = null;
        try {
            // exchange = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
            resp = HttpClientUtil.post(url, authorization, reqEntity, "UTF-8");
        } catch (Exception e) {
            apiLog.printThirdApiLog("AppConfApi", "uploadPem", url, resp, e);
            uploadPemResp = new UploadPemResp();
            uploadPemResp.setDesc("向推送系统同步ios证书报错");
            return uploadPemResp;
        }
       
        VmResponse vmResponse = JsonUtil.toObject(resp, VmResponse.class);
        if (!vmResponse.getResult()) {
            uploadPemResp = new UploadPemResp();
            uploadPemResp.setDesc(vmResponse.getDescribe());
            return uploadPemResp;
        }
        uploadPemResp = JsonUtil.toObject(vmResponse.getDescribe(), UploadPemResp.class);
        uploadPemResp.setDesc("ok");
        FileUtils.forceDelete(f);
        return uploadPemResp;
    }

    /**
     * Update channel conf string.
     *
     * @param req the req
     * @return the string
     */
    public String updateChannelConf(AppConfReq req) throws IOException {
        String url = GATEWAY_HOST + ":" + GATEWAY_PORT;
        String result = "fail";
        switch (req.getChannel()){
            case AppConfigConstants.PUSH_THIRD_XIAOMI:
            case AppConfigConstants.PUSH_THIRD_HUAWEI:
                //todo 由于没有相关账号 暂时注释校验代码
//                if (!verifyXiaomiHuawei(url, req)) {
//                    return "fail";
//                }
                result =  syncXiaomiHuawei(url, req);
                break;
            case AppConfigConstants.PUSH_THIRD_JPUSH:
            case AppConfigConstants.PUSH_THIRD_GETUI:
                result =  syncGetuiJpush(url, req);
                break;
            default:
                break;
        }
        return result;
    }

    /**
     * Verify xiaomi huawei boolean.
     *
     * @param url the url
     * @param req the req
     * @return the boolean
     */
    public boolean verifyXiaomiHuawei(String url, AppConfReq req) throws JsonProcessingException {
        String authorization = HttpUtil.getAuthorization(GATEWAY_USER, GATEWAY_PWD);
        if (req.getChannel() == AppConfigConstants.PUSH_THIRD_XIAOMI) {
            url += String.format(verifyXiaomiHuaweiApi, PushConstants.GatewaySourceConstant.MARKETING_PUSH_SOURCE,req.getApp(),"xm");
        } else if (req.getChannel() == AppConfigConstants.PUSH_THIRD_HUAWEI) {
            url += String.format(verifyXiaomiHuaweiApi, PushConstants.GatewaySourceConstant.MARKETING_PUSH_SOURCE,req.getApp(),"hw");
        }
        MultiValueMap<String, Object> param = new LinkedMultiValueMap<String, Object>();
        param.add("app",req.getThirdApp());
        param.add("secret",req.getThirdSecret());
        String str = JsonUtil.toJson(param);
        String resp;
        try {
            // resp = HttpClientUtil.post(url, authorization, str, "UTF-8");
            resp = HttpClientUtil.post(url, authorization, param, "UTF-8");
        } catch (Exception e) {
            apiLog.printThirdApiLog("AppConfApi", "verifyXiaomiHuawei", url, str, e);
            return false;
        }
        return true;

    }

    /**
     * Sync xiaomi huawei string.
     *
     * @param url  the url
     * @param conf the conf
     * @return the string
     */
    public String syncXiaomiHuawei(String url, AppConfReq conf) throws JsonProcessingException {
        String authorization = HttpUtil.getAuthorization(GATEWAY_USER, GATEWAY_PWD);
        MultiValueMap<String, Object> param = new LinkedMultiValueMap<String, Object>();
        if (conf.getChannel() == AppConfigConstants.PUSH_THIRD_HUAWEI) {
            param.add("happ", conf.getThirdApp());
            param.add("hsecret", conf.getThirdSecret());
        } else if (conf.getChannel() == AppConfigConstants.PUSH_THIRD_XIAOMI){
            param.add("xapp", conf.getThirdApp());
            param.add("xsecret", conf.getThirdSecret());
        }
        url = url + String.format(syncXiaomiHuaweiApi, PushConstants.GatewaySourceConstant.MARKETING_PUSH_SOURCE,conf.getApp());
        String str = JsonUtil.toJson(param);
        String resp;
        try {
            // resp = HttpClientUtil.post(url, authorization, str, "UTF-8");
            resp = HttpClientUtil.post(url, authorization, param, "UTF-8");
        } catch (Exception e) {
            apiLog.printThirdApiLog("AppConfApi", "syncXiaomiHuawei", url, str, e);
            return "fail";
        }
        return resp;
    }

    /**
     * Sync getui jpush string.
     *
     * @param url  the url
     * @param conf the conf
     * @return the string
     */
    public String syncGetuiJpush(String url, AppConfReq conf) throws IOException {
        url = url + syncGetuiJpushApi;
        ThirdChannelConf c = new ThirdChannelConf();
        c.setBindKey(conf.getPid());
        c.setSourceName(PushConstants.GatewaySourceConstant.MARKETING_PUSH_SOURCE);
        Map<String,String> m = new HashMap<>(16);
        m.put("appKey", conf.getThirdKey());
        m.put("masterSecret", conf.getThirdSecret());
        if (conf.getChannel() == AppConfigConstants.PUSH_THIRD_GETUI){
            c.setChannelKey("getui");
            m.put("appID", conf.getThirdApp());
        } else if (conf.getChannel() == AppConfigConstants.PUSH_THIRD_JPUSH){
            c.setChannelKey("jpush");
        }
        c.setBindValue(m);
        String str = JsonUtil.toJson(c);
        String resp;
        try {
            // resp = HttpClientUtil.post(url, str, "UTF-8");
            resp = HttpClientUtil.postWithJson(url, str);
        } catch (Exception e) {
            apiLog.printThirdApiLog("AppConfApi", "syncGetuiJpush", url, str, e);
            return "fail";
        }
        VmResponse vmResponse = JsonUtil.toObject(resp, VmResponse.class);
        if (vmResponse.getResult() != null && !vmResponse.getResult()) {
            return vmResponse.getDescribe();
        }
        return "ok";
    }

    /**
     * Sync app to push.
     *
     * @param productSyncReqList the product sync req list
     */
    public void syncAppToPush(List<ProductSyncReq> productSyncReqList) throws JsonProcessingException {
        String authorization = HttpUtil.getAuthorization(GATEWAY_USER, GATEWAY_PWD);
        HttpHeaders headers = HttpUtil.createHeaders(GATEWAY_USER, GATEWAY_PWD);
        String url = GATEWAY_HOST + ":" + GATEWAY_PORT;
        url = url + syncAppConfApi;
        headers.setContentType(MediaType.APPLICATION_JSON);

        for (ProductSyncReq p : productSyncReqList) {
            String str = JsonUtil.toJson(p);
            String resp;
            try {
                // resp = HttpClientUtil.post(url, authorization, str, "UTF-8");
                resp = HttpClientUtil.postWithJson(url, authorization, str);
                logger.info("sync app response:"+ resp);
            } catch (Exception e) {
                apiLog.printThirdApiLog("AppConfApi", "syncAppToPush", url, str, e);
            }


        }
    }
}
